// =============================================================================
// GrooveCore — js/ui/tempo-tools.js (WS-D)
// Tap tempo + metronome.
//
// Tap tempo: T key (via keys.js) or the injected TAP button next to
// #bpmDisplay in .master-controls. Rolling average of the last 4–8 taps,
// >40%-off-median intervals discarded, tap history resets after 2.5s idle.
// Applies via GC.setBpm (bpm.rampTo under the hood — glitch-free while
// playing).
//
// Metronome: 2 kHz tick, 2.6 kHz beat-1 accent, its own
// Transport.scheduleRepeat('4n'). app.js calls Tone.Transport.cancel() every
// time playback starts, so the repeat is re-armed on GC.events 'play'.
// =============================================================================

const TAP_MAX = 8;          // keep at most the last 8 taps
const TAP_MIN = 2;          // need 2 taps (1 interval) for a first estimate
const TAP_RESET_MS = 2500;  // idle gap that starts a fresh tap run
const OUTLIER_RATIO = 0.4;  // discard intervals >40% away from the median

let GCRef = null;
let taps = [];

let metronomeOn = false;
let metronomeEventId = null;
let tickSynth = null;
let beatCounter = 0;

let tapBtn = null;
let metBtn = null;

// ---------------------------------------------------------------------------
// Tap tempo
// ---------------------------------------------------------------------------

function median(nums) {
  const s = nums.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function tap() {
  const now = performance.now();
  if (taps.length && now - taps[taps.length - 1] > TAP_RESET_MS) {
    taps = []; // stale run — start over
  }
  taps.push(now);
  if (taps.length > TAP_MAX) taps = taps.slice(-TAP_MAX);

  flashButton(tapBtn);
  if (taps.length < TAP_MIN) return;

  const intervals = [];
  for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1]);

  const med = median(intervals);
  const kept = intervals.filter((iv) => Math.abs(iv - med) <= med * OUTLIER_RATIO);
  if (!kept.length) return;

  const avg = kept.reduce((a, b) => a + b, 0) / kept.length;
  if (avg <= 0) return;
  const bpm = 60000 / avg;

  const gc = GCRef || window.GC;
  if (gc && typeof gc.setBpm === 'function') gc.setBpm(bpm);
}

// ---------------------------------------------------------------------------
// Metronome
// ---------------------------------------------------------------------------

function ensureTickSynth() {
  if (tickSynth || typeof window.Tone === 'undefined') return;
  try {
    tickSynth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 }
    }).toDestination();
    tickSynth.volume.value = -14;
  } catch (e) {
    tickSynth = null;
  }
}

function tickCallback(time) {
  try {
    if (!tickSynth) return;
    let beat = beatCounter % 4;
    // Prefer the Transport's own idea of the beat when available so the
    // accent lands on the real downbeat even after pattern switches.
    try {
      const ticks = Tone.Transport.getTicksAtTime(time);
      const ppq = Tone.Transport.PPQ || 192;
      beat = Math.round(ticks / ppq) % 4;
    } catch (e) { /* fall back to the local counter */ }
    beatCounter++;
    const accent = beat === 0;
    tickSynth.triggerAttackRelease(accent ? 2600 : 2000, 0.03, time, accent ? 1 : 0.55);
  } catch (e) { /* a tick must never break the transport callback */ }
}

function armMetronome() {
  if (typeof window.Tone === 'undefined') return;
  disarmMetronome();
  try {
    ensureTickSynth();
    beatCounter = 0;
    metronomeEventId = Tone.Transport.scheduleRepeat(tickCallback, '4n');
  } catch (e) {
    metronomeEventId = null;
  }
}

function disarmMetronome() {
  if (metronomeEventId === null || typeof window.Tone === 'undefined') return;
  try { Tone.Transport.clear(metronomeEventId); } catch (e) { /* already cancelled */ }
  metronomeEventId = null;
}

export function toggleMetronome() {
  metronomeOn = !metronomeOn;
  if (metronomeOn) armMetronome();
  else disarmMetronome();
  updateMetButton();
  toast(metronomeOn ? 'Metronome on' : 'Metronome off');
}

export function isMetronomeOn() {
  return metronomeOn;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function toast(msg) {
  try {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
      window.GCToast.show(msg, { type: 'info', duration: 1500 });
    }
  } catch (e) { /* toasts are optional */ }
}

function flashButton(btn) {
  if (!btn) return;
  btn.classList.add('gc-tap-flash');
  setTimeout(() => btn.classList.remove('gc-tap-flash'), 120);
}

function updateMetButton() {
  if (metBtn) metBtn.classList.toggle('gc-met-on', metronomeOn);
}

function injectStyles() {
  if (document.getElementById('gc-tempo-tools-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-tempo-tools-css';
  style.textContent = `
    .gc-tempo-tools { display: flex; flex-direction: column; gap: 4px; justify-content: center; margin: 0 6px; }
    .gc-tempo-tools button {
      font: 700 10px/1 'Roboto', sans-serif; letter-spacing: 0.08em;
      color: #ddd; background: #2a2a2a; border: 1px solid #555;
      border-radius: 4px; padding: 5px 9px; cursor: pointer;
      transition: background 0.12s, color 0.12s, box-shadow 0.12s;
      min-width: 44px;
    }
    .gc-tempo-tools button:hover { background: #3a3a3a; }
    .gc-tempo-tools button.gc-tap-flash { background: #ff6b35; color: #111; }
    .gc-tempo-tools button.gc-met-on {
      background: #ff6b35; color: #111; border-color: #ff8c5a;
      box-shadow: 0 0 6px rgba(255, 107, 53, 0.6);
    }
  `;
  document.head.appendChild(style);
}

function injectButtons() {
  if (document.getElementById('gc-tapTempoBtn')) return;
  const bpmDisplay = document.getElementById('bpmDisplay');
  const master = document.querySelector('.master-controls');
  if (!master) return;

  injectStyles();

  const wrap = document.createElement('div');
  wrap.className = 'gc-tempo-tools';
  wrap.id = 'gc-tempoTools';

  tapBtn = document.createElement('button');
  tapBtn.id = 'gc-tapTempoBtn';
  tapBtn.type = 'button';
  tapBtn.textContent = 'TAP';
  tapBtn.title = 'Tap tempo (T) — tap along to set the BPM';
  tapBtn.addEventListener('click', tap);

  metBtn = document.createElement('button');
  metBtn.id = 'gc-metronomeBtn';
  metBtn.type = 'button';
  metBtn.textContent = 'MET';
  metBtn.title = 'Metronome (M, or Ctrl+M while pads are active)';
  metBtn.addEventListener('click', toggleMetronome);

  wrap.appendChild(tapBtn);
  wrap.appendChild(metBtn);

  // Place directly next to the BPM display when its container is present,
  // otherwise at the front of the master controls strip.
  const bpmContainer = bpmDisplay ? bpmDisplay.closest('.bpm-display-container') : null;
  if (bpmContainer && bpmContainer.parentElement === master) {
    bpmContainer.insertAdjacentElement('afterend', wrap);
  } else {
    master.insertBefore(wrap, master.firstChild);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;

  injectButtons();

  // app.js calls Tone.Transport.cancel() on every play — re-arm the tick.
  if (GCRef && GCRef.events && typeof GCRef.events.on === 'function') {
    GCRef.events.on('play', () => {
      if (metronomeOn) armMetronome();
    });
  }

  // Register shortcuts with the router so the overlay lists them (keys.js
  // already delegates "t"/"m" to this module through window.GCTempoTools —
  // this is only for completeness when keys.js loaded without its defaults).
  window.GCTempoTools = { tap, toggleMetronome, isMetronomeOn };
}

export default { init, tap, toggleMetronome };
