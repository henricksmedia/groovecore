// =============================================================================
// GrooveCore — js/core/schema.js  (WS-C)
// Snapshot schema v2: the ONE serialization used by autosave, undo/redo,
// .groove.json project files and share-URLs (Decree 3).
//
// ES module. Exports init(GC) and attaches window.GCSchema.
// Reads/writes app state exclusively through window.GC (frozen bridge, §5.1).
// Fails soft: every public function no-ops (or returns null) when GC is absent.
// =============================================================================

const SCHEMA_VERSION = 2;
const APP_NAME = 'groovecore';
const STEPS = 16;
const PATTERNS_PER_BANK = 16;

// Canonical voice ids — keep in sync with GrooveParams.INSTRUMENTS
const MODAL_INSTRUMENT_IDS = [
  'bd', 'sd', 'lt', 'mt', 'ht', 'rim', 'cp', 'hc', 'mc', 'lc',
  'cb', 'cl', 'ma', 'ch', 'oh', 'cym', 'cr'
];

let GC = null;

// -----------------------------------------------------------------------------
// modalKnobValues: flat `{ modalDecay: n }` → nested `{ bd: { modalDecay: n }, … }`
// -----------------------------------------------------------------------------

function isFlatModalKnobMap(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (!keys.length) return false;
  return keys.some((k) => k.startsWith('modal'));
}

/** Formerly-dead knobs stored UI-neutral 5 while the engine ignored them. */
const LEGACY_DEAD_NEUTRAL_TO_OFF = {
  modalSustain: 0,
  modalRelease: 0,
  modalCompression: 0
};

function migrateLegacyDeadModalNeutrals(bucket) {
  if (!bucket || typeof bucket !== 'object') return bucket;
  Object.keys(LEGACY_DEAD_NEUTRAL_TO_OFF).forEach((k) => {
    // Exact 5 was the old disabled-knob park position — map to engine-off.
    if (bucket[k] === 5) bucket[k] = LEGACY_DEAD_NEUTRAL_TO_OFF[k];
  });
  return bucket;
}

function normalizeModalKnobValues(raw) {
  const out = {};
  MODAL_INSTRUMENT_IDS.forEach((inst) => { out[inst] = {}; });
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;

  if (isFlatModalKnobMap(raw)) {
    const flat = {};
    Object.keys(raw).forEach((k) => {
      if (k.startsWith('modal') && typeof raw[k] === 'number' && isFinite(raw[k])) {
        flat[k] = raw[k];
      }
    });
    migrateLegacyDeadModalNeutrals(flat);
    MODAL_INSTRUMENT_IDS.forEach((inst) => { out[inst] = { ...flat }; });
    return out;
  }

  Object.keys(raw).forEach((inst) => {
    const bucket = raw[inst];
    if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) return;
    if (!out[inst]) out[inst] = {};
    Object.keys(bucket).forEach((k) => {
      if (typeof bucket[k] === 'number' && isFinite(bucket[k])) {
        out[inst][k] = bucket[k];
      }
    });
    migrateLegacyDeadModalNeutrals(out[inst]);
  });
  return out;
}

// Registered extension sections: name -> { get, set }
// chain.js (WS-D) and future features add state here without editing this file.
const sections = new Map();

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (typeof structuredClone === 'function') {
    try { return structuredClone(obj); } catch (e) { /* fall through */ }
  }
  return JSON.parse(JSON.stringify(obj));
}

function emptyPattern() {
  return {
    part1: Array.from({ length: STEPS }, () => ({})),
    part2: Array.from({ length: STEPS }, () => ({})),
    length1: 16,
    length2: 0,
    sfx1: {}
  };
}

function emptyBank() {
  return Array.from({ length: PATTERNS_PER_BANK }, () => emptyPattern());
}

function clampVel(v) {
  v = Math.round(Number(v));
  if (!isFinite(v)) return 100;
  return Math.min(127, Math.max(1, v));
}

// Normalize one step cell: velocities 1–127, `true` = legacy alias for 100,
// `accent` stays a boolean flag (it is not a voice).
function normalizeCell(cell) {
  const out = {};
  if (!cell || typeof cell !== 'object') return out;
  for (const key of Object.keys(cell)) {
    const val = cell[key];
    if (key === 'accent') {
      if (val) out.accent = true;
      continue;
    }
    if (val === true) { out[key] = 100; continue; }
    if (typeof val === 'number' && val > 0) { out[key] = clampVel(val); continue; }
    // falsy / malformed values are simply dropped (cell is sparse)
  }
  return out;
}

function normalizePart(part) {
  const src = Array.isArray(part) ? part : [];
  return Array.from({ length: STEPS }, (_, i) => normalizeCell(src[i]));
}

function normalizeSfx(sfx) {
  const out = {};
  if (!sfx || typeof sfx !== 'object') return out;
  for (const key of Object.keys(sfx)) {
    const v = sfx[key];
    if (!v || typeof v !== 'object') continue;
    if (!/^\d{1,2}:[a-z]+$/.test(key)) continue;
    const e = {};
    if (v.r === 2 || v.r === 3 || v.r === 4) e.r = v.r;
    if (v.f) e.f = 1;
    if (typeof v.p === 'number' && v.p >= 0 && v.p < 100) e.p = Math.round(v.p);
    if (typeof v.m === 'number' && v.m !== 0) e.m = Math.max(-50, Math.min(50, Math.round(v.m)));
    if (Object.keys(e).length) out[key] = e;
  }
  return out;
}

function normalizePattern(p) {
  if (!p || typeof p !== 'object') return emptyPattern();
  return {
    part1: normalizePart(p.part1),
    part2: normalizePart(p.part2),
    length1: (typeof p.length1 === 'number' && p.length1 >= 1 && p.length1 <= 16) ? Math.round(p.length1) : 16,
    length2: (typeof p.length2 === 'number' && p.length2 >= 0 && p.length2 <= 16) ? Math.round(p.length2) : 0,
    sfx1: normalizeSfx(p.sfx1)
  };
}

function normalizeBank(bank) {
  const src = Array.isArray(bank) ? bank : [];
  return Array.from({ length: PATTERNS_PER_BANK }, (_, i) => normalizePattern(src[i]));
}

function readMuteSolo(state) {
  // Accept every historical shape: {muted:Set|Array, soloed:Set|Array} under
  // either `muteSoloState` (app.js / v1 files) or `muteSolo` (schema v2).
  const raw = (state && (state.muteSolo || state.muteSoloState)) || {};
  const toArr = (x) => {
    if (Array.isArray(x)) return x.slice();
    if (x && typeof x.forEach === 'function') { const a = []; x.forEach((v) => a.push(v)); return a; }
    return [];
  };
  return { muted: toArr(raw.muted), soloed: toArr(raw.soloed) };
}

// -----------------------------------------------------------------------------
// registerSection — extension bag
// -----------------------------------------------------------------------------

function registerSection(name, getFn, setFn) {
  if (typeof name !== 'string' || !name) return;
  sections.set(name, {
    get: typeof getFn === 'function' ? getFn : null,
    set: typeof setFn === 'function' ? setFn : null
  });
}

function collectExt() {
  const ext = {};
  for (const [name, s] of sections) {
    if (!s.get) continue;
    try {
      const val = s.get();
      if (val !== undefined) ext[name] = deepClone(val);
    } catch (e) {
      console.warn('[gc-schema] ext section "' + name + '" get() failed', e);
    }
  }
  return ext;
}

function applyExt(ext) {
  const bag = (ext && typeof ext === 'object') ? ext : {};
  for (const [name, s] of sections) {
    if (!s.set) continue;
    try { s.set(deepClone(bag[name])); }
    catch (e) { console.warn('[gc-schema] ext section "' + name + '" set() failed', e); }
  }
}

// -----------------------------------------------------------------------------
// snapshot / restore
// -----------------------------------------------------------------------------

function snapshot() {
  if (!GC || typeof GC.getState !== 'function') return null;
  let s;
  try { s = GC.getState(); } catch (e) { console.warn('[gc-schema] GC.getState failed', e); return null; }
  if (!s || typeof s !== 'object') return null;

  const ms = readMuteSolo(s);
  const patterns = s.patterns || {};

  return {
    v: SCHEMA_VERSION,
    meta: {
      app: APP_NAME,
      name: (GC.flags && typeof GC.flags.projectName === 'string' && GC.flags.projectName) || 'untitled',
      savedAt: new Date().toISOString()
    },
    tempo: (typeof s.tempo === 'number' && isFinite(s.tempo)) ? Math.round(s.tempo) : 120,
    knobValues: deepClone(s.knobValues || {}),
    patternControls: deepClone(s.patternControls || {}),
    modalKnobValues: normalizeModalKnobValues(s.modalKnobValues || {}),
    muteSolo: ms,
    patterns: { a: normalizeBank(patterns.a), b: normalizeBank(patterns.b) },
    sel: {
      variation: (s.variation === 'b') ? 'b' : 'a',
      currentPattern: (typeof s.currentPattern === 'number') ? Math.min(15, Math.max(0, Math.round(s.currentPattern))) : 0
    },
    ext: collectExt()
  };
}

function restore(state) {
  if (!GC || typeof GC.applyState !== 'function') return false;
  if (!state || typeof state !== 'object') return false;

  // Legacy files (no `v` field) migrate transparently.
  if (state.v === undefined) state = migrateV1(state);
  if (!state) return false;

  const check = validate(state);
  if (!check.ok) {
    console.warn('[gc-schema] restore rejected:', check.errors);
    return false;
  }

  const ms = readMuteSolo(state);
  const arg = {
    patterns: { a: normalizeBank(state.patterns && state.patterns.a), b: normalizeBank(state.patterns && state.patterns.b) },
    knobValues: deepClone(state.knobValues || {}),
    patternControls: deepClone(state.patternControls || {}),
    modalKnobValues: normalizeModalKnobValues(state.modalKnobValues || {}),
    // Provide both spellings so the bridge and any legacy path both match.
    muteSolo: { muted: ms.muted.slice(), soloed: ms.soloed.slice() },
    muteSoloState: { muted: ms.muted.slice(), soloed: ms.soloed.slice() },
    tempo: (typeof state.tempo === 'number' && isFinite(state.tempo)) ? Math.round(state.tempo) : 120,
    variation: (state.sel && state.sel.variation === 'b') ? 'b' : 'a',
    currentPattern: (state.sel && typeof state.sel.currentPattern === 'number')
      ? Math.min(15, Math.max(0, Math.round(state.sel.currentPattern))) : 0,
    sel: {
      variation: (state.sel && state.sel.variation === 'b') ? 'b' : 'a',
      currentPattern: (state.sel && typeof state.sel.currentPattern === 'number')
        ? Math.min(15, Math.max(0, Math.round(state.sel.currentPattern))) : 0
    }
  };

  try {
    GC.applyState(arg);
  } catch (e) {
    console.warn('[gc-schema] GC.applyState failed', e);
    return false;
  }

  // Belt and braces: make certain Transport tempo + nixie agree with the snapshot.
  try { if (typeof GC.setBpm === 'function') GC.setBpm(arg.tempo); } catch (e) { /* noop */ }

  applyExt(state.ext);

  if (state.meta && typeof state.meta.name === 'string' && GC.flags) {
    GC.flags.projectName = state.meta.name;
  }
  return true;
}

// -----------------------------------------------------------------------------
// migrateV1 — legacy io808-save.json (no `v` field)
// -----------------------------------------------------------------------------
// Accepted shapes, forever:
//   1. { patterns: {a,b}, knobValues, tempo, muteSoloState: {muted:[],soloed:[]},
//        modalKnobValues, patternControls, variation, currentPattern, ... }
//   2. bare Array of 16 pattern objects (the oldest format — bank A only)
// Cells with `true` become velocity 100; `accent: true` stays a flag.

function migrateV1(data) {
  if (!data || typeof data !== 'object') return null;

  let banks;
  if (Array.isArray(data)) {
    banks = { a: data, b: [] };
    data = {};
  } else if (data.patterns && typeof data.patterns === 'object') {
    banks = { a: data.patterns.a, b: data.patterns.b };
  } else {
    return null;
  }

  const ms = readMuteSolo(data);

  return {
    v: SCHEMA_VERSION,
    meta: {
      app: APP_NAME,
      name: (data.meta && typeof data.meta.name === 'string' && data.meta.name) || 'untitled',
      savedAt: new Date().toISOString()
    },
    tempo: (typeof data.tempo === 'number' && isFinite(data.tempo)) ? Math.round(data.tempo) : 120,
    knobValues: deepClone(data.knobValues || {}),
    patternControls: deepClone(data.patternControls || {}),
    modalKnobValues: normalizeModalKnobValues(data.modalKnobValues || {}),
    muteSolo: ms,
    // normalizeBank converts every `true` cell to velocity 100 and adds sfx1:{}
    patterns: { a: normalizeBank(banks.a), b: normalizeBank(banks.b) },
    sel: {
      variation: (data.variation === 'b') ? 'b' : 'a',
      currentPattern: (typeof data.currentPattern === 'number') ? Math.min(15, Math.max(0, Math.round(data.currentPattern))) : 0
    },
    ext: {}
  };
}

// -----------------------------------------------------------------------------
// validate
// -----------------------------------------------------------------------------

function validate(state) {
  const errors = [];
  const push = (m) => errors.push(m);

  if (!state || typeof state !== 'object') {
    return { ok: false, errors: ['state is not an object'] };
  }
  if (state.v !== SCHEMA_VERSION) push('unsupported schema version: ' + state.v);
  if (state.tempo !== undefined && (typeof state.tempo !== 'number' || !isFinite(state.tempo) || state.tempo < 20 || state.tempo > 400)) {
    push('tempo out of range: ' + state.tempo);
  }
  if (state.knobValues !== undefined && (typeof state.knobValues !== 'object' || state.knobValues === null || Array.isArray(state.knobValues))) {
    push('knobValues must be an object');
  } else if (state.knobValues) {
    for (const k of Object.keys(state.knobValues)) {
      const v = state.knobValues[k];
      if (typeof v !== 'number' || !isFinite(v)) { push('knobValues.' + k + ' is not a finite number'); break; }
    }
  }
  if (!state.patterns || typeof state.patterns !== 'object') {
    push('patterns missing');
  } else {
    for (const bankKey of ['a', 'b']) {
      const bank = state.patterns[bankKey];
      if (bank === undefined) continue; // sparse share snapshots may omit a bank
      if (!Array.isArray(bank)) { push('patterns.' + bankKey + ' must be an array'); continue; }
      if (bank.length > PATTERNS_PER_BANK) { push('patterns.' + bankKey + ' has more than 16 entries'); continue; }
      bank.forEach((p, i) => {
        if (p == null) return;
        if (typeof p !== 'object') { push('patterns.' + bankKey + '[' + i + '] is not an object'); return; }
        for (const part of ['part1', 'part2']) {
          if (p[part] !== undefined && !Array.isArray(p[part])) push('patterns.' + bankKey + '[' + i + '].' + part + ' must be an array');
          if (Array.isArray(p[part]) && p[part].length > STEPS) push('patterns.' + bankKey + '[' + i + '].' + part + ' exceeds 16 steps');
        }
      });
    }
  }
  if (state.muteSolo !== undefined && state.muteSolo !== null) {
    const ms = state.muteSolo;
    if (typeof ms !== 'object') push('muteSolo must be an object');
    else {
      if (ms.muted !== undefined && !Array.isArray(ms.muted)) push('muteSolo.muted must be an array');
      if (ms.soloed !== undefined && !Array.isArray(ms.soloed)) push('muteSolo.soloed must be an array');
    }
  }
  if (state.sel !== undefined && state.sel !== null) {
    if (typeof state.sel !== 'object') push('sel must be an object');
    else if (state.sel.variation !== undefined && state.sel.variation !== 'a' && state.sel.variation !== 'b') {
      push('sel.variation must be "a" or "b"');
    }
  }
  if (state.ext !== undefined && state.ext !== null && (typeof state.ext !== 'object' || Array.isArray(state.ext))) {
    push('ext must be an object');
  }
  return { ok: errors.length === 0, errors };
}

// -----------------------------------------------------------------------------
// toShare / fromShare — sparse encoding for share-URLs
// -----------------------------------------------------------------------------
// Steps are encoded as [stepIdx, vel] pairs per instrument; accent flags use
// the pseudo-instrument key "accent" with value 1. Empty patterns are omitted.

function partToSparse(part) {
  const map = {};
  for (let step = 0; step < part.length; step++) {
    const cell = part[step];
    for (const inst of Object.keys(cell)) {
      const val = (inst === 'accent') ? 1 : cell[inst];
      if (!map[inst]) map[inst] = [];
      map[inst].push([step, val]);
    }
  }
  return Object.keys(map).length ? map : null;
}

function sparseToPart(map) {
  const part = Array.from({ length: STEPS }, () => ({}));
  if (!map || typeof map !== 'object') return part;
  for (const inst of Object.keys(map)) {
    const pairs = map[inst];
    if (!Array.isArray(pairs)) continue;
    for (const pair of pairs) {
      if (!Array.isArray(pair) || pair.length < 2) continue;
      const step = Math.round(Number(pair[0]));
      if (!(step >= 0 && step < STEPS)) continue;
      if (inst === 'accent') part[step].accent = true;
      else part[step][inst] = clampVel(pair[1]);
    }
  }
  return part;
}

function nonEmptyObj(o) {
  return o && typeof o === 'object' && Object.keys(o).length > 0;
}

function toShare(snap) {
  snap = snap || snapshot();
  if (!snap) return null;

  const out = {
    v: SCHEMA_VERSION,
    t: snap.tempo,
    sel: [snap.sel.variation, snap.sel.currentPattern]
  };
  if (snap.meta && snap.meta.name && snap.meta.name !== 'untitled') out.n = snap.meta.name;
  if (nonEmptyObj(snap.knobValues)) out.kv = snap.knobValues;
  if (nonEmptyObj(snap.modalKnobValues)) out.mk = snap.modalKnobValues;
  if (snap.patternControls && Object.keys(snap.patternControls).some((k) => nonEmptyObj(snap.patternControls[k]))) {
    out.pc = snap.patternControls;
  }
  const ms = snap.muteSolo || { muted: [], soloed: [] };
  if (ms.muted.length || ms.soloed.length) out.ms = [ms.muted, ms.soloed];
  if (nonEmptyObj(snap.ext)) out.ext = snap.ext;

  const p = {};
  for (const bankKey of ['a', 'b']) {
    const bank = snap.patterns[bankKey] || [];
    for (let i = 0; i < bank.length; i++) {
      const pat = bank[i];
      const s1 = partToSparse(pat.part1);
      const s2 = partToSparse(pat.part2);
      const lenNonDefault = pat.length1 !== 16 || pat.length2 !== 0;
      const fx = nonEmptyObj(pat.sfx1) ? pat.sfx1 : null;
      if (!s1 && !s2 && !lenNonDefault && !fx) continue;
      const entry = {};
      if (s1) entry['1'] = s1;
      if (s2) entry['2'] = s2;
      if (lenNonDefault) entry.l = [pat.length1, pat.length2];
      if (fx) entry.x = fx;
      p[bankKey + i] = entry;
    }
  }
  if (Object.keys(p).length) out.p = p;
  return out;
}

function fromShare(share) {
  if (!share || typeof share !== 'object' || share.v !== SCHEMA_VERSION) return null;

  const snap = {
    v: SCHEMA_VERSION,
    meta: {
      app: APP_NAME,
      name: (typeof share.n === 'string' && share.n) || 'untitled',
      savedAt: new Date().toISOString()
    },
    tempo: (typeof share.t === 'number' && isFinite(share.t)) ? Math.round(share.t) : 120,
    knobValues: deepClone(share.kv || {}),
    patternControls: deepClone(share.pc || {}),
    modalKnobValues: normalizeModalKnobValues(share.mk || {}),
    muteSolo: {
      muted: (Array.isArray(share.ms) && Array.isArray(share.ms[0])) ? share.ms[0].slice() : [],
      soloed: (Array.isArray(share.ms) && Array.isArray(share.ms[1])) ? share.ms[1].slice() : []
    },
    patterns: { a: emptyBank(), b: emptyBank() },
    sel: {
      variation: (Array.isArray(share.sel) && share.sel[0] === 'b') ? 'b' : 'a',
      currentPattern: (Array.isArray(share.sel) && typeof share.sel[1] === 'number')
        ? Math.min(15, Math.max(0, Math.round(share.sel[1]))) : 0
    },
    ext: deepClone(share.ext || {})
  };

  if (share.p && typeof share.p === 'object') {
    for (const key of Object.keys(share.p)) {
      const m = /^([ab])(\d{1,2})$/.exec(key);
      if (!m) continue;
      const bankKey = m[1];
      const idx = parseInt(m[2], 10);
      if (!(idx >= 0 && idx < PATTERNS_PER_BANK)) continue;
      const entry = share.p[key];
      if (!entry || typeof entry !== 'object') continue;
      const pat = snap.patterns[bankKey][idx];
      pat.part1 = sparseToPart(entry['1']);
      pat.part2 = sparseToPart(entry['2']);
      if (Array.isArray(entry.l)) {
        const l1 = Math.round(Number(entry.l[0]));
        const l2 = Math.round(Number(entry.l[1]));
        if (l1 >= 1 && l1 <= 16) pat.length1 = l1;
        if (l2 >= 0 && l2 <= 16) pat.length2 = l2;
      }
      pat.sfx1 = normalizeSfx(entry.x);
    }
  }
  return snap;
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = {
  snapshot, restore, migrateV1, validate, toShare, fromShare, registerSection,
  normalizeModalKnobValues
};

export function init(gc) {
  GC = gc || window.GC || null;
  window.GCSchema = api;
  return api;
}

export {
  snapshot, restore, migrateV1, validate, toShare, fromShare, registerSection,
  normalizeModalKnobValues
};
