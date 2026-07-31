// =============================================================================
// GrooveCore — js/perf/pads.js (WS-D)
// QWERTY finger drumming.
//
//   Z X C V B N M ,   ->  bd sd cp ch oh lt mt ht
//   A S D F G H J K L ->  rim cb cl ma hc mc lc cym cr
//
// e.repeat ignored. Base velocity 105; Shift = 127 + accent; Alt = ghost 60.
// Triggers via GrooveAudio.trigger(inst, { velocity, accent, immediate: true })
// for <=20ms latency (no Transport lookahead), emits to the window.GCInput
// onHit registry (record.js subscribes), and flashes the instrument row
// label for 80ms.
// =============================================================================

const FALLBACK_KEYMAP = {
  z: 'bd', x: 'sd', c: 'cp', v: 'ch', b: 'oh', n: 'lt', m: 'mt', ',': 'ht',
  a: 'rim', s: 'cb', d: 'cl', f: 'ma', g: 'hc', h: 'mc', j: 'lc', k: 'cym', l: 'cr'
};

const VEL_BASE = 105;
const VEL_ACCENT = 127;
const VEL_GHOST = 60;
const FLASH_MS = 80;

let GCRef = null;
let installed = false;
let keymap = FALLBACK_KEYMAP;
let codeMap = {}; // e.code -> inst (layout-independent: KeyZ, Comma, ...)

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

// ---------------------------------------------------------------------------
// Keymap
// ---------------------------------------------------------------------------

function resolveKeymap() {
  try {
    const params = window.GrooveParams;
    if (params && params.KEYMAP && typeof params.KEYMAP === 'object') {
      const entries = Object.entries(params.KEYMAP)
        .filter(([k, v]) => typeof k === 'string' && typeof v === 'string');
      if (entries.length) return Object.fromEntries(entries.map(([k, v]) => [k.toLowerCase(), v]));
    }
  } catch (e) { /* fall through to the frozen fallback layout */ }
  return FALLBACK_KEYMAP;
}

function buildCodeMap(map) {
  const out = {};
  Object.keys(map).forEach((key) => {
    if (key === ',') out.Comma = map[key];
    else if (/^[a-z]$/.test(key)) out['Key' + key.toUpperCase()] = map[key];
    else if (/^[0-9]$/.test(key)) out['Digit' + key] = map[key];
  });
  return out;
}

function instForEvent(e) {
  // Physical-key lookup first (Shift+, produces "<", shifted letters produce
  // uppercase — e.code sidesteps all of that), then a layout fallback.
  return codeMap[e.code] || keymap[String(e.key).toLowerCase()] || null;
}

// ---------------------------------------------------------------------------
// Guards (self-contained so pads work even if keys.js failed to load)
// ---------------------------------------------------------------------------

function isTypingTarget(target) {
  if (!target || typeof target.tagName !== 'string') return false;
  const tag = target.tagName.toUpperCase();
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return true;
  return !!target.isContentEditable;
}

function isModalOpen() {
  try {
    const keys = window.GCKeys;
    if (keys && typeof keys.isModalOpen === 'function') return keys.isModalOpen();
    const help = document.getElementById('helpModal');
    if (help && help.classList.contains('show')) return true;
    const inst = document.getElementById('instrumentModal');
    if (inst && !inst.classList.contains('hidden')) return true;
    if (document.querySelector('.gc-modal-open')) return true;
  } catch (e) { /* treat as no modal */ }
  return false;
}

// ---------------------------------------------------------------------------
// Trigger + visual feedback
// ---------------------------------------------------------------------------

function triggerVoice(inst, velocity, accent) {
  const audio = window.GrooveAudio;
  if (audio && typeof audio.trigger === 'function') {
    try {
      audio.trigger(inst, { velocity, accent, immediate: true });
      return;
    } catch (e) { /* fall through to the legacy path */ }
  }
  // Legacy fallback: app.js triggerInstrument(inst, volume 0–1). Unknown
  // instrument codes simply no-op inside app.js.
  const gc = GCRef || window.GC;
  if (gc && gc.fns && typeof gc.fns.triggerInstrument === 'function') {
    try { gc.fns.triggerInstrument(inst, velocity / 127); } catch (e) { /* voice missing */ }
  }
}

function injectStyles() {
  if (document.getElementById('gc-pads-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-pads-css';
  style.textContent = `
    .instrument-name.gc-pad-flash {
      background: rgba(255, 107, 53, 0.45) !important;
      box-shadow: inset 0 0 0 1px rgba(255, 140, 90, 0.8);
    }
  `;
  document.head.appendChild(style);
}

const flashTimers = {};
function flashRow(inst) {
  try {
    const row = document.querySelector(`.instrument-row[data-instrument="${inst}"]`);
    const label = row ? row.querySelector('.instrument-name') : null;
    if (!label) return;
    label.classList.add('gc-pad-flash');
    clearTimeout(flashTimers[inst]);
    flashTimers[inst] = setTimeout(() => label.classList.remove('gc-pad-flash'), FLASH_MS);
  } catch (e) { /* flash is cosmetic */ }
}

// ---------------------------------------------------------------------------
// Key handling
// ---------------------------------------------------------------------------

function onKeyDown(e) {
  try {
    if (e.repeat) return;                 // holding a key is not a drum roll
    if (e.ctrlKey || e.metaKey) return;   // leave chords to the router
    if (isTypingTarget(e.target)) return;
    if (isModalOpen()) return;

    const inst = instForEvent(e);
    if (!inst) return;

    e.preventDefault();

    let velocity = VEL_BASE;
    let accent = false;
    if (e.shiftKey) { velocity = VEL_ACCENT; accent = true; }
    else if (e.altKey) { velocity = VEL_GHOST; }

    // Audio first — everything else happens after the sound is on its way.
    triggerVoice(inst, velocity, accent);

    let atTime = 0;
    try { atTime = (typeof Tone !== 'undefined') ? Tone.immediate() : performance.now() / 1000; }
    catch (err) { atTime = performance.now() / 1000; }

    emitHit({ inst, velocity, accent, source: 'key', atTime });
    flashRow(inst);
  } catch (err) {
    console.warn('[gc-pads]', err);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;
  if (installed) return;
  installed = true;

  keymap = resolveKeymap();
  codeMap = buildCodeMap(keymap);
  ensureGCInput();
  injectStyles();

  window.addEventListener('keydown', onKeyDown, true);

  window.GCPads = {
    keymap,
    handlesKey(key) {
      return Object.prototype.hasOwnProperty.call(keymap, String(key).toLowerCase());
    }
  };
}

export default { init };
