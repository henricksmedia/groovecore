// =============================================================================
// GrooveCore — js/perf/midi-in.js (WS-D)
// Web MIDI input. Feature-detected #midiInBtn; click requests MIDI access
// ({ sysex: false }); note-ons are routed through the reverse map
// (GrooveCoreMIDI.MIDI_TO_INSTRUMENT_MAPPING) and triggered with their real
// velocity; velocity-0 note-ons (running-status note-offs) are ignored;
// statechange hot-plugs devices; the button shows the connected device name.
// =============================================================================

const NOTE_ON = 0x90;

let GCRef = null;
let midiAccess = null;
let btn = null;
let connected = false;

// ---------------------------------------------------------------------------
// Shared GCInput hit registry (§5.7 — owned by pads.js + midi-in.js)
// ---------------------------------------------------------------------------

function ensureGCInput() {
  if (!window.GCInput || typeof window.GCInput.onHit !== 'function') {
    const cbs = [];
    window.GCInput = {
      onHit(cb) {
        if (typeof cb === 'function') cbs.push(cb);
        return () => {
          const i = cbs.indexOf(cb);
          if (i >= 0) cbs.splice(i, 1);
        };
      },
      _emit(hit) {
        cbs.slice().forEach((cb) => {
          try { cb(hit); } catch (e) { console.warn('[gc-input]', e); }
        });
      }
    };
  }
  return window.GCInput;
}

function emitHit(hit) {
  const input = ensureGCInput();
  if (typeof input._emit === 'function') input._emit(hit);
}

function toast(msg, type) {
  try {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
      window.GCToast.show(msg, { type: type || 'info' });
      return;
    }
  } catch (e) { /* fall through */ }
  console.log('[gc-midi-in]', msg);
}

// ---------------------------------------------------------------------------
// Note routing
// ---------------------------------------------------------------------------

function instrumentForNote(note) {
  try {
    const midi = window.GrooveCoreMIDI;
    const reverse = midi && midi.MIDI_TO_INSTRUMENT_MAPPING;
    const insts = reverse ? reverse[note] : null;
    if (Array.isArray(insts)) {
      // A note can map to several codes (legacy collisions) — take the first
      // playable voice; "accent" is a row flag, not a voice.
      return insts.find((i) => i !== 'accent') || null;
    }
    if (typeof insts === 'string' && insts !== 'accent') return insts;
  } catch (e) { /* mapping not loaded */ }
  return null;
}

function triggerVoice(inst, velocity, accent) {
  const audio = window.GrooveAudio;
  if (audio && typeof audio.trigger === 'function') {
    try {
      audio.trigger(inst, { velocity, accent, immediate: true });
      return;
    } catch (e) { /* fall through to the legacy path */ }
  }
  const gc = GCRef || window.GC;
  if (gc && gc.fns && typeof gc.fns.triggerInstrument === 'function') {
    try { gc.fns.triggerInstrument(inst, velocity / 127); } catch (e) { /* voice missing */ }
  }
}

function onMidiMessage(e) {
  try {
    const data = e.data;
    if (!data || data.length < 3) return;
    const status = data[0] & 0xf0;
    if (status !== NOTE_ON) return;
    const velocity = data[2];
    if (velocity === 0) return; // running-status note-off — never a hit

    const inst = instrumentForNote(data[1]);
    if (!inst) return;

    const accent = velocity >= 120;
    triggerVoice(inst, velocity, accent);

    let atTime = 0;
    try { atTime = (typeof Tone !== 'undefined') ? Tone.immediate() : performance.now() / 1000; }
    catch (err) { atTime = performance.now() / 1000; }

    emitHit({ inst, velocity, accent, source: 'midi', atTime });
  } catch (err) {
    console.warn('[gc-midi-in]', err);
  }
}

// ---------------------------------------------------------------------------
// Device management
// ---------------------------------------------------------------------------

function bindInputs() {
  if (!midiAccess) return;
  let name = null;
  let count = 0;
  midiAccess.inputs.forEach((input) => {
    input.onmidimessage = onMidiMessage;
    count++;
    if (!name) name = input.name || 'MIDI device';
  });
  connected = count > 0;
  updateButton(name, count);
}

function updateButton(name, count) {
  if (!btn) return;
  const label = btn.querySelector('.gc-midi-label') || btn;
  if (!connected) {
    label.textContent = midiAccess ? 'MIDI: no device' : 'MIDI IN';
    btn.classList.remove('gc-midi-connected');
    btn.title = midiAccess
      ? 'MIDI enabled — plug in a controller and play'
      : 'Enable Web MIDI input (finger drum from a controller)';
    return;
  }
  const short = String(name || 'MIDI device').slice(0, 18);
  label.textContent = count > 1 ? `${short} +${count - 1}` : short;
  btn.classList.add('gc-midi-connected');
  btn.title = `MIDI input active: ${name}${count > 1 ? ` (and ${count - 1} more)` : ''}`;
}

function requestAccess() {
  if (midiAccess) { bindInputs(); return; }
  navigator.requestMIDIAccess({ sysex: false }).then((access) => {
    midiAccess = access;
    midiAccess.onstatechange = bindInputs; // hot-plug: rebind on every change
    bindInputs();
    toast(connected ? 'MIDI input connected' : 'MIDI enabled — waiting for a device', 'success');
  }).catch(() => {
    toast('MIDI access was denied', 'error');
  });
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function injectStyles() {
  if (document.getElementById('gc-midi-in-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-midi-in-css';
  style.textContent = `
    #midiInBtn.gc-midi-connected {
      background: #16a34a !important; color: #fff;
      box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
    }
  `;
  document.head.appendChild(style);
}

function injectButton() {
  const existing = document.getElementById('midiInBtn');
  if (existing) {
    // Adopt the static placeholder (WS-J puts one in index.html): styles and
    // the click handler must still be wired exactly as for an injected button.
    btn = existing;
    injectStyles();
    if (!btn.dataset.gcMidiBound) {
      btn.dataset.gcMidiBound = '1';
      btn.addEventListener('click', requestAccess);
    }
    return;
  }
  const exportBtn = document.getElementById('exportMidi');
  const host = exportBtn ? exportBtn.parentElement : document.querySelector('.master-controls');
  if (!host) return;

  injectStyles();

  btn = document.createElement('button');
  btn.id = 'midiInBtn';
  btn.type = 'button';
  btn.className = exportBtn
    ? 'action-btn flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 rounded transition-colors'
    : 'action-btn';
  btn.innerHTML = '<span class="material-icons text-sm">piano</span><span class="gc-midi-label">MIDI IN</span>';
  btn.title = 'Enable Web MIDI input (finger drum from a controller)';
  btn.addEventListener('click', requestAccess);

  if (exportBtn) exportBtn.insertAdjacentElement('afterend', btn);
  else host.appendChild(btn);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;

  // Feature detect — no Web MIDI (Firefox without permission, Safari) means
  // no button and a clean no-op. A static placeholder button is hidden so it
  // never sits inert in unsupporting browsers.
  if (!navigator.requestMIDIAccess) {
    const placeholder = document.getElementById('midiInBtn');
    if (placeholder) placeholder.style.display = 'none';
    return;
  }

  ensureGCInput();
  injectButton();
}

export default { init };
