// =============================================================================
// GrooveCore per-step context menu (WS-H)
// ES module. Right-click (or 450ms long-press) on a step opens an anchored
// role=menu popover: velocity tier (Ghost 45 / Normal 100 / Accent 127),
// Ratchet off/x2/x3/x4, Flam toggle, Probability off/75/50/25, Clear.
// Writes cell velocities and pattern.sfx1["step:inst"] = { r, f, p } through
// the GC bridge (emitting 'mutate:before' first), then refreshes the display.
// Tiny badges are rendered from data-fx by css/step-context.css.
// Requires window.GC; no-ops without it.
// =============================================================================

const LONG_PRESS_MS = 450;
const LONG_PRESS_SLOP = 8;

let GCref = null;
let menuEl = null;
let target = null;   // { btn, inst, stepIdx }
let pressTimer = 0;
let pressStart = null;

// ---------------------------------------------------------------------------
// State helpers
// ---------------------------------------------------------------------------

function getPattern() {
  try {
    return GCref.patterns?.[GCref.variation]?.[GCref.currentPattern] || null;
  } catch (e) {
    return null;
  }
}

function cellVel(pattern, stepIdx, inst) {
  const cell = pattern.part1 && pattern.part1[stepIdx];
  if (!cell) return 0;
  const v = cell[inst];
  if (v === true) return 100;
  return typeof v === 'number' ? v : 0;
}

function sfxOf(pattern, stepIdx, inst) {
  const sfx = pattern.sfx1;
  return (sfx && sfx[`${stepIdx}:${inst}`]) || {};
}

function emitMutateBefore(reason) {
  if (GCref.events && typeof GCref.events.emit === 'function') {
    GCref.events.emit('mutate:before', { reason });
  }
}

function refreshDisplay() {
  const fn = (GCref.fns && GCref.fns.updateStepDisplay) ||
    (typeof window.updateStepDisplay === 'function' ? window.updateStepDisplay : null);
  if (fn) {
    try { fn(); } catch (e) { /* best-effort */ }
  }
}

function writeSfx(pattern, stepIdx, inst, patch) {
  if (!pattern.sfx1 || typeof pattern.sfx1 !== 'object') pattern.sfx1 = {};
  const key = `${stepIdx}:${inst}`;
  const cur = Object.assign({}, pattern.sfx1[key], patch);
  // Drop cleared fields, drop empty records.
  if (!cur.r) delete cur.r;
  if (!cur.f) delete cur.f;
  if (!cur.p || cur.p >= 100) delete cur.p;
  if (Object.keys(cur).length) pattern.sfx1[key] = cur;
  else delete pattern.sfx1[key];
}

function updateBadge(btn, pattern, stepIdx, inst) {
  const fx = sfxOf(pattern, stepIdx, inst);
  const bits = [];
  if (fx.r) bits.push(`×${fx.r}`);
  if (fx.f) bits.push('fl');
  if (fx.p) bits.push(`${fx.p}%`);
  if (bits.length) btn.dataset.fx = bits.join(' ');
  else delete btn.dataset.fx;
}

function syncAllBadges() {
  const pattern = getPattern();
  if (!pattern) return;
  document.querySelectorAll('.step-button[data-instrument]').forEach(btn => {
    const inst = btn.dataset.instrument;
    const idx = parseInt(btn.dataset.step, 10) - 1;
    if (!inst || isNaN(idx)) return;
    updateBadge(btn, pattern, idx, inst);
  });
}

// ---------------------------------------------------------------------------
// Menu actions
// ---------------------------------------------------------------------------

function applyAction(action, value) {
  if (!target) return;
  const pattern = getPattern();
  if (!pattern) return;
  const { btn, inst, stepIdx } = target;

  emitMutateBefore(`step:${action}`);

  if (action === 'vel') {
    if (!pattern.part1[stepIdx]) pattern.part1[stepIdx] = {};
    pattern.part1[stepIdx][inst] = value;
    btn.dataset.vel = String(value);
    btn.style.setProperty('--vel', (value / 127).toFixed(3));
  } else if (action === 'ratchet') {
    writeSfx(pattern, stepIdx, inst, { r: value || 0 });
  } else if (action === 'flam') {
    const cur = sfxOf(pattern, stepIdx, inst);
    writeSfx(pattern, stepIdx, inst, { f: cur.f ? 0 : 1 });
  } else if (action === 'prob') {
    writeSfx(pattern, stepIdx, inst, { p: value || 0 });
  } else if (action === 'clear') {
    if (pattern.part1[stepIdx]) delete pattern.part1[stepIdx][inst];
    writeSfx(pattern, stepIdx, inst, { r: 0, f: 0, p: 0 });
    delete btn.dataset.vel;
    btn.style.removeProperty('--vel');
  }

  updateBadge(btn, pattern, stepIdx, inst);
  refreshDisplay();
}

// ---------------------------------------------------------------------------
// Menu rendering
// ---------------------------------------------------------------------------

function menuHtml(pattern, stepIdx, inst) {
  const vel = cellVel(pattern, stepIdx, inst);
  const fx = sfxOf(pattern, stepIdx, inst);
  const check = on => (on ? ' gc-checked' : '');
  const r = fx.r || 0;
  const p = fx.p || 0;

  return `
    <div class="gc-sc-title">${inst.toUpperCase()} · step ${stepIdx + 1}</div>
    <div class="gc-sc-group" role="group" aria-label="Velocity tier">
      <button role="menuitemradio" aria-checked="${vel > 0 && vel <= 60}" class="gc-sc-item${check(vel > 0 && vel <= 60)}" data-action="vel" data-value="45">Ghost <span>45</span></button>
      <button role="menuitemradio" aria-checked="${vel > 60 && vel < 120}" class="gc-sc-item${check(vel > 60 && vel < 120)}" data-action="vel" data-value="100">Normal <span>100</span></button>
      <button role="menuitemradio" aria-checked="${vel >= 120}" class="gc-sc-item${check(vel >= 120)}" data-action="vel" data-value="127">Accent <span>127</span></button>
    </div>
    <div class="gc-sc-sep"></div>
    <div class="gc-sc-group" role="group" aria-label="Ratchet">
      <span class="gc-sc-label">Ratchet</span>
      <button role="menuitemradio" aria-checked="${r === 0}" class="gc-sc-chip${check(r === 0)}" data-action="ratchet" data-value="0">off</button>
      <button role="menuitemradio" aria-checked="${r === 2}" class="gc-sc-chip${check(r === 2)}" data-action="ratchet" data-value="2">×2</button>
      <button role="menuitemradio" aria-checked="${r === 3}" class="gc-sc-chip${check(r === 3)}" data-action="ratchet" data-value="3">×3</button>
      <button role="menuitemradio" aria-checked="${r === 4}" class="gc-sc-chip${check(r === 4)}" data-action="ratchet" data-value="4">×4</button>
    </div>
    <div class="gc-sc-group" role="group" aria-label="Flam">
      <span class="gc-sc-label">Flam</span>
      <button role="menuitemcheckbox" aria-checked="${!!fx.f}" class="gc-sc-chip${check(!!fx.f)}" data-action="flam">${fx.f ? 'on' : 'off'}</button>
    </div>
    <div class="gc-sc-group" role="group" aria-label="Probability">
      <span class="gc-sc-label">Prob</span>
      <button role="menuitemradio" aria-checked="${p === 0}" class="gc-sc-chip${check(p === 0)}" data-action="prob" data-value="0">off</button>
      <button role="menuitemradio" aria-checked="${p === 75}" class="gc-sc-chip${check(p === 75)}" data-action="prob" data-value="75">75%</button>
      <button role="menuitemradio" aria-checked="${p === 50}" class="gc-sc-chip${check(p === 50)}" data-action="prob" data-value="50">50%</button>
      <button role="menuitemradio" aria-checked="${p === 25}" class="gc-sc-chip${check(p === 25)}" data-action="prob" data-value="25">25%</button>
    </div>
    <div class="gc-sc-sep"></div>
    <button role="menuitem" class="gc-sc-item gc-sc-danger" data-action="clear">Clear step</button>`;
}

function openMenu(btn, x, y) {
  const inst = btn.dataset.instrument;
  const stepIdx = parseInt(btn.dataset.step, 10) - 1;
  if (!inst || isNaN(stepIdx)) return;
  const pattern = getPattern();
  if (!pattern) return;

  closeMenu();
  target = { btn, inst, stepIdx };

  menuEl = document.createElement('div');
  menuEl.id = 'gc-step-menu';
  menuEl.setAttribute('role', 'menu');
  menuEl.setAttribute('aria-label', `Step options for ${inst.toUpperCase()} step ${stepIdx + 1}`);
  menuEl.innerHTML = menuHtml(pattern, stepIdx, inst);
  document.body.appendChild(menuEl);

  // Anchor near the step, clamped to the viewport.
  const rect = btn.getBoundingClientRect();
  const mw = menuEl.offsetWidth || 230;
  const mh = menuEl.offsetHeight || 260;
  let left = (x !== undefined ? x : rect.left);
  let top = (y !== undefined ? y : rect.bottom + 6);
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
  if (top + mh > window.innerHeight - 8) top = Math.max(8, (y !== undefined ? y : rect.top) - mh - 6);
  menuEl.style.left = `${left}px`;
  menuEl.style.top = `${top}px`;

  menuEl.addEventListener('click', (e) => {
    const item = e.target.closest('[data-action]');
    if (!item) return;
    e.stopPropagation();
    const action = item.dataset.action;
    const value = item.dataset.value !== undefined ? parseInt(item.dataset.value, 10) : undefined;
    applyAction(action, value);
    if (action === 'clear') closeMenu();
    else refreshMenu(); // keep it open for quick multi-edits
  });

  menuEl.addEventListener('keydown', onMenuKeydown);

  setTimeout(() => {
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onGlobalKeydown, true);
    const first = menuEl.querySelector('button');
    if (first) first.focus();
  }, 0);
}

function refreshMenu() {
  if (!menuEl || !target) return;
  const pattern = getPattern();
  if (!pattern) return;
  const focused = document.activeElement;
  const marker = focused && focused.dataset ?
    `[data-action="${focused.dataset.action}"]${focused.dataset.value !== undefined ? `[data-value="${focused.dataset.value}"]` : ''}` : null;
  menuEl.innerHTML = menuHtml(pattern, target.stepIdx, target.inst);
  if (marker) {
    const again = menuEl.querySelector(marker);
    if (again) again.focus();
  }
}

function closeMenu() {
  if (menuEl) {
    menuEl.remove();
    menuEl = null;
  }
  target = null;
  document.removeEventListener('pointerdown', onOutside, true);
  document.removeEventListener('keydown', onGlobalKeydown, true);
}

function onOutside(e) {
  if (menuEl && !menuEl.contains(e.target)) closeMenu();
}

function onGlobalKeydown(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    closeMenu();
  }
}

function onMenuKeydown(e) {
  if (!menuEl) return;
  const items = Array.from(menuEl.querySelectorAll('button'));
  const i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    items[(i + 1) % items.length].focus();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    items[(i - 1 + items.length) % items.length].focus();
  } else if (e.key === 'Home') {
    e.preventDefault();
    items[0].focus();
  } else if (e.key === 'End') {
    e.preventDefault();
    items[items.length - 1].focus();
  }
}

// ---------------------------------------------------------------------------
// Triggers: right-click + long-press
// ---------------------------------------------------------------------------

function onContextMenu(e) {
  const btn = e.target && e.target.closest ? e.target.closest('.step-button') : null;
  if (!btn || btn.classList.contains('disabled')) return;
  e.preventDefault();
  e.stopPropagation();
  openMenu(btn, e.clientX, e.clientY);
}

function onPressStart(e) {
  if (e.pointerType !== 'touch') return; // long-press is a touch affordance
  const btn = e.target && e.target.closest ? e.target.closest('.step-button') : null;
  if (!btn || btn.classList.contains('disabled')) return;
  pressStart = { x: e.clientX, y: e.clientY, btn };
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    if (!pressStart) return;
    openMenu(pressStart.btn, pressStart.x, pressStart.y);
    pressStart = null;
  }, LONG_PRESS_MS);
}

function onPressMove(e) {
  if (!pressStart) return;
  if (Math.abs(e.clientX - pressStart.x) > LONG_PRESS_SLOP ||
      Math.abs(e.clientY - pressStart.y) > LONG_PRESS_SLOP) {
    clearTimeout(pressTimer);
    pressStart = null;
  }
}

function onPressEnd() {
  clearTimeout(pressTimer);
  pressStart = null;
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  if (typeof document === 'undefined') return;
  GCref = GC || window.GC || null;
  if (!GCref) return; // per-step FX need the state bridge

  document.addEventListener('contextmenu', onContextMenu, true);
  document.addEventListener('pointerdown', onPressStart, true);
  document.addEventListener('pointermove', onPressMove, true);
  document.addEventListener('pointerup', onPressEnd, true);
  document.addEventListener('pointercancel', onPressEnd, true);

  syncAllBadges();
  if (GCref.events && typeof GCref.events.on === 'function') {
    GCref.events.on('preset:loaded', syncAllBadges);
    GCref.events.on('undo', () => setTimeout(syncAllBadges, 0));
    GCref.events.on('redo', () => setTimeout(syncAllBadges, 0));
  }
}
