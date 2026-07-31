// =============================================================================
// GrooveCore — js/ui/shortcut-overlay.js (WS-D)
// "?" opens a focus-trapped role=dialog listing every keyboard shortcut,
// the QWERTY pad layout, and the existing hidden knob gestures
// (Shift = fine, Ctrl = coarse, double-click = reset, mouse wheel).
// =============================================================================

let GCRef = null;
let overlayEl = null;
let lastFocused = null;
let isOpen = false;

// ---------------------------------------------------------------------------
// Shortcut data
// ---------------------------------------------------------------------------

const STATIC_SHORTCUTS = [
  ['Space', 'Play / Stop'],
  ['T', 'Tap tempo'],
  ['M', 'Metronome (Ctrl+M while pads are active)'],
  ['Ctrl+Z', 'Undo'],
  ['Ctrl+Shift+Z / Ctrl+Y', 'Redo'],
  ['Ctrl+S', 'Save project'],
  ['Ctrl+E', 'Export menu'],
  ['↑ / ↓', 'BPM +1 / −1 (Shift: ±10)'],
  ['1 / 2', 'Variation A / B'],
  ['P', 'Preset browser'],
  ['?', 'This overlay'],
  ['Esc', 'Close dialogs']
];

const PAD_ROWS = [
  ['Z X C V B N M ,', 'BD  SD  CP  CH  OH  LT  MT  HT'],
  ['A S D F G H J K L', 'RIM  CB  CL  MA  HC  MC  LC  CYM  CR'],
  ['Shift + pad', 'Accent hit (velocity 127)'],
  ['Alt + pad', 'Ghost hit (velocity 60)']
];

const KNOB_GESTURES = [
  ['Drag', 'Turn knob'],
  ['Shift + drag', 'Fine adjust (×0.1)'],
  ['Ctrl + drag', 'Coarse adjust (×3)'],
  ['Double-click / double-tap', 'Reset knob to default'],
  ['Mouse wheel', 'Nudge value ±0.3']
];

function currentShortcuts() {
  // Prefer the live registry from keys.js so module-registered shortcuts
  // appear too; fall back to the static list.
  try {
    const keys = window.GCKeys;
    if (keys && typeof keys.list === 'function') {
      const live = keys.list().filter((s) => s.label);
      if (live.length) {
        return live.map((s) => [prettyCombo(s.combo), s.label]);
      }
    }
  } catch (e) { /* fall through to static list */ }
  return STATIC_SHORTCUTS;
}

function prettyCombo(combo) {
  return combo
    .split('+')
    .map((part) => {
      if (part === 'space') return 'Space';
      if (part === 'ctrl') return 'Ctrl';
      if (part === 'shift') return 'Shift';
      if (part === 'alt') return 'Alt';
      if (part === 'arrowup') return '↑';
      if (part === 'arrowdown') return '↓';
      if (part.length === 1) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('+');
}

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------

function injectStyles() {
  if (document.getElementById('gc-shortcut-overlay-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-shortcut-overlay-css';
  style.textContent = `
    #gc-shortcutOverlay {
      position: fixed; inset: 0; z-index: 10000; display: none;
      align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(3px);
    }
    #gc-shortcutOverlay.gc-open { display: flex; }
    .gc-shortcut-card {
      background: linear-gradient(160deg, #1d1d1f, #141416);
      border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 12px;
      max-width: 720px; width: calc(100% - 32px); max-height: 85vh;
      overflow-y: auto; padding: 20px 24px; color: #e5e5e5;
      font-family: 'Roboto', sans-serif; box-shadow: 0 18px 60px rgba(0,0,0,0.6);
    }
    .gc-shortcut-card h2 {
      margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #ff6b35;
      display: flex; align-items: center; justify-content: space-between;
    }
    .gc-shortcut-card h3 {
      margin: 18px 0 8px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; color: #999;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 4px;
    }
    .gc-shortcut-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 16px; font-size: 13px; }
    .gc-shortcut-grid kbd {
      font: 600 11px/1.5 'Roboto Mono', Consolas, monospace; color: #ffb08a;
      background: #2a2a2c; border: 1px solid #444; border-bottom-width: 2px;
      border-radius: 4px; padding: 1px 7px; white-space: nowrap; justify-self: start;
    }
    .gc-shortcut-grid span { color: #ccc; align-self: center; }
    .gc-shortcut-close {
      font: 700 11px/1 'Roboto', sans-serif; letter-spacing: 0.06em;
      color: #ddd; background: #2a2a2a; border: 1px solid #555;
      border-radius: 4px; padding: 6px 12px; cursor: pointer;
    }
    .gc-shortcut-close:hover { background: #3a3a3a; }
    @media (prefers-reduced-motion: no-preference) {
      #gc-shortcutOverlay.gc-open .gc-shortcut-card { animation: gc-shortcut-in 0.15s ease-out; }
      @keyframes gc-shortcut-in { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    }
  `;
  document.head.appendChild(style);
}

function sectionHtml(title, rows) {
  const cells = rows
    .map(([k, label]) => `<kbd>${escapeHtml(k)}</kbd><span>${escapeHtml(label)}</span>`)
    .join('');
  return `<h3>${escapeHtml(title)}</h3><div class="gc-shortcut-grid">${cells}</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

function buildOverlay() {
  injectStyles();
  overlayEl = document.createElement('div');
  overlayEl.id = 'gc-shortcutOverlay';
  overlayEl.setAttribute('role', 'dialog');
  overlayEl.setAttribute('aria-modal', 'true');
  overlayEl.setAttribute('aria-label', 'Keyboard shortcuts');
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) close();
  });
  // Own key handling: Escape closes, Tab is trapped. Capture + stop so the
  // global router and app.js never see keys while the dialog is up.
  overlayEl.addEventListener('keydown', onOverlayKeyDown);
  document.body.appendChild(overlayEl);
}

function renderContent() {
  const card = document.createElement('div');
  card.className = 'gc-shortcut-card';
  card.innerHTML = `
    <h2><span>Keyboard shortcuts</span>
      <button type="button" class="gc-shortcut-close" id="gc-shortcutCloseBtn">CLOSE (ESC)</button>
    </h2>
    ${sectionHtml('Global', currentShortcuts())}
    ${sectionHtml('Finger drumming pads', PAD_ROWS)}
    ${sectionHtml('Knob gestures', KNOB_GESTURES)}
  `;
  overlayEl.innerHTML = '';
  overlayEl.appendChild(card);
  const closeBtn = card.querySelector('#gc-shortcutCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', close);
}

// ---------------------------------------------------------------------------
// Focus trap + open/close
// ---------------------------------------------------------------------------

function focusables() {
  if (!overlayEl) return [];
  return Array.from(overlayEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((el) => !el.disabled && el.offsetParent !== null);
}

function onOverlayKeyDown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    close();
    return;
  }
  if (e.key === 'Tab') {
    const els = focusables();
    if (!els.length) { e.preventDefault(); return; }
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function open() {
  if (!overlayEl) buildOverlay();
  if (isOpen) return;
  lastFocused = document.activeElement;
  renderContent(); // re-render each open so newly registered shortcuts show
  isOpen = true;
  overlayEl.classList.add('gc-open', 'gc-modal-open'); // keys.js modal guard
  const els = focusables();
  if (els.length) els[0].focus();
}

export function close() {
  if (!overlayEl || !isOpen) return;
  isOpen = false;
  overlayEl.classList.remove('gc-open', 'gc-modal-open');
  if (lastFocused && typeof lastFocused.focus === 'function') {
    try { lastFocused.focus(); } catch (e) { /* element may be gone */ }
  }
  lastFocused = null;
}

export function toggle() {
  if (isOpen) close();
  else open();
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;

  window.GCShortcutOverlay = { open, close, toggle };

  if (GCRef && GCRef.events && typeof GCRef.events.on === 'function') {
    GCRef.events.on('shortcuts:toggle', toggle);
  }

  // Register with the router if keys.js booted without finding us.
  try {
    const keys = window.GCKeys;
    if (keys && typeof keys.register === 'function') {
      keys.register('?', (e) => { e.preventDefault(); toggle(); }, 'Keyboard shortcuts');
    }
  } catch (e) { /* router optional */ }
}

export default { init, open, close, toggle };
