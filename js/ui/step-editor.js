// =============================================================================
// GrooveCore step editor: drag-for-velocity + drag-paint (WS-H)
// ES module. Capture-phase pointer handling over .step-button cells:
//   - vertical drag (>=4px) on an ACTIVE step edits velocity, 1px = 1 (1..127)
//   - horizontal drag paints inactive cells at 100 (never toggles cells off)
//   - Shift+click = accent tier 127, Alt+click = ghost tier 45
// After any drag a one-shot capture click listener swallows the click so
// app.js's toggle handler never fires. Requires window.GC for state access;
// no-ops without it.
// =============================================================================

const DRAG_THRESHOLD = 4;
const TIER_ACCENT = 127;
const TIER_NORMAL = 100;
const TIER_GHOST = 45;

let GCref = null;
let bubbleEl = null;

let drag = null; // active gesture state or null

// ---------------------------------------------------------------------------
// State access through the GC bridge
// ---------------------------------------------------------------------------

function getPart() {
  try {
    const pattern = GCref.patterns?.[GCref.variation]?.[GCref.currentPattern];
    return pattern ? pattern.part1 : null;
  } catch (e) {
    return null;
  }
}

function readVel(part, stepIdx, inst) {
  const cell = part[stepIdx];
  if (!cell) return 0;
  const v = cell[inst];
  if (v === true) return 100;          // legacy boolean cell = velocity 100
  if (typeof v === 'number') return v;
  return 0;
}

function writeVel(part, stepIdx, inst, vel) {
  if (!part[stepIdx]) part[stepIdx] = {};
  part[stepIdx][inst] = vel;
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
    try { fn(); } catch (e) { /* display refresh is best-effort */ }
  }
}

// ---------------------------------------------------------------------------
// Visuals
// ---------------------------------------------------------------------------

export function applyVelVisual(btn, vel) {
  btn.dataset.vel = String(vel);
  btn.style.setProperty('--vel', (Math.max(1, Math.min(127, vel)) / 127).toFixed(3));
}

function syncAllVelVisuals() {
  const part = getPart();
  if (!part) return;
  document.querySelectorAll('.step-button[data-instrument]').forEach(btn => {
    const inst = btn.dataset.instrument;
    const idx = parseInt(btn.dataset.step, 10) - 1;
    if (isNaN(idx)) return;
    const vel = readVel(part, idx, inst);
    if (vel > 0) applyVelVisual(btn, vel);
  });
}

function showBubble(x, y, text) {
  if (!bubbleEl) {
    bubbleEl = document.createElement('div');
    bubbleEl.id = 'gc-vel-bubble';
    bubbleEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bubbleEl);
  }
  bubbleEl.textContent = text;
  bubbleEl.style.left = `${x + 14}px`;
  bubbleEl.style.top = `${y - 34}px`;
  bubbleEl.classList.add('gc-visible');
}

function hideBubble() {
  if (bubbleEl) bubbleEl.classList.remove('gc-visible');
}

// ---------------------------------------------------------------------------
// Click suppression after a consumed drag
// ---------------------------------------------------------------------------

function suppressNextClick() {
  const swallow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener('click', swallow, true);
  };
  document.addEventListener('click', swallow, true);
  // Safety: if no click ever arrives (pointer left the document), clean up.
  setTimeout(() => document.removeEventListener('click', swallow, true), 400);
}

// ---------------------------------------------------------------------------
// Gesture handling
// ---------------------------------------------------------------------------

function onPointerDown(e) {
  if (!GCref) return;
  if (e.button !== undefined && e.button !== 0) return; // left / touch only
  const btn = e.target && e.target.closest ? e.target.closest('.step-button') : null;
  if (!btn || btn.classList.contains('disabled')) return;
  const inst = btn.dataset.instrument;
  const stepIdx = parseInt(btn.dataset.step, 10) - 1;
  if (!inst || isNaN(stepIdx)) return;

  const part = getPart();
  if (!part) return;

  const isActive = btn.classList.contains('active');

  // Shift/Alt tier shortcuts: set the tier, swallow the toggle click.
  if (e.shiftKey || e.altKey) {
    emitMutateBefore('step:tier');
    const vel = e.shiftKey ? TIER_ACCENT : TIER_GHOST;
    writeVel(part, stepIdx, inst, vel);
    applyVelVisual(btn, vel);
    refreshDisplay();
    suppressNextClick();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  drag = {
    pointerId: e.pointerId,
    btn,
    inst,
    stepIdx,
    startX: e.clientX,
    startY: e.clientY,
    startActive: isActive,
    startVel: isActive ? (readVel(part, stepIdx, inst) || 100) : 0,
    mode: 'pending',      // 'pending' | 'vel' | 'paint'
    mutated: false,
    painted: new Set()
  };

  document.addEventListener('pointermove', onPointerMove, true);
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('pointercancel', onPointerCancel, true);
}

function onPointerMove(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;
  const dx = e.clientX - drag.startX;
  const dy = drag.startY - e.clientY;   // up = louder

  if (drag.mode === 'pending') {
    if (drag.startActive && Math.abs(dy) >= DRAG_THRESHOLD && Math.abs(dy) >= Math.abs(dx)) {
      drag.mode = 'vel';
    } else if (Math.abs(dx) >= DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      drag.mode = 'paint';
    } else if (!drag.startActive && Math.abs(dy) >= DRAG_THRESHOLD * 2) {
      // vertical drag on an inactive step: not a gesture we own — let go
      cleanup();
      return;
    } else {
      return;
    }
    if (!drag.mutated) {
      emitMutateBefore(drag.mode === 'vel' ? 'step:velocity' : 'step:paint');
      drag.mutated = true;
    }
  }

  e.preventDefault();
  e.stopPropagation();

  const part = getPart();
  if (!part) return;

  if (drag.mode === 'vel') {
    const vel = Math.max(1, Math.min(127, Math.round(drag.startVel + dy)));
    writeVel(part, drag.stepIdx, drag.inst, vel);
    applyVelVisual(drag.btn, vel);
    showBubble(e.clientX, e.clientY, `${drag.inst.toUpperCase()} — ${vel}`);
  } else if (drag.mode === 'paint') {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el && el.closest ? el.closest('.step-button') : null;
    if (!cell || cell.classList.contains('disabled')) return;
    const inst = cell.dataset.instrument;
    const idx = parseInt(cell.dataset.step, 10) - 1;
    if (!inst || isNaN(idx)) return;
    const key = `${idx}:${inst}`;
    if (drag.painted.has(key)) return;
    drag.painted.add(key);
    // Paint only INACTIVE cells at 100 — an active cell is never toggled off.
    if (!readVel(part, idx, inst)) {
      writeVel(part, idx, inst, TIER_NORMAL);
      applyVelVisual(cell, TIER_NORMAL);
      cell.classList.add('active');
    }
  }
}

function onPointerUp(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;
  const consumed = drag.mode !== 'pending';
  cleanup();
  if (consumed) {
    suppressNextClick();
    refreshDisplay();
    syncAllVelVisuals();
  }
}

function onPointerCancel(e) {
  if (!drag || e.pointerId !== drag.pointerId) return;
  const consumed = drag.mode !== 'pending';
  cleanup();
  if (consumed) {
    refreshDisplay();
    syncAllVelVisuals();
  }
}

function cleanup() {
  drag = null;
  hideBubble();
  document.removeEventListener('pointermove', onPointerMove, true);
  document.removeEventListener('pointerup', onPointerUp, true);
  document.removeEventListener('pointercancel', onPointerCancel, true);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  if (typeof document === 'undefined') return;
  GCref = GC || window.GC || null;
  if (!GCref) return; // velocity editing needs the state bridge

  document.addEventListener('pointerdown', onPointerDown, true);
  syncAllVelVisuals();

  // Keep the fill bars honest after external state changes (preset loads,
  // undo, variation switches) — cheap resync on the app's own refreshes.
  if (GCref.events && typeof GCref.events.on === 'function') {
    GCref.events.on('preset:loaded', syncAllVelVisuals);
    GCref.events.on('undo', () => setTimeout(syncAllVelVisuals, 0));
    GCref.events.on('redo', () => setTimeout(syncAllVelVisuals, 0));
  }
}
