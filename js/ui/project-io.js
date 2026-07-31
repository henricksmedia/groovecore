// =============================================================================
// GrooveCore — js/ui/project-io.js  (WS-C)
// Modern project files: capture-phase intercepts on #save / #load.
//   Save: downloads groovecore-<name>-<yyyymmdd>.groove.json (schema v2).
//   Load: accepts v2 .groove.json and legacy v1 io808-save.json (migrateV1),
//         1MB cap, validation errors surface as toasts, and the load lands as
//         ONE undo step (via the 'mutate:before' capture in history.js).
//
// The intercept lives on document in the capture phase, so it runs before the
// legacy bubble-phase handlers on the buttons; stopPropagation keeps the old
// code paths dormant (but intact on disk as fallback). If GC/GCSchema are
// missing, this module never installs and legacy save/load keep working.
//
// ES module. Exports init(GC).
// =============================================================================

const MAX_FILE_BYTES = 1024 * 1024; // 1MB

let GC = null;
let schema = null;

function toast(msg, opts) {
  const t = window.GCToast;
  if (t && typeof t.show === 'function') t.show(msg, opts);
  else console.log('[gc-project-io]', msg);
}

// -----------------------------------------------------------------------------
// Save
// -----------------------------------------------------------------------------

function fileSafeName(name) {
  const s = String(name || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'untitled';
}

function yyyymmdd() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
}

function doSave() {
  const snap = schema.snapshot();
  if (!snap) {
    toast('Nothing to save yet', { type: 'warn' });
    return;
  }
  const name = fileSafeName(snap.meta && snap.meta.name);
  const filename = 'groovecore-' + name + '-' + yyyymmdd() + '.groove.json';
  try {
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast('Project saved: ' + filename, { type: 'success' });
  } catch (e) {
    console.error('[gc-project-io] save failed', e);
    toast('Save failed: ' + e.message, { type: 'error' });
  }
}

// -----------------------------------------------------------------------------
// Load
// -----------------------------------------------------------------------------

function doLoadPicker() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = () => {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      toast('File too large — project files must be under 1MB', { type: 'error' });
      return;
    }
    if (!/\.json$/i.test(file.name)) {
      toast('Invalid file type — pick a .groove.json or .json file', { type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast('Could not read the file', { type: 'error' });
    reader.onload = () => {
      loadFromText(String(reader.result), file.name);
    };
    reader.readAsText(file);
  };
  input.click();
}

function loadFromText(text, filename) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    toast('Not valid JSON: ' + filename, { type: 'error' });
    return;
  }

  let snap = null;
  let migrated = false;
  if (data && typeof data === 'object' && data.v === 2) {
    snap = data;
  } else {
    // Legacy io808-save.json (object without `v`, or the ancient bare array).
    snap = schema.migrateV1(data);
    migrated = snap !== null;
  }
  if (!snap) {
    toast('Unrecognized project format: ' + filename, { type: 'error' });
    return;
  }

  const check = schema.validate(snap);
  if (!check.ok) {
    toast('Invalid project file: ' + check.errors[0], { type: 'error' });
    console.warn('[gc-project-io] validation errors', check.errors);
    return;
  }

  // One undo step: history.js captures the 'before' snapshot on this event
  // and commits on settle after restore() lands.
  try {
    if (GC.events && typeof GC.events.emit === 'function') GC.events.emit('mutate:before');
  } catch (e) { /* noop */ }

  if (!schema.restore(snap)) {
    toast('Failed to apply project: ' + filename, { type: 'error' });
    return;
  }

  const name = (snap.meta && snap.meta.name) || 'untitled';
  toast('Loaded "' + name + '"' + (migrated ? ' (migrated from v1)' : ''), { type: 'success' });
}

// -----------------------------------------------------------------------------
// Capture-phase intercepts
// -----------------------------------------------------------------------------

function installIntercepts() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || typeof t.closest !== 'function') return;
    if (t.closest('#save')) {
      e.preventDefault();
      e.stopPropagation();
      doSave();
    } else if (t.closest('#load')) {
      e.preventDefault();
      e.stopPropagation();
      doLoadPicker();
    }
  }, true);
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = { save: doSave, load: doLoadPicker, loadFromText };

export function init(gc) {
  GC = gc || window.GC || null;
  schema = window.GCSchema || null;
  if (!GC || !schema) {
    // Legacy #save/#load handlers stay in charge.
    console.warn('[gc-project-io] GC bridge or GCSchema missing — legacy save/load active');
    return null;
  }
  installIntercepts();
  window.GCProjectIO = api;
  return api;
}

export { doSave as save, doLoadPicker as load, loadFromText };
