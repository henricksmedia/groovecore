// =============================================================================
// GrooveCore — js/ui/history.js  (WS-C)
// Undo/redo ring buffer of 100 JSON-string snapshots (schema v2).
//
// Capture strategy: take a "before" snapshot at the START of any gesture that
// can mutate state (capture-phase listeners fire before app.js handlers run),
// then commit on settle if the serialized state actually changed. Undo and
// autosave share one commit stream: every commit emits 'gc:change'.
//
// ES module. Exports init(GC). No-ops when window.GC / GCSchema are absent.
// =============================================================================

const MAX_DEPTH = 100;
const SETTLE_MS = 350;
const DEDUPE_MS = 25; // one physical keypress can arrive via keys.js AND the fallback
const INTERVAL_MS = 5000;

let GC = null;
let schema = null;

let undoStack = [];   // JSON strings, oldest first
let redoStack = [];
let pendingBefore = null;   // JSON string captured at gesture start
let settleTimer = null;
let gestureActive = false;  // a knob drag is in flight
let applying = false;       // restore in progress — suppress capture
let lastCommitted = null;   // serialized current state after last commit/apply
// Dedupe between GC.events delivery and the direct-key fallback: one physical
// Ctrl+Z can reach us twice within the same tick. Tracked per action so an
// undo immediately followed by a redo (or held-key auto-repeat) still works.
const lastActionAt = { undo: 0, redo: 0 };

// -----------------------------------------------------------------------------
// Serialization
// -----------------------------------------------------------------------------

function serialize() {
  if (!schema) return null;
  const snap = schema.snapshot();
  if (!snap) return null;
  // savedAt would make every serialization unique; zero it for comparisons.
  if (snap.meta) snap.meta.savedAt = 0;
  try { return JSON.stringify(snap); } catch (e) { return null; }
}

function emitChange() {
  try {
    if (GC && GC.events && typeof GC.events.emit === 'function') GC.events.emit('gc:change');
  } catch (e) { /* noop */ }
  try {
    document.dispatchEvent(new CustomEvent('gc:change'));
  } catch (e) { /* noop */ }
}

// -----------------------------------------------------------------------------
// Capture / settle / commit
// -----------------------------------------------------------------------------

function beginCapture() {
  if (applying || !schema) return;
  if (pendingBefore === null) {
    pendingBefore = serialize();
  }
  armSettle();
}

function armSettle() {
  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = setTimeout(onSettle, SETTLE_MS);
}

function onSettle() {
  settleTimer = null;
  if (gestureActive) { armSettle(); return; } // knob still dragging — wait
  commit();
}

function commit() {
  if (pendingBefore === null) return;
  const before = pendingBefore;
  pendingBefore = null;
  const now = serialize();
  if (now === null || before === null) return;
  if (now === before) return; // nothing actually changed

  undoStack.push(before);
  if (undoStack.length > MAX_DEPTH) undoStack.shift();
  redoStack = [];
  lastCommitted = now;
  emitChange();
}

// -----------------------------------------------------------------------------
// Undo / redo
// -----------------------------------------------------------------------------

function applySnapshot(json) {
  let snap;
  try { snap = JSON.parse(json); } catch (e) { return false; }
  applying = true;
  let ok = false;
  try {
    ok = schema.restore(snap);
    if (ok && GC && typeof GC.setBpm === 'function' && typeof snap.tempo === 'number') {
      GC.setBpm(snap.tempo);
    }
    // Refresh every UI surface the bridge exposes (restore already refreshes
    // via applyState; these are cheap idempotent belts).
    const fns = (GC && GC.fns) || {};
    try { fns.updateStepDisplay && fns.updateStepDisplay(); } catch (e) { /* noop */ }
    try { fns.updateUIFromState && fns.updateUIFromState(); } catch (e) { /* noop */ }
    try { fns.updateAllKnobVisuals && fns.updateAllKnobVisuals(); } catch (e) { /* noop */ }
    try { fns.updatePatternIndicators && fns.updatePatternIndicators(); } catch (e) { /* noop */ }
    try { fns.updateNixieBPMDisplay && fns.updateNixieBPMDisplay(); } catch (e) { /* noop */ }
  } finally {
    applying = false;
  }
  return ok;
}

function dedupe(action) {
  // Returns true when this delivery is a duplicate of one just handled.
  const now = Date.now();
  if (now - lastActionAt[action] < DEDUPE_MS) return true;
  lastActionAt[action] = now;
  return false;
}

function undo() {
  // A pending uncommitted gesture becomes the top undo step first.
  if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
  commit();

  if (!undoStack.length) return;
  const cur = serialize();
  const target = undoStack.pop();
  if (cur !== null) redoStack.push(cur);
  if (redoStack.length > MAX_DEPTH) redoStack.shift();
  if (applySnapshot(target)) {
    lastCommitted = target;
    emitChange();
  }
}

function redo() {
  if (!redoStack.length) return;
  const cur = serialize();
  const target = redoStack.pop();
  if (cur !== null) {
    undoStack.push(cur);
    if (undoStack.length > MAX_DEPTH) undoStack.shift();
  }
  if (applySnapshot(target)) {
    lastCommitted = target;
    emitChange();
  }
}

// -----------------------------------------------------------------------------
// Mutation-source listeners
// -----------------------------------------------------------------------------

function matchesMutator(target) {
  if (!target || typeof target.closest !== 'function') return false;
  return !!(
    target.closest('#clearButton') ||
    target.closest('#reset') ||
    target.closest('#asymmetrical') ||
    target.closest('#crossrhythm') ||
    target.closest('.pattern-label[data-action]') ||
    target.closest('.row-control-box')
  );
}

function installDomListeners() {
  // Step toggles + clear-drag start on pointerdown.
  document.addEventListener('pointerdown', (e) => {
    if (applying) return;
    const t = e.target;
    if (t && typeof t.closest === 'function' && t.closest('.step-button')) beginCapture();
  }, true);

  // Bulk mutators fire on click.
  document.addEventListener('click', (e) => {
    if (applying) return;
    if (matchesMutator(e.target)) beginCapture();
  }, true);
}

function installBusListeners() {
  if (GC && GC.events && typeof GC.events.on === 'function') {
    // Modules announce mutations (preset loads, project loads, chain edits…).
    GC.events.on('mutate:before', () => beginCapture());
    GC.events.on('undo', () => { if (!dedupe('undo')) undo(); });
    GC.events.on('redo', () => { if (!dedupe('redo')) redo(); });
  }

  // Knob gestures: one drag = one undo step.
  const knobs = window.GCKnobs;
  if (knobs && typeof knobs.on === 'function') {
    try {
      knobs.on('gesture:start', () => {
        if (applying) return;
        gestureActive = true;
        beginCapture();
      });
      knobs.on('gesture:end', () => {
        gestureActive = false;
        armSettle();
      });
    } catch (e) {
      console.warn('[gc-history] GCKnobs hook failed', e);
    }
  }
}

function installKeyFallback() {
  // keys.js (WS-D) emits GC.events 'undo'/'redo'; this direct listener covers
  // the case where that module is absent. The KEY_DEDUPE_MS window inside
  // undo()/redo() makes double-delivery harmless.
  document.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!dedupe('undo')) undo(); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!dedupe('redo')) redo(); }
  });
}

function installIntervalFallback() {
  // Safety net from the plan's risk table: any mutation path the listeners
  // miss still lands in the commit stream within 5 seconds.
  setInterval(() => {
    if (applying || gestureActive || pendingBefore !== null || !schema) return;
    const now = serialize();
    if (now === null) return;
    if (lastCommitted === null) { lastCommitted = now; return; }
    if (now !== lastCommitted) {
      undoStack.push(lastCommitted);
      if (undoStack.length > MAX_DEPTH) undoStack.shift();
      redoStack = [];
      lastCommitted = now;
      emitChange();
    }
  }, INTERVAL_MS);
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = {
  undo,
  redo,
  captureBefore: beginCapture,
  get depth() { return undoStack.length; },
  get redoDepth() { return redoStack.length; }
};

export function init(gc) {
  GC = gc || window.GC || null;
  schema = window.GCSchema || null;
  if (!GC || !schema) {
    console.warn('[gc-history] GC bridge or GCSchema missing — history disabled');
    return null;
  }
  lastCommitted = serialize();
  installDomListeners();
  installBusListeners();
  installKeyFallback();
  installIntervalFallback();
  window.GCHistory = api;
  return api;
}

export { undo, redo };
