// =============================================================================
// GrooveCore — js/ui/chain.js (WS-D)
// 8-slot pattern chain bar, injected after .step-sequencer-panel.
//
//   [ LOOP | CHAIN ]  [A1][B3][—][—][—][—][—][—]  [DUP →]
//
// - Slot click opens a picker (variation a/b × pattern 1–16, or clear).
// - LOOP mode: current behavior, chain dormant.
// - CHAIN mode: on the sequencer's wrap to step 0 (GC.events 'step'),
//   GC.selectPattern(next slot) — inherently bar-quantized.
// - DUP → duplicates the current pattern (GC.duplicatePattern) into a free
//   pattern index and drops it into the next empty chain slot.
// - Registers { mode, slots, pos } via schema.registerSection('chain', …)
//   so chains persist in saves/shares and travel with exports.
// =============================================================================

const SLOT_COUNT = 8;
const EMPTY_LABEL = '—'; // em dash

let GCRef = null;
let state = {
  mode: 'loop',
  slots: new Array(SLOT_COUNT).fill(null), // each: { v: 'a'|'b', i: 0–15 } or null
  pos: 0
};

let barEl = null;
let pickerEl = null;
let pickerSlotIndex = -1;
let lastStep = null;
let schemaRetryTimer = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function gc() { return GCRef || window.GC || null; }

function toast(msg, type) {
  try {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
      window.GCToast.show(msg, { type: type || 'info', duration: 2200 });
      return;
    }
  } catch (e) { /* fall through */ }
  console.log('[gc-chain]', msg);
}

function slotLabel(slot) {
  return slot ? `${slot.v.toUpperCase()}${slot.i + 1}` : EMPTY_LABEL;
}

function nextFilled(from) {
  for (let n = 0; n < SLOT_COUNT; n++) {
    const idx = (from + n) % SLOT_COUNT;
    if (state.slots[idx]) return idx;
  }
  return -1;
}

function nextEmptySlot() {
  return state.slots.findIndex((s) => !s);
}

function emitMutateBefore() {
  const g = gc();
  if (g && g.events && typeof g.events.emit === 'function') {
    try { g.events.emit('mutate:before'); } catch (e) { /* undo optional */ }
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function injectStyles() {
  if (document.getElementById('gc-chain-css')) return;
  const style = document.createElement('style');
  style.id = 'gc-chain-css';
  style.textContent = `
    #gc-chainBar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
      margin: 10px 0; padding: 10px 14px; position: relative;
      background: linear-gradient(160deg, #1d1d1f, #151517);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
      font-family: 'Roboto', sans-serif;
    }
    #gc-chainBar .gc-chain-title {
      font: 700 11px/1 'Roboto', sans-serif; letter-spacing: 0.12em; color: #999;
    }
    .gc-chain-mode { display: inline-flex; border: 1px solid #555; border-radius: 5px; overflow: hidden; }
    .gc-chain-mode button {
      font: 700 10px/1 'Roboto', sans-serif; letter-spacing: 0.08em;
      color: #aaa; background: #232325; border: 0; padding: 6px 10px; cursor: pointer;
    }
    .gc-chain-mode button.gc-active { background: #ff6b35; color: #111; }
    .gc-chain-slots { display: inline-flex; gap: 5px; flex-wrap: wrap; }
    .gc-chain-slot {
      min-width: 38px; padding: 6px 4px; cursor: pointer;
      font: 700 11px/1 'Roboto Mono', Consolas, monospace;
      color: #ccc; background: #232325; border: 1px solid #4a4a4a; border-radius: 5px;
      transition: background 0.12s, border-color 0.12s, box-shadow 0.12s;
    }
    .gc-chain-slot:hover { background: #333; }
    .gc-chain-slot.gc-filled { color: #ffb08a; border-color: #7a4a30; }
    .gc-chain-slot.gc-playing {
      background: #ff6b35; color: #111; border-color: #ff8c5a;
      box-shadow: 0 0 6px rgba(255, 107, 53, 0.6);
    }
    #gc-chainDup {
      font: 700 10px/1 'Roboto', sans-serif; letter-spacing: 0.08em;
      color: #ddd; background: #2a2a2a; border: 1px solid #555;
      border-radius: 5px; padding: 6px 10px; cursor: pointer;
    }
    #gc-chainDup:hover { background: #3a3a3a; }
    #gc-chainPicker {
      position: absolute; top: calc(100% + 4px); left: 12px; z-index: 9000;
      background: #1b1b1d; border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 8px; padding: 10px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    }
    #gc-chainPicker .gc-picker-row { display: flex; align-items: center; gap: 4px; margin-bottom: 5px; }
    #gc-chainPicker .gc-picker-var {
      width: 18px; font: 700 11px/1 'Roboto', sans-serif; color: #999; text-align: center;
    }
    #gc-chainPicker button.gc-picker-cell {
      width: 26px; height: 24px; cursor: pointer;
      font: 600 10px/1 'Roboto Mono', Consolas, monospace;
      color: #ccc; background: #262628; border: 1px solid #4a4a4a; border-radius: 4px;
    }
    #gc-chainPicker button.gc-picker-cell:hover { background: #ff6b35; color: #111; }
    #gc-chainPicker button.gc-picker-clear {
      width: 100%; margin-top: 2px; cursor: pointer; padding: 5px 0;
      font: 700 10px/1 'Roboto', sans-serif; letter-spacing: 0.08em;
      color: #f87171; background: transparent; border: 1px solid #5b2727; border-radius: 4px;
    }
    #gc-chainPicker button.gc-picker-clear:hover { background: #3a1d1d; }
  `;
  document.head.appendChild(style);
}

function render() {
  if (!barEl) return;
  barEl.querySelectorAll('.gc-chain-mode button').forEach((b) => {
    b.classList.toggle('gc-active', b.dataset.mode === state.mode);
  });
  const g = gc();
  const playingChain = state.mode === 'chain' && g && g.isPlaying;
  barEl.querySelectorAll('.gc-chain-slot').forEach((el, idx) => {
    const slot = state.slots[idx];
    el.textContent = slotLabel(slot);
    el.classList.toggle('gc-filled', !!slot);
    el.classList.toggle('gc-playing', !!slot && playingChain && idx === state.pos);
    el.title = slot
      ? `Slot ${idx + 1}: pattern ${slotLabel(slot)} — click to change`
      : `Slot ${idx + 1}: empty — click to assign a pattern`;
  });
}

function buildBar() {
  const panel = document.querySelector('.step-sequencer-panel');
  if (!panel || document.getElementById('gc-chainBar')) return false;

  injectStyles();

  barEl = document.createElement('div');
  barEl.id = 'gc-chainBar';

  const title = document.createElement('span');
  title.className = 'gc-chain-title';
  title.textContent = 'CHAIN';
  barEl.appendChild(title);

  const modeWrap = document.createElement('div');
  modeWrap.className = 'gc-chain-mode';
  ['loop', 'chain'].forEach((mode) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.mode = mode;
    b.textContent = mode.toUpperCase();
    b.title = mode === 'loop'
      ? 'Loop the selected pattern (chain dormant)'
      : 'Play the chain slots in order, switching at each bar';
    b.addEventListener('click', () => setMode(mode));
    modeWrap.appendChild(b);
  });
  barEl.appendChild(modeWrap);

  const slotsWrap = document.createElement('div');
  slotsWrap.className = 'gc-chain-slots';
  for (let i = 0; i < SLOT_COUNT; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gc-chain-slot';
    b.dataset.slot = String(i);
    b.textContent = EMPTY_LABEL;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      openPicker(i, b);
    });
    slotsWrap.appendChild(b);
  }
  barEl.appendChild(slotsWrap);

  const dup = document.createElement('button');
  dup.id = 'gc-chainDup';
  dup.type = 'button';
  dup.textContent = 'DUP →';
  dup.title = 'Duplicate the current pattern into a free pattern and add it to the next empty chain slot';
  dup.addEventListener('click', duplicateIntoChain);
  barEl.appendChild(dup);

  panel.insertAdjacentElement('afterend', barEl);
  return true;
}

// ---------------------------------------------------------------------------
// Picker
// ---------------------------------------------------------------------------

function closePicker() {
  if (pickerEl) {
    pickerEl.remove();
    pickerEl = null;
    pickerSlotIndex = -1;
    document.removeEventListener('click', onDocClickForPicker, true);
    document.removeEventListener('keydown', onDocKeyForPicker, true);
  }
}

function onDocClickForPicker(e) {
  if (pickerEl && !pickerEl.contains(e.target)) closePicker();
}

function onDocKeyForPicker(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    closePicker();
  }
}

function openPicker(slotIndex, anchorBtn) {
  if (pickerEl && pickerSlotIndex === slotIndex) { closePicker(); return; }
  closePicker();
  pickerSlotIndex = slotIndex;

  pickerEl = document.createElement('div');
  pickerEl.id = 'gc-chainPicker';
  pickerEl.setAttribute('role', 'menu');
  pickerEl.setAttribute('aria-label', `Assign pattern to chain slot ${slotIndex + 1}`);

  ['a', 'b'].forEach((v) => {
    const row = document.createElement('div');
    row.className = 'gc-picker-row';
    const label = document.createElement('span');
    label.className = 'gc-picker-var';
    label.textContent = v.toUpperCase();
    row.appendChild(label);
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'gc-picker-cell';
      cell.textContent = String(i + 1);
      cell.title = `Pattern ${v.toUpperCase()}${i + 1}`;
      cell.addEventListener('click', () => {
        assignSlot(slotIndex, { v, i });
        closePicker();
      });
      row.appendChild(cell);
    }
    pickerEl.appendChild(row);
  });

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'gc-picker-clear';
  clear.textContent = 'CLEAR SLOT';
  clear.addEventListener('click', () => {
    assignSlot(slotIndex, null);
    closePicker();
  });
  pickerEl.appendChild(clear);

  barEl.appendChild(pickerEl);
  // Anchor roughly under the clicked slot.
  const barRect = barEl.getBoundingClientRect();
  const btnRect = anchorBtn.getBoundingClientRect();
  const left = Math.max(8, Math.min(btnRect.left - barRect.left, barRect.width - 480));
  pickerEl.style.left = `${left}px`;

  document.addEventListener('click', onDocClickForPicker, true);
  document.addEventListener('keydown', onDocKeyForPicker, true);
}

// ---------------------------------------------------------------------------
// State changes
// ---------------------------------------------------------------------------

function assignSlot(index, slot) {
  emitMutateBefore();
  state.slots[index] = slot;
  if (!state.slots[state.pos]) {
    const next = nextFilled(0);
    state.pos = next >= 0 ? next : 0;
  }
  render();
}

function setMode(mode) {
  if (mode !== 'loop' && mode !== 'chain') return;
  if (state.mode === mode) return;
  if (mode === 'chain' && nextFilled(0) < 0) {
    toast('Add a pattern to a chain slot first', 'warning');
    return;
  }
  state.mode = mode;
  if (mode === 'chain') {
    const first = nextFilled(0);
    if (first >= 0) state.pos = first;
  }
  render();
  toast(mode === 'chain' ? 'Chain mode: patterns switch at the bar' : 'Loop mode');
}

function isPatternEmpty(pattern) {
  if (!pattern || !Array.isArray(pattern.part1)) return false;
  return pattern.part1.every((cell) => {
    if (!cell || typeof cell !== 'object') return true;
    return Object.keys(cell).every((k) => !cell[k]);
  });
}

function duplicateIntoChain() {
  const g = gc();
  if (!g || typeof g.duplicatePattern !== 'function') {
    toast('Duplicate is not available yet', 'warning');
    return;
  }
  const slotIdx = nextEmptySlot();
  if (slotIdx < 0) {
    toast('All 8 chain slots are full', 'warning');
    return;
  }
  const fromV = g.variation;
  const fromI = g.currentPattern;
  const bank = g.patterns && g.patterns[fromV];
  if (!bank) return;

  // Find a free pattern index in the same variation that no chain slot uses.
  const used = new Set(state.slots.filter(Boolean).map((s) => `${s.v}:${s.i}`));
  used.add(`${fromV}:${fromI}`);
  let toI = -1;
  for (let i = 0; i < bank.length; i++) {
    if (!used.has(`${fromV}:${i}`) && isPatternEmpty(bank[i])) { toI = i; break; }
  }
  if (toI < 0) {
    toast('No empty pattern left to duplicate into', 'warning');
    return;
  }

  emitMutateBefore();
  try {
    g.duplicatePattern({ v: fromV, i: fromI }, { v: fromV, i: toI });
  } catch (e) {
    console.warn('[gc-chain]', e);
    toast('Duplicate failed', 'error');
    return;
  }
  state.slots[slotIdx] = { v: fromV, i: toI };
  render();
  toast(`Duplicated ${fromV.toUpperCase()}${fromI + 1} → ${fromV.toUpperCase()}${toI + 1} (slot ${slotIdx + 1})`);
}

// ---------------------------------------------------------------------------
// Playback: bar-quantized chain advance
// ---------------------------------------------------------------------------

function selectSlot(idx) {
  const g = gc();
  const slot = state.slots[idx];
  if (!g || !slot || typeof g.selectPattern !== 'function') return;
  state.pos = idx;
  try { g.selectPattern(slot.v, slot.i); } catch (e) { console.warn('[gc-chain]', e); }
  render();
}

function onStep(data) {
  const step = (data && typeof data === 'object') ? data.step : data;
  if (typeof step !== 'number') return;

  if (state.mode === 'chain') {
    // Wrap to 0 = the bar boundary. Skip the very first step of playback.
    if (step === 0 && lastStep !== null && lastStep !== 0) {
      const next = nextFilled(state.pos + 1);
      if (next >= 0) selectSlot(next);
    }
  }
  lastStep = step;
}

function onPlay() {
  lastStep = null;
  if (state.mode === 'chain') {
    const first = nextFilled(0);
    if (first >= 0) selectSlot(first);
  }
  render();
}

function onStop() {
  lastStep = null;
  render();
}

// ---------------------------------------------------------------------------
// Persistence: ext.chain via schema.registerSection
// ---------------------------------------------------------------------------

function snapshot() {
  return {
    mode: state.mode,
    slots: state.slots.map((s) => (s ? { v: s.v, i: s.i } : null)),
    pos: state.pos
  };
}

function applySnapshot(v) {
  if (!v || typeof v !== 'object') return;
  state.mode = v.mode === 'chain' ? 'chain' : 'loop';
  const slots = Array.isArray(v.slots) ? v.slots : [];
  state.slots = new Array(SLOT_COUNT).fill(null).map((_, idx) => {
    const s = slots[idx];
    if (s && (s.v === 'a' || s.v === 'b') && Number.isInteger(s.i) && s.i >= 0 && s.i < 16) {
      return { v: s.v, i: s.i };
    }
    return null;
  });
  const pos = Number.isInteger(v.pos) ? v.pos : 0;
  state.pos = pos >= 0 && pos < SLOT_COUNT ? pos : 0;
  render();
}

function registerWithSchema(attempt) {
  const schema = window.GCSchema || window.GrooveSchema;
  if (schema && typeof schema.registerSection === 'function') {
    try {
      schema.registerSection('chain', { get: snapshot, set: applySnapshot });
    } catch (e) {
      console.warn('[gc-chain] registerSection', e);
    }
    return;
  }
  // Schema module (WS-C) may boot after us — retry lazily for a while.
  if (attempt < 20) {
    clearTimeout(schemaRetryTimer);
    schemaRetryTimer = setTimeout(() => registerWithSchema(attempt + 1), 500);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  GCRef = GC || window.GC || null;

  if (!buildBar()) {
    // Sequencer panel missing (very early boot) — retry once on load.
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => { buildBar(); render(); }, { once: true });
    }
  }
  render();

  const g = gc();
  if (g && g.events && typeof g.events.on === 'function') {
    g.events.on('step', onStep);
    g.events.on('play', onPlay);
    g.events.on('stop', onStop);
  }

  registerWithSchema(0);

  window.GCChain = { get state() { return snapshot(); }, setMode, apply: applySnapshot };
}

export default { init };
