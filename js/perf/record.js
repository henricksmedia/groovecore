// =============================================================================
// GrooveCore — js/perf/record.js (WS-D)
// Quantized live record. The injected #recordBtn arms only while GC.isPlaying.
// On every GCInput hit (pads / MIDI-in) it reads Tone.Transport.ticks,
// quantizes to the nearest 16th — rounding forward across the loop seam —
// and writes pattern.part1[step][inst] = velocity (plus the accent flag)
// through GC, then refreshes the grid via GC.fns.updateStepDisplay().
// Emits 'mutate:before' once per pattern pass so undo captures each lap.
// =============================================================================

let GCRef = null;
let armed = false;
let btn = null;
let unsubscribe = null;
let lastPass = null;

// ---------------------------------------------------------------------------
// Shared GCInput hit registry (created by pads.js / midi-in.js; recreated
// here only if record.js is the first perf module to boot)
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
        cbs.slice().forEach((fn) => {
          try { fn(hit); } catch (e) { console.warn('[gc-input]', e); }
        });
      }
    };
  }
  return window.GCInput;
}

function toast(msg, type) {
  try {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
      window.GCToast.show(msg, { type: type || 'info', duration: 2000 });
      return;
    }
  } catch (e) { /* fall through */ }
  console.log('[gc-record]', msg);
}

// ---------------------------------------------------------------------------
// Arm / disarm
// ---------------------------------------------------------------------------

function setArmed(on) {
  armed = on;
  lastPass = null;
  if (btn) btn.classList.toggle('gc-rec-armed', armed);
}

function onRecordClick() {
  const gc = GCRef || window.GC;
  if (armed) { setArmed(false); toast('Recording off'); return; }
  if (!gc || !gc.isPlaying) {
    toast('Press PLAY first, then arm record', 'warning');
    return;
  }
  setArmed(true);
  toast('Recording — play the pads (Z–, and A–L)');
}

// ---------------------------------------------------------------------------
// Quantize + write
// ---------------------------------------------------------------------------

function onHit(hit) {
  try {
    const gc = GCRef || window.GC;
    if (!armed || !gc || !gc.isPlaying) return;
    if (typeof Tone === 'undefined' || !Tone.Transport) return;

    const patterns = gc.patterns;
    const bank = patterns && patterns[gc.variation];
    const pattern = bank && bank[gc.currentPattern];
    if (!pattern || !Array.isArray(pattern.part1)) return;

    const len = pattern.length1 || 16;
    const ppq = Tone.Transport.PPQ || 192;
    const stepTicks = ppq / 4; // one 16th note
    const loopTicks = stepTicks * len;
    if (loopTicks <= 0) return;

    const ticks = Tone.Transport.ticks;
    const pos = ticks % loopTicks;

    // Nearest 16th; Math.round pushes the back half of the last step forward
    // to "step len", which wraps to step 0 of the next pass — the loop seam.
    let step = Math.round(pos / stepTicks);
    let pass = Math.floor(ticks / loopTicks);
    if (step >= len) { step = 0; pass += 1; }

    // One undo snapshot per pattern pass.
    if (pass !== lastPass) {
      lastPass = pass;
      if (gc.events && typeof gc.events.emit === 'function') {
        gc.events.emit('mutate:before');
      }
    }

    const cell = pattern.part1[step];
    if (!cell || typeof cell !== 'object') return;

    const velocity = Math.max(1, Math.min(127, Math.round(hit.velocity || 100)));
    cell[hit.inst] = velocity;
    if (hit.accent) cell.accent = true;

    if (gc.fns && typeof gc.fns.updateStepDisplay === 'function') {
      gc.fns.updateStepDisplay();
    }
  } catch (err) {
    console.warn('[gc-record]', err);
  }
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function injectStyles() {
  if (document.getElementById('gc-record-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-record-css';
  style.textContent = `
    #recordBtn {
      display: inline-flex; align-items: center; gap: 5px;
      font: 700 11px/1 'Roboto', sans-serif; letter-spacing: 0.08em;
      color: #ddd; background: #2a2a2a; border: 1px solid #555;
      border-radius: 6px; padding: 8px 12px; cursor: pointer;
      transition: background 0.12s, box-shadow 0.12s;
    }
    #recordBtn:hover { background: #3a3a3a; }
    #recordBtn .gc-rec-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #7a2c2c; transition: background 0.12s;
    }
    #recordBtn.gc-rec-armed {
      background: #7f1d1d; border-color: #dc2626; color: #fff;
      box-shadow: 0 0 8px rgba(220, 38, 38, 0.55);
    }
    #recordBtn.gc-rec-armed .gc-rec-dot { background: #ef4444; }
    @media (prefers-reduced-motion: no-preference) {
      #recordBtn.gc-rec-armed .gc-rec-dot { animation: gc-rec-pulse 1s ease-in-out infinite; }
      @keyframes gc-rec-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    }
  `;
  document.head.appendChild(style);
}

function injectButton() {
  const existing = document.getElementById('recordBtn');
  if (existing) {
    // Adopt the static placeholder (WS-J puts one in index.html): styles and
    // the click handler must still be wired exactly as for an injected button.
    btn = existing;
    injectStyles();
    if (!btn.dataset.gcRecBound) {
      btn.dataset.gcRecBound = '1';
      btn.addEventListener('click', onRecordClick);
    }
    return;
  }
  const controls = document.querySelector('.sequencer-controls');
  if (!controls) return;

  injectStyles();

  btn = document.createElement('button');
  btn.id = 'recordBtn';
  btn.type = 'button';
  btn.title = 'Live record: arm while playing, then finger drum (pads or MIDI) — hits are quantized to the nearest 16th';
  btn.innerHTML = '<span class="gc-rec-dot"></span><span>REC</span>';
  btn.addEventListener('click', onRecordClick);

  const playButton = document.getElementById('playButton');
  if (playButton && playButton.parentElement === controls) {
    playButton.insertAdjacentElement('afterend', btn);
  } else {
    controls.appendChild(btn);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;

  injectButton();

  const input = ensureGCInput();
  if (unsubscribe) { try { unsubscribe(); } catch (e) { /* stale */ } }
  unsubscribe = input.onHit(onHit);

  if (GCRef && GCRef.events && typeof GCRef.events.on === 'function') {
    GCRef.events.on('stop', () => {
      if (armed) { setArmed(false); toast('Recording off'); }
    });
  }
}

export default { init };
