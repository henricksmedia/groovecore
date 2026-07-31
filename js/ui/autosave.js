// =============================================================================
// GrooveCore — js/ui/autosave.js  (WS-C)
// localStorage autosave: key gc.autosave.v2, debounced 400ms after 'gc:change',
// beforeunload/visibilitychange flush, 3-deep backup rotation, restore on boot
// (unless a share-URL already loaded), 'Session restored' toast with a
// Start-fresh action. Silent no-op when localStorage is unavailable.
//
// ES module. Exports init(GC). No-ops when window.GC / GCSchema are absent.
// =============================================================================

const KEY = 'gc.autosave.v2';
const BAK = ['gc.autosave.v2.bak1', 'gc.autosave.v2.bak2', 'gc.autosave.v2.bak3'];
const DEBOUNCE_MS = 400;
const ROTATE_MIN_MS = 30000; // rotate backups at most every 30s

let GC = null;
let schema = null;
let enabled = false;
let debounceTimer = null;
let lastWritten = null;
let lastRotate = 0;
let freshSnapshot = null; // pristine boot state, for the Start-fresh action

// -----------------------------------------------------------------------------
// localStorage availability
// -----------------------------------------------------------------------------

function storageAvailable() {
  try {
    const probe = '__gc_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch (e) {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Write path
// -----------------------------------------------------------------------------

function serializeNow() {
  if (!schema) return null;
  const snap = schema.snapshot();
  if (!snap) return null;
  try { return JSON.stringify(snap); } catch (e) { return null; }
}

function writeNow() {
  if (!enabled) return;
  const data = serializeNow();
  if (data === null || data === lastWritten) return;
  try {
    const ls = window.localStorage;
    const prev = ls.getItem(KEY);
    const now = Date.now();
    if (prev && prev !== data && now - lastRotate > ROTATE_MIN_MS) {
      // bak2 -> bak3, bak1 -> bak2, current -> bak1
      const b1 = ls.getItem(BAK[0]);
      const b2 = ls.getItem(BAK[1]);
      if (b2 !== null) ls.setItem(BAK[2], b2);
      if (b1 !== null) ls.setItem(BAK[1], b1);
      ls.setItem(BAK[0], prev);
      lastRotate = now;
    }
    ls.setItem(KEY, data);
    lastWritten = data;
  } catch (e) {
    // Quota exceeded or storage revoked mid-session: drop backups and retry
    // once, then go quiet — autosave must never break the app.
    try {
      for (const k of BAK) window.localStorage.removeItem(k);
      window.localStorage.setItem(KEY, data);
      lastWritten = data;
    } catch (e2) {
      console.warn('[gc-autosave] write failed — autosave disabled', e2);
      enabled = false;
    }
  }
}

function scheduleWrite() {
  if (!enabled) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { debounceTimer = null; writeNow(); }, DEBOUNCE_MS);
}

function flush() {
  if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
  writeNow();
}

function clearAll() {
  try {
    window.localStorage.removeItem(KEY);
    for (const k of BAK) window.localStorage.removeItem(k);
  } catch (e) { /* noop */ }
  lastWritten = null;
}

// -----------------------------------------------------------------------------
// Boot restore
// -----------------------------------------------------------------------------

function tryParse(json) {
  if (!json) return null;
  try {
    const snap = JSON.parse(json);
    if (!snap || typeof snap !== 'object') return null;
    if (schema.validate(snap).ok) return snap;
  } catch (e) { /* noop */ }
  return null;
}

function restoreOnBoot() {
  let snap = null;
  try {
    const ls = window.localStorage;
    snap = tryParse(ls.getItem(KEY));
    if (!snap) {
      for (const k of BAK) {
        snap = tryParse(ls.getItem(k));
        if (snap) break;
      }
    }
  } catch (e) {
    return;
  }
  if (!snap) return;

  // Remember the pristine boot state so Start fresh can return to it.
  freshSnapshot = schema.snapshot();

  const ok = schema.restore(snap);
  if (!ok) return;

  if (GC.flags) GC.flags.restoredSession = true;
  try { lastWritten = JSON.stringify(snap); } catch (e) { /* noop */ }

  const toast = window.GCToast;
  if (toast && typeof toast.show === 'function') {
    toast.show('Session restored', {
      type: 'success',
      action: {
        label: 'Start fresh',
        onClick: () => {
          clearAll();
          if (freshSnapshot) {
            schema.restore(freshSnapshot);
            try {
              if (GC.events && typeof GC.events.emit === 'function') GC.events.emit('gc:change');
            } catch (e) { /* noop */ }
          }
          if (GC.flags) GC.flags.restoredSession = false;
        }
      }
    });
  }
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = { flush, clear: clearAll, get enabled() { return enabled; } };

export function init(gc) {
  GC = gc || window.GC || null;
  schema = window.GCSchema || null;
  if (!GC || !schema) {
    console.warn('[gc-autosave] GC bridge or GCSchema missing — autosave disabled');
    return null;
  }
  if (!storageAvailable()) {
    // Private windows / disabled storage: everything else keeps working.
    return null;
  }
  enabled = true;

  // Share-URL wins over the autosaved session (share.js runs first and sets
  // the flag before we get here). The visitor's own autosave stays untouched
  // until they edit — we do NOT write on boot.
  const fromShare = !!(GC.flags && GC.flags.loadedFromShare);
  if (!fromShare) restoreOnBoot();

  // Commit stream (history.js emits on every real change, incl. undo/redo).
  if (GC.events && typeof GC.events.on === 'function') {
    GC.events.on('gc:change', scheduleWrite);
  }
  document.addEventListener('gc:change', scheduleWrite);

  // Flush on the way out.
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);

  window.GCAutosave = api;
  return api;
}

export { flush, clearAll as clear };
