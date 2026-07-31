// =============================================================================
// GrooveCore — js/ui/keys.js (WS-D)
// Central focus-aware keyboard router. ONE capture-phase keydown listener.
//
// Contract (UPGRADE-PLAN.md §5 / §6.1):
//   Space           -> #playButton.click() (+preventDefault, page never scrolls)
//   T               -> tap tempo (delegates to window.GCTempoTools)
//   Ctrl+Z          -> GC.events 'undo'
//   Ctrl+Shift+Z    -> GC.events 'redo'
//   Ctrl+Y          -> GC.events 'redo'
//   Ctrl+S          -> #save.click()
//   Ctrl+E          -> GC.events 'export:open'
//   ArrowUp/Down    -> GC.setBpm(tempo ± 1)  (Shift = ±10)
//   1 / 2           -> .variation-btn[data-variation] clicks (A / B)
//   M               -> metronome toggle (Ctrl+M when the pads module owns "m")
//   P               -> GC.events 'browser:toggle'
//   ?               -> shortcut overlay
//
// Inert when e.target is an input/select/textarea/contenteditable.
// Inert when a modal is open — except Space and Escape.
// Exposes register(combo, fn, label) so other modules can add shortcuts and
// the shortcut overlay can enumerate them. No-ops gracefully if window.GC is
// absent (every handler feature-detects its dependencies).
// =============================================================================

const registry = new Map(); // combo -> { fn, label }

let GCRef = null;
let installed = false;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

function isTypingTarget(target) {
  if (!target || typeof target.tagName !== 'string') return false;
  const tag = target.tagName.toUpperCase();
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return true;
  return !!target.isContentEditable;
}

function isModalOpen() {
  try {
    const help = document.getElementById('helpModal');
    if (help && help.classList.contains('show')) return true;
    const inst = document.getElementById('instrumentModal');
    if (inst && !inst.classList.contains('hidden')) return true;
    // Any gc-injected dialog (shortcut overlay, pickers, future modules)
    if (document.querySelector('.gc-modal-open')) return true;
  } catch (e) { /* DOM not ready — treat as no modal */ }
  return false;
}

// ---------------------------------------------------------------------------
// Combo normalization
// ---------------------------------------------------------------------------

function baseKeyOf(e) {
  if (e.key === ' ' || e.code === 'Space') return 'space';
  return String(e.key).toLowerCase();
}

function combosFor(e) {
  // Ordered candidate list: most specific first, then a bare-key fallback for
  // printable keys (so "?" registered plain still matches Shift+/ etc.).
  const base = baseKeyOf(e);
  const ctrl = e.ctrlKey || e.metaKey;
  const candidates = [];
  let full = '';
  if (ctrl) full += 'ctrl+';
  if (e.shiftKey) full += 'shift+';
  if (e.altKey) full += 'alt+';
  full += base;
  candidates.push(full);
  if (e.shiftKey && !e.altKey) {
    candidates.push((ctrl ? 'ctrl+' : '') + base); // handlers may read e.shiftKey
  }
  return candidates;
}

// ---------------------------------------------------------------------------
// Public registration API
// ---------------------------------------------------------------------------

export function register(combo, fn, label) {
  if (typeof combo !== 'string' || typeof fn !== 'function') return;
  registry.set(combo.toLowerCase(), { fn, label: label || '' });
}

function list() {
  const out = [];
  registry.forEach((v, combo) => out.push({ combo, label: v.label }));
  return out;
}

// ---------------------------------------------------------------------------
// Default bindings
// ---------------------------------------------------------------------------

function clickId(id) {
  const el = document.getElementById(id);
  if (el) el.click();
  return !!el;
}

function padsOwnKey(key) {
  try {
    const pads = window.GCPads;
    return !!(pads && typeof pads.handlesKey === 'function' && pads.handlesKey(key));
  } catch (e) { return false; }
}

function registerDefaults() {
  register('space', (e) => {
    e.preventDefault(); // page must never scroll on Space
    clickId('playButton');
  }, 'Play / Stop');

  register('t', () => {
    const tt = window.GCTempoTools;
    if (tt && typeof tt.tap === 'function') tt.tap();
  }, 'Tap tempo');

  register('ctrl+z', (e) => {
    e.preventDefault();
    if (GCRef && GCRef.events) GCRef.events.emit('undo');
  }, 'Undo');

  register('ctrl+shift+z', (e) => {
    e.preventDefault();
    if (GCRef && GCRef.events) GCRef.events.emit('redo');
  }, 'Redo');

  register('ctrl+y', (e) => {
    e.preventDefault();
    if (GCRef && GCRef.events) GCRef.events.emit('redo');
  }, 'Redo');

  register('ctrl+s', (e) => {
    e.preventDefault(); // never let the browser Save-Page dialog appear
    clickId('save');
  }, 'Save project');

  register('ctrl+e', (e) => {
    e.preventDefault();
    if (GCRef && GCRef.events) GCRef.events.emit('export:open');
  }, 'Export menu');

  register('arrowup', (e) => {
    e.preventDefault();
    if (GCRef && typeof GCRef.setBpm === 'function') {
      GCRef.setBpm(GCRef.tempo + (e.shiftKey ? 10 : 1));
    }
  }, 'BPM +1 (Shift: +10)');

  register('arrowdown', (e) => {
    e.preventDefault();
    if (GCRef && typeof GCRef.setBpm === 'function') {
      GCRef.setBpm(GCRef.tempo - (e.shiftKey ? 10 : 1));
    }
  }, 'BPM −1 (Shift: −10)');

  register('1', () => {
    const btn = document.querySelector('.variation-btn[data-variation="A"], .variation-btn[data-variation="a"]');
    if (btn) btn.click();
  }, 'Variation A');

  register('2', () => {
    const btn = document.querySelector('.variation-btn[data-variation="B"], .variation-btn[data-variation="b"]');
    if (btn) btn.click();
  }, 'Variation B');

  // "m" doubles as the MT finger-drumming pad. When the pads module owns the
  // key, the plain binding yields to it and Ctrl+M toggles the metronome.
  const toggleMetronome = () => {
    const tt = window.GCTempoTools;
    if (tt && typeof tt.toggleMetronome === 'function') tt.toggleMetronome();
  };
  register('m', (e) => {
    if (padsOwnKey('m')) return; // pads module fires the MT voice instead
    toggleMetronome();
  }, 'Metronome (Ctrl+M with pads active)');
  register('ctrl+m', (e) => {
    e.preventDefault();
    toggleMetronome();
  }, 'Metronome');

  register('p', () => {
    if (GCRef && GCRef.events) GCRef.events.emit('browser:toggle');
  }, 'Preset browser');

  register('?', (e) => {
    e.preventDefault();
    const ov = window.GCShortcutOverlay;
    if (ov && typeof ov.toggle === 'function') ov.toggle();
    else if (GCRef && GCRef.events) GCRef.events.emit('shortcuts:toggle');
  }, 'Keyboard shortcuts');
}

// ---------------------------------------------------------------------------
// The single capture-phase router
// ---------------------------------------------------------------------------

function onKeyDown(e) {
  try {
    if (isTypingTarget(e.target)) return; // typing always wins

    const base = baseKeyOf(e);
    if (isModalOpen() && base !== 'space' && base !== 'escape') return;
    if (base === 'escape') return; // app.js + overlays own Escape

    for (const combo of combosFor(e)) {
      const entry = registry.get(combo);
      if (entry) {
        entry.fn(e);
        return;
      }
    }
  } catch (err) {
    // A shortcut handler must never break the page.
    console.warn('[gc-keys]', err);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;
  if (installed) return;
  installed = true;

  registerDefaults();
  window.addEventListener('keydown', onKeyDown, true); // capture phase

  window.GCKeys = { register, list, isTypingTarget, isModalOpen };
}

export default { init, register };
