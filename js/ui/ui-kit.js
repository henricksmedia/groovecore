// =============================================================================
// GrooveCore — js/ui/ui-kit.js  (WS-C)
// window.GCToast: toast stack + menu + overlay + injectStyles + makeButton,
// plus the alert() shim (all 16+ legacy alert() call sites become toasts with
// zero app.js edits) and the velocity-tier grid CSS (.step-button[data-vel]).
//
// ES module. Exports init(GC). Fully self-contained: works with or without
// window.GC, and injects a <link> to css/toast.css if main.js has not.
// =============================================================================

const TOAST_CSS_HREF = 'css/toast.css';
const MAX_TOASTS = 5;

let stackEl = null;

// -----------------------------------------------------------------------------
// injectStyles — idempotent <style> injection keyed by id
// -----------------------------------------------------------------------------

function injectStyles(id, css) {
  if (!id || typeof css !== 'string') return null;
  let el = document.getElementById(id);
  if (el) { el.textContent = css; return el; }
  el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
  return el;
}

function ensureToastCss() {
  // main.js injects CSS links at boot; if that has not happened (or ui-kit is
  // loaded standalone), add the link ourselves. Duplicate hrefs are harmless
  // but we avoid them anyway.
  const already = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .some((l) => (l.getAttribute('href') || '').indexOf('toast.css') !== -1);
  if (already || document.getElementById('gc-toast-css-link')) return;
  const link = document.createElement('link');
  link.id = 'gc-toast-css-link';
  link.rel = 'stylesheet';
  link.href = TOAST_CSS_HREF;
  document.head.appendChild(link);
}

// -----------------------------------------------------------------------------
// Toast stack
// -----------------------------------------------------------------------------

function ensureStack() {
  if (stackEl && document.body.contains(stackEl)) return stackEl;
  stackEl = document.getElementById('gc-toast-stack');
  if (!stackEl) {
    stackEl = document.createElement('div');
    stackEl.id = 'gc-toast-stack';
    stackEl.setAttribute('role', 'status');
    stackEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(stackEl);
  }
  return stackEl;
}

function dismissToast(toast) {
  if (!toast || toast.dataset.gcLeaving) return;
  toast.dataset.gcLeaving = '1';
  const remove = () => { if (toast.parentNode) toast.parentNode.removeChild(toast); };
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { remove(); return; }
  toast.classList.add('gc-toast-leaving');
  toast.addEventListener('animationend', remove, { once: true });
  // Safety net in case the animation never fires (e.g. css not loaded yet).
  setTimeout(remove, 400);
}

function show(msg, opts) {
  opts = opts || {};
  const stack = ensureStack();

  // Cap the stack; drop the oldest.
  while (stack.children.length >= MAX_TOASTS) {
    stack.removeChild(stack.firstElementChild);
  }

  const toast = document.createElement('div');
  toast.className = 'gc-toast';
  toast.dataset.type = opts.type || 'info';

  const msgEl = document.createElement('div');
  msgEl.className = 'gc-toast-msg';
  msgEl.textContent = String(msg == null ? '' : msg);
  toast.appendChild(msgEl);

  let duration = (typeof opts.duration === 'number') ? opts.duration : 3500;
  let timer = null;
  const close = () => { if (timer) clearTimeout(timer); dismissToast(toast); };

  if (opts.action && typeof opts.action.onClick === 'function') {
    const btn = document.createElement('button');
    btn.className = 'gc-toast-action';
    btn.type = 'button';
    btn.textContent = String(opts.action.label || 'OK');
    btn.addEventListener('click', () => {
      try { opts.action.onClick(); } catch (e) { console.warn('[gc-toast] action failed', e); }
      close();
    });
    toast.appendChild(btn);
    // Actionable toasts linger longer so the user can react.
    if (typeof opts.duration !== 'number') duration = 8000;
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'gc-toast-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', close);
  toast.appendChild(closeBtn);

  stack.appendChild(toast);

  if (duration > 0) timer = setTimeout(close, duration);

  return { el: toast, close };
}

// -----------------------------------------------------------------------------
// Popup menu
// -----------------------------------------------------------------------------
// items: [{ label, onClick, disabled }, ...] or the string '-' for a separator.

let openMenu = null;

function closeMenu() {
  if (!openMenu) return;
  const m = openMenu;
  openMenu = null;
  if (m.el.parentNode) m.el.parentNode.removeChild(m.el);
  document.removeEventListener('pointerdown', m.onOutside, true);
  document.removeEventListener('keydown', m.onKey, true);
}

function menu(anchor, items) {
  closeMenu();
  if (!Array.isArray(items) || !items.length) return null;

  const el = document.createElement('div');
  el.className = 'gc-menu';
  el.setAttribute('role', 'menu');

  for (const item of items) {
    if (item === '-' || (item && item.separator)) {
      const sep = document.createElement('div');
      sep.className = 'gc-menu-sep';
      el.appendChild(sep);
      continue;
    }
    if (!item || typeof item.label !== 'string') continue;
    const btn = document.createElement('button');
    btn.className = 'gc-menu-item';
    btn.type = 'button';
    btn.setAttribute('role', 'menuitem');
    btn.textContent = item.label;
    if (item.disabled) btn.setAttribute('disabled', '');
    btn.addEventListener('click', () => {
      closeMenu();
      if (typeof item.onClick === 'function') {
        try { item.onClick(); } catch (e) { console.warn('[gc-menu] item failed', e); }
      }
    });
    el.appendChild(btn);
  }

  document.body.appendChild(el);

  // Position near the anchor, clamped to the viewport.
  let x = 8, y = 8;
  if (anchor && typeof anchor.getBoundingClientRect === 'function') {
    const r = anchor.getBoundingClientRect();
    x = r.left;
    y = r.bottom + 4;
  } else if (anchor && typeof anchor.clientX === 'number') {
    x = anchor.clientX;
    y = anchor.clientY;
  }
  const mw = el.offsetWidth, mh = el.offsetHeight;
  x = Math.min(x, window.innerWidth - mw - 8);
  y = Math.min(y, window.innerHeight - mh - 8);
  el.style.left = Math.max(4, x) + 'px';
  el.style.top = Math.max(4, y) + 'px';

  const onOutside = (e) => { if (!el.contains(e.target)) closeMenu(); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeMenu(); } };
  // Defer so the click that opened the menu does not immediately close it.
  setTimeout(() => {
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  }, 0);

  openMenu = { el, onOutside, onKey };
  const first = el.querySelector('.gc-menu-item:not([disabled])');
  if (first) first.focus();
  return { el, close: closeMenu };
}

// -----------------------------------------------------------------------------
// Overlay
// -----------------------------------------------------------------------------

function overlay(html) {
  const backdrop = document.createElement('div');
  backdrop.className = 'gc-overlay-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const panel = document.createElement('div');
  panel.className = 'gc-overlay-panel';
  if (html instanceof Node) panel.appendChild(html);
  else panel.innerHTML = String(html == null ? '' : html);
  backdrop.appendChild(panel);

  const prevFocus = document.activeElement;
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    if (prevFocus && typeof prevFocus.focus === 'function') {
      try { prevFocus.focus(); } catch (e) { /* noop */ }
    }
  };
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', onKey, true);

  document.body.appendChild(backdrop);
  panel.setAttribute('tabindex', '-1');
  panel.focus();

  return { el: backdrop, panel, close };
}

// -----------------------------------------------------------------------------
// makeButton
// -----------------------------------------------------------------------------

function makeButton(label, opts) {
  opts = opts || {};
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gc-btn' + (opts.secondary ? ' gc-btn-secondary' : '') + (opts.className ? ' ' + opts.className : '');
  if (opts.id) btn.id = opts.id;
  if (opts.title) btn.title = opts.title;
  btn.textContent = String(label == null ? '' : label);
  if (typeof opts.onClick === 'function') btn.addEventListener('click', opts.onClick);
  return btn;
}

// -----------------------------------------------------------------------------
// alert() shim — every legacy alert becomes a toast
// -----------------------------------------------------------------------------

function installAlertShim() {
  if (window.__gcNativeAlert) return; // already installed
  window.__gcNativeAlert = window.alert ? window.alert.bind(window) : function () {};
  window.alert = function (msg) {
    const text = String(msg == null ? '' : msg);
    const lower = text.toLowerCase();
    let type = 'info';
    if (/(error|failed|invalid|not available|too large|not loaded|not ready)/.test(lower)) type = 'error';
    else if (/(success|exported|complete|copied)/.test(lower)) type = 'success';
    // Long legacy messages get more read time.
    const duration = text.length > 120 ? 6500 : 3500;
    try {
      show(text, { type, duration });
    } catch (e) {
      // Absolute last resort: never swallow a message entirely.
      try { window.__gcNativeAlert(text); } catch (e2) { console.warn(text); }
    }
  };
}

// -----------------------------------------------------------------------------
// Velocity-tier grid CSS — driven by .step-button[data-vel]
// -----------------------------------------------------------------------------
// data-vel carries the raw 1–127 velocity (set by step-editor / step-context,
// WS-H). We enumerate the values into --gc-vel so plain CSS can scale opacity,
// and give the three tiers (ghost <=60 / normal / accent >=113) distinct looks.

function buildVelocityCss() {
  const rules = [];
  rules.push(
    '.step-button.active[data-vel]{' +
    'opacity:calc(0.5 + var(--gc-vel,1)*0.5);' +
    '}'
  );
  for (let v = 1; v <= 127; v++) {
    rules.push('.step-button[data-vel="' + v + '"]{--gc-vel:' + (v / 127).toFixed(3) + ';}');
  }
  // Ghost tier: dimmed, slightly desaturated.
  const ghost = [];
  for (let v = 1; v <= 60; v++) ghost.push('.step-button.active[data-vel="' + v + '"]');
  rules.push(ghost.join(',') + '{filter:saturate(0.7) brightness(0.85);}');
  // Accent tier: hot glow.
  const accent = [];
  for (let v = 113; v <= 127; v++) accent.push('.step-button.active[data-vel="' + v + '"]');
  rules.push(accent.join(',') + '{filter:brightness(1.18);box-shadow:0 0 8px rgba(255,100,0,0.85),0 0 2px rgba(255,180,0,0.9) inset;}');
  rules.push('@media (prefers-reduced-motion: reduce){.step-button.active[data-vel]{transition:none;}}');
  return rules.join('\n');
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = { show, menu, overlay, injectStyles, makeButton };

export function init(GC) {
  ensureToastCss();
  ensureStack();
  installAlertShim();
  injectStyles('gc-velocity-tiers', buildVelocityCss());
  window.GCToast = api;
  // Convenience alias for modules that think of this as a general ui kit.
  window.GCUI = api;
  // Let any module (or app.js) toast through the event bus too.
  const gc = GC || window.GC;
  if (gc && gc.events && typeof gc.events.on === 'function') {
    gc.events.on('toast', (d) => {
      if (typeof d === 'string') show(d);
      else if (d && d.msg !== undefined) show(d.msg, d);
    });
  }
  return api;
}

export { show, menu, overlay, injectStyles, makeButton };
