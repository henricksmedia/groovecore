import { generateGroove } from '../core/groove-generator.js';
import {
  DEFAULT_MACROS,
  GENERATOR_INTENTS,
  MACRO_META,
  MOMENT_PROFILES,
  findIntent
} from '../data/generator-intents.js';

const STORAGE_KEY = 'gc.playground.view';
const MACRO_COLORS = {
  pulse: '#ff6540',
  pocket: '#f3bf4f',
  motion: '#42c8c6',
  tone: '#b77cff',
  space: '#638cff',
  energy: '#8dcc62',
  surprise: '#ec6f9f'
};
let GCRef = null;
let rootEl = null;
let macroApplyTimer = null;
let state = {
  v: 1,
  view: 'playground',
  intentId: GENERATOR_INTENTS[0].id,
  seed: Date.now() >>> 0,
  variant: 0,
  active: false,
  momentId: 'custom',
  macros: { ...DEFAULT_MACROS, ...GENERATOR_INTENTS[0].macros },
  locks: {},
  visualSteps: {}
};

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function toast(message) {
  try {
    window.GCToast?.show(message, { type: 'success', duration: 1800 });
  } catch (e) { /* optional */ }
}

function currentPattern() {
  const bank = GCRef?.patterns?.[GCRef.variation];
  return bank?.[Number(GCRef.currentPattern) || 0] || null;
}

function normalizeState(value) {
  if (!value || typeof value !== 'object') return;
  if (GENERATOR_INTENTS.some((intent) => intent.id === value.intentId)) state.intentId = value.intentId;
  if (value.view === 'sequencer' || value.view === 'playground') state.view = value.view;
  if (Number.isFinite(Number(value.seed))) state.seed = Number(value.seed) >>> 0;
  if (Number.isFinite(Number(value.variant))) state.variant = Math.max(0, Math.round(value.variant));
  if (typeof value.active === 'boolean') state.active = value.active;
  if (value.momentId === 'custom' || MOMENT_PROFILES.some((moment) => moment.id === value.momentId)) {
    state.momentId = value.momentId;
  }
  Object.keys(DEFAULT_MACROS).forEach((key) => {
    const next = Number(value.macros?.[key]);
    if (Number.isFinite(next)) state.macros[key] = Math.max(0, Math.min(10, Math.round(next)));
  });
  if (value.locks && typeof value.locks === 'object') state.locks = { ...value.locks };
  if (value.visualSteps && typeof value.visualSteps === 'object') {
    state.visualSteps = {};
    Object.keys(DEFAULT_MACROS).forEach((key) => {
      if (Array.isArray(value.visualSteps[key])) {
        state.visualSteps[key] = value.visualSteps[key]
          .map(Number)
          .filter((step) => Number.isInteger(step) && step >= 0 && step < 16);
      }
    });
  }
}

function persistView() {
  try { localStorage.setItem(STORAGE_KEY, state.view); } catch (e) { /* private mode */ }
}

function setView(view, options = {}) {
  state.view = view === 'sequencer' ? 'sequencer' : 'playground';
  document.documentElement.dataset.gcView = state.view;
  persistView();
  document.querySelectorAll('.gc-view-button').forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle('gc-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (rootEl) rootEl.hidden = state.view !== 'playground';
  const panel = document.querySelector('.step-sequencer-panel');
  if (panel) {
    panel.setAttribute('aria-hidden', String(state.view === 'playground'));
    if (state.view === 'sequencer' && options.focus) panel.querySelector('button')?.focus();
  }
}

function linePath(points) {
  return `M${points.map(([x, y]) => `${x.toFixed(1)},${Math.max(3, Math.min(47, y)).toFixed(1)}`).join(' L')}`;
}

function pathFor(id, value) {
  const points = [];
  if (id === 'pulse') {
    const decay = 16 + value * 2.4;
    for (let x = 0; x <= 100; x += 1.5) {
      const envelope = Math.exp(-x / decay);
      const phase = x * (.72 - Math.min(x, 90) * .0026);
      points.push([x, 25 - Math.sin(phase) * (18 + value * .35) * envelope]);
    }
  } else if (id === 'pocket') {
    const swing = (value - 5) * .55;
    [6, 25, 44, 63, 82].forEach((origin, i) => {
      const x = origin + (i % 2 ? swing : 0);
      points.push([x - 4, 25], [x - 1.3, 25], [x, 9 + (i % 2) * 6], [x + 1.2, 38], [x + 3, 25]);
    });
  } else if (id === 'motion') {
    const bursts = [12, 31, 50, 69, 88];
    for (let x = 0; x <= 100; x += 1) {
      const envelope = Math.min(1, bursts.reduce((sum, at) => sum + Math.exp(-Math.abs(x - at) / (2.5 + value * .18)), 0));
      const noise = Math.sin(x * 3.7) * .62 + Math.sin(x * 7.9) * .38;
      points.push([x, 25 - noise * envelope * (10 + value * .7)]);
    }
  } else if (id === 'tone') {
    const harmonics = .12 + value * .065;
    for (let x = 0; x <= 100; x += 1.5) {
      const phase = x * .19;
      const wave = Math.sin(phase) + Math.sin(phase * 2) * harmonics + Math.sin(phase * 3) * harmonics * .45;
      points.push([x, 25 - wave * 9]);
    }
  } else if (id === 'space') {
    const repeats = 3 + Math.round(value / 2.5);
    points.push([0, 25], [5, 25], [7, 5], [8.5, 42], [11, 25]);
    for (let i = 1; i <= repeats; i++) {
      const x = 11 + i * (82 / (repeats + 1));
      const amp = (16 + value * .3) * Math.exp(-i / (1.7 + value * .13));
      points.push([x - 2, 25], [x, 25 - amp], [x + 1.2, 25 + amp * .72], [x + 3, 25]);
    }
    points.push([100, 25]);
  } else if (id === 'energy') {
    const pattern = currentPattern()?.part1 || [];
    for (let step = 0; step < 16; step++) {
      const cell = pattern[step] || {};
      const hits = Object.entries(cell).filter(([key, hit]) => key !== 'accent' && !!hit).length;
      const amp = 3 + Math.min(15, hits * 2.3 + (cell.accent ? 6 : 0));
      const x = 3 + step * 6.15;
      points.push([x - 2.2, 25], [x, 25 - amp], [x + 1.3, 25 + amp * .5], [x + 2.5, 25]);
    }
  } else {
    const active = new Set(state.visualSteps?.surprise || []);
    for (let step = 0; step < 16; step++) {
      const x = 3 + step * 6.15;
      const hash = Math.sin((state.seed + step * 9176) * .001) * 43758.5453;
      const random = hash - Math.floor(hash);
      const amp = active.has(step) ? 8 + random * 13 : 1.5 + random * 2;
      points.push([x - 2.4, 25], [x, 25 - amp], [x + 1, 25 + amp * .65], [x + 2.5, 25]);
    }
  }
  return linePath(points);
}

function instrumentsForMacro(id) {
  if (id === 'pulse') return ['bd'];
  if (id === 'pocket') return ['sd', 'cp', 'rim'];
  if (id === 'motion') return ['ch', 'oh', 'ma'];
  if (id === 'tone') return ['cb', 'cl', 'hc', 'mc', 'lc'];
  if (id === 'surprise') return ['lt', 'mt', 'ht', 'cym', 'cr'];
  return [];
}

function renderDots(card, macroId) {
  const instruments = instrumentsForMacro(macroId);
  const pattern = currentPattern();
  const ownedSteps = state.visualSteps?.[macroId];
  const dots = card.querySelectorAll('.gc-pg-dot');
  dots.forEach((dot, step) => {
    const cell = pattern?.part1?.[step] || {};
    const active = Array.isArray(ownedSteps)
      ? ownedSteps.includes(step)
      : macroId === 'energy'
        ? !!cell.accent
        : macroId === 'space'
          ? false
          : instruments.some((instrument) => !!cell[instrument]);
    dot.classList.toggle('gc-active', active);
  });
}

function renderPlayhead(step) {
  if (!rootEl) return;
  const activeStep = Number.isInteger(Number(step)) ? Number(step) % 16 : -1;
  rootEl.querySelectorAll('.gc-pg-dots').forEach((row) => {
    row.querySelectorAll('.gc-pg-dot').forEach((dot, index) => {
      dot.classList.toggle('gc-current', index === activeStep);
    });
  });
}

function renderTransport(playing) {
  const button = rootEl?.querySelector('#gc-pg-listen');
  if (!button) return;
  const isPlaying = typeof playing === 'boolean' ? playing : !!GCRef?.isPlaying;
  button.classList.toggle('gc-active', isPlaying);
  button.querySelector('.material-icons').textContent = isPlaying ? 'stop' : 'play_arrow';
  button.querySelector('.gc-pg-listen-label').textContent = isPlaying ? 'Stop groove' : 'Play groove';
  if (!isPlaying) renderPlayhead(-1);
}

function macroWord(meta, value) {
  if (value <= 3) return meta.low;
  if (value >= 7) return meta.high;
  return 'Balanced';
}

function countVoices(instruments) {
  const pattern = currentPattern();
  return (pattern?.part1 || []).reduce(
    (sum, cell) => sum + instruments.filter((instrument) => !!cell?.[instrument]).length,
    0
  );
}

function macroDetail(id) {
  const pattern = currentPattern();
  const value = state.macros[id];
  if (id === 'pulse') return `${countVoices(['bd'])} kick hits · weight ${value}`;
  if (id === 'pocket') return `swing ${Number(GCRef?.knobValues?.swing || 0).toFixed(1)} · human ${Number(GCRef?.knobValues?.humanize || 0).toFixed(1)}`;
  if (id === 'motion') return `${countVoices(['ch', 'oh', 'ma'])} moving hits · push ${value}`;
  if (id === 'tone') return `${countVoices(['rim', 'cb', 'cl', 'hc', 'mc', 'lc'])} color hits · brightness ${value}`;
  if (id === 'space') return `${state.visualSteps?.space?.length || 0} spaces opened · room ${value}`;
  if (id === 'energy') {
    const accents = (pattern?.part1 || []).filter((cell) => cell?.accent).length;
    return `${Math.round(Number(GCRef?.tempo) || 120)} BPM · ${accents} accents`;
  }
  if (id === 'surprise') return `${countVoices(['lt', 'mt', 'ht', 'cym', 'cr'])} fills · twist ${value}`;
  return '';
}

function render() {
  if (!rootEl) return;
  const intent = findIntent(state.intentId);
  rootEl.style.setProperty('--gc-pg-accent', intent.color);
  rootEl.querySelectorAll('.gc-pg-intent').forEach((button) => {
    const selected = button.dataset.intent === state.intentId;
    button.classList.toggle('gc-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  rootEl.querySelectorAll('.gc-pg-moment').forEach((button) => {
    const selected = button.dataset.moment === state.momentId;
    button.classList.toggle('gc-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const title = rootEl.querySelector('.gc-pg-current-title');
  const copy = rootEl.querySelector('.gc-pg-current-copy');
  if (title) title.textContent = intent.label;
  if (copy) copy.textContent = intent.description;

  rootEl.querySelectorAll('.gc-pg-card').forEach((card, index) => {
    const id = card.dataset.macro;
    const meta = MACRO_META.find((item) => item.id === id);
    const value = state.macros[id];
    const range = card.querySelector('input[type="range"]');
    if (range && document.activeElement !== range) range.value = String(value);
    card.querySelector('.gc-pg-card-state').textContent = macroWord(meta, value);
    card.querySelector('.gc-pg-card-value').textContent = String(value);
    card.querySelector('.gc-pg-card-detail').textContent = macroDetail(id);
    card.querySelector('.gc-pg-signal path').setAttribute('d', pathFor(id, value));
    const lock = card.querySelector('.gc-pg-lock');
    const locked = !!state.locks[id];
    lock.classList.toggle('gc-active', locked);
    lock.setAttribute('aria-pressed', String(locked));
    lock.setAttribute('aria-label', `${locked ? 'Unlock' : 'Lock'} ${meta.label}`);
    lock.querySelector('.material-icons').textContent = locked ? 'lock' : 'lock_open';
    renderDots(card, id);
  });
  const handoffTitle = rootEl.querySelector('.gc-pg-handoff-title');
  const handoffPrompt = rootEl.querySelector('.gc-pg-prompt-preview');
  const moment = MOMENT_PROFILES.find((item) => item.id === state.momentId);
  if (handoffTitle) {
    handoffTitle.textContent = `${intent.label}${moment ? ` · ${moment.label}` : ''}`;
  }
  if (handoffPrompt) {
    const prompt = window.GCAIPrompt?.buildStylePrompt?.(GCRef)?.prompt;
    handoffPrompt.textContent = prompt || 'Create a groove to build your Suno-ready style prompt.';
  }
  renderTransport();
  setView(state.view);
}

async function copySunoPrompt() {
  const prompt = window.GCAIPrompt?.buildStylePrompt?.(GCRef)?.prompt;
  if (!prompt) {
    toast('Create a groove first');
    return;
  }
  try {
    await navigator.clipboard.writeText(prompt);
    toast('Suno prompt copied');
  } catch (e) {
    const textarea = document.createElement('textarea');
    textarea.value = prompt;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    toast('Suno prompt copied');
  }
}

function applyGenerated({ fresh = false, label = null, vary = true, quiet = false } = {}) {
  if (!GCRef) return;
  let previousPattern = currentPattern();
  GCRef.events?.emit('mutate:before', { reason: 'playground', label: 'Create groove' });
  if (fresh) {
    state.seed = (Math.random() * 0xffffffff) >>> 0;
    state.variant = 0;
    state.locks = {};
    previousPattern = null;
  } else if (vary) {
    state.variant += 1;
  }
  const result = generateGroove({
    intentId: state.intentId,
    macros: state.macros,
    locks: state.locks,
    seed: state.seed,
    variant: state.variant,
    previousPattern,
    previousVisualSteps: state.visualSteps
  });
  state.active = true;
  state.visualSteps = clone(result.visualSteps || {});
  GCRef.patterns[GCRef.variation][GCRef.currentPattern] = result.pattern;
  GCRef.currentPresetSelection = null;
  GCRef.setBpm?.(result.bpm);
  Object.entries(result.knobPatches).forEach(([id, value]) => {
    GCRef.knobValues[id] = value;
    window.GCKnobs?.set(id, value, { silent: true });
  });
  Object.entries(result.voicePatches || {}).forEach(([instrument, params]) => {
    const bucket = GCRef.modalKnobValues[instrument] || (GCRef.modalKnobValues[instrument] = {});
    Object.entries(params).forEach(([param, value]) => {
      const modalKey = param === 'tone' ? 'modalFilter' : param === 'sendRev' ? 'modalReverb' : 'modalDelay';
      bucket[modalKey] = value;
      window.GrooveAudio?.setParam?.(instrument, param, value);
    });
  });
  GCRef.fns?.updateStepDisplay?.();
  GCRef.fns?.updateAllKnobVisuals?.();
  GCRef.events?.emit('preset:changed', null);
  const summary = rootEl?.querySelector('.gc-pg-result');
  const moment = MOMENT_PROFILES.find((item) => item.id === state.momentId);
  if (summary) {
    const momentText = moment ? `${moment.label} · ` : '';
    summary.textContent = `${momentText}${result.bpm} BPM · ${result.meta.description}`;
  }
  render();
  if (!quiet) toast(label || (fresh ? 'New direction created' : `Variation ${state.variant + 1} created`));
}

function applyMoment(momentId) {
  const moment = MOMENT_PROFILES.find((item) => item.id === momentId);
  if (!moment) return;
  GCRef.events?.emit('mutate:before', { reason: 'playground-moment', label: moment.label });
  state.momentId = moment.id;
  Object.entries(moment.macros).forEach(([key, value]) => {
    if (!state.locks[key]) state.macros[key] = value;
  });
  applyGenerated({ label: `${moment.label} shape created`, vary: false });
}

function applyMacroCard(card, quiet = false) {
  if (!card) return;
  applyGenerated({ vary: false, quiet, label: `${card.querySelector('h3').textContent} updated` });
}

function buildViewSwitch(main) {
  if (document.getElementById('gc-view-switch')) return;
  const nav = document.createElement('div');
  nav.id = 'gc-view-switch';
  nav.className = 'gc-view-switch';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Creation view');
  nav.innerHTML = `
    <button type="button" class="gc-view-button" data-view="playground" role="tab">
      <span class="material-icons" aria-hidden="true">auto_awesome</span>
      Playground
    </button>
    <button type="button" class="gc-view-button" data-view="sequencer" role="tab">
      <span class="material-icons" aria-hidden="true">grid_on</span>
      Sequencer
    </button>`;
  nav.addEventListener('click', (event) => {
    const button = event.target.closest('.gc-view-button');
    if (!button) return;
    setView(button.dataset.view, { focus: true });
  });
  main.insertBefore(nav, main.firstChild);
}

function macroCard(meta, index) {
  const dots = Array.from({ length: 16 }, () => '<i class="gc-pg-dot"></i>').join('');
  return `
    <article class="gc-pg-card" data-macro="${meta.id}" style="--gc-macro-color:${MACRO_COLORS[meta.id]}">
      <header>
        <div>
          <span class="gc-pg-card-kicker">SHAPE ${String(index + 1).padStart(2, '0')}</span>
          <h3>${meta.label}</h3>
        </div>
        <button type="button" class="gc-pg-lock" aria-pressed="false">
          <span class="material-icons" aria-hidden="true">lock_open</span>
        </button>
      </header>
      <svg class="gc-pg-signal" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
        <path d=""></path>
      </svg>
      <div class="gc-pg-card-readout">
        <strong class="gc-pg-card-state">${meta.low}</strong>
        <output class="gc-pg-card-value">5</output>
      </div>
      <small class="gc-pg-card-detail"></small>
      <input type="range" min="0" max="10" step="1" value="5" aria-label="${meta.label}">
      <div class="gc-pg-dots" aria-hidden="true">${dots}</div>
    </article>`;
}

function buildPlayground(main) {
  rootEl = document.createElement('section');
  rootEl.id = 'gc-playground';
  rootEl.className = 'gc-playground';
  rootEl.setAttribute('aria-label', 'Groove Playground');
  rootEl.innerHTML = `
    <header class="gc-pg-hero">
      <div>
        <span class="gc-pg-overline">GUIDED CREATION</span>
        <h2>Start with a feeling. <em>Shape the groove.</em></h2>
        <p>No theory required. Pick a direction, move the musical controls, then create variations until it feels right.</p>
      </div>
      <div class="gc-pg-now">
        <span>NOW SHAPING</span>
        <strong class="gc-pg-current-title"></strong>
        <small class="gc-pg-current-copy"></small>
      </div>
    </header>
    <div class="gc-pg-section-head">
      <span><b>01</b> Choose a direction</span>
      <small>Start broad. Each choice builds a complete playable foundation.</small>
    </div>
    <div class="gc-pg-intents" role="group" aria-label="Musical direction">
      ${GENERATOR_INTENTS.map((intent) => `
        <button type="button" class="gc-pg-intent" data-intent="${intent.id}" style="--intent:${intent.color}">
          <span>${intent.eyebrow}</span>
          <strong>${intent.label}</strong>
          <small>${intent.bpm} BPM</small>
        </button>`).join('')}
    </div>
    <section class="gc-pg-moments" aria-labelledby="gc-pg-moments-title">
      <div class="gc-pg-moments-copy">
        <span class="gc-pg-overline"><b>02</b> SHAPE THE MOMENT</span>
        <strong id="gc-pg-moments-title">Where are we in the song?</strong>
        <small>One move coordinates all seven controls. Locked cards stay put.</small>
      </div>
      <div class="gc-pg-moment-buttons" role="group" aria-label="Song moment">
        ${MOMENT_PROFILES.map((moment) => `
          <button type="button" class="gc-pg-moment" data-moment="${moment.id}" aria-pressed="false">
            <span class="material-icons" aria-hidden="true">${moment.icon}</span>
            <span><strong>${moment.label}</strong><small>${moment.cue}</small></span>
          </button>`).join('')}
      </div>
    </section>
    <div class="gc-pg-section-head gc-pg-section-head--shape">
      <span><b>03</b> Shape the feel</span>
      <small>Move one musical idea at a time. Lock anything you want the next variation to preserve.</small>
    </div>
    <div class="gc-pg-grid">
      <aside class="gc-pg-create-card">
        <span class="gc-pg-overline">MAKE IT YOURS</span>
        <h3>Keep what works.<br>Change what doesn’t.</h3>
        <p>Lock any card to preserve that part while GrooveCore creates the next variation.</p>
        <div class="gc-pg-actions">
          <button type="button" id="gc-pg-create" class="gc-pg-primary">
            <span class="material-icons" aria-hidden="true">auto_awesome</span>
            Create variation
          </button>
          <button type="button" id="gc-pg-fresh" class="gc-pg-secondary">Start fresh</button>
        </div>
        <button type="button" id="gc-pg-listen" class="gc-pg-listen">
          <span class="material-icons" aria-hidden="true">play_arrow</span>
          <span class="gc-pg-listen-label">Play groove</span>
        </button>
        <div class="gc-pg-result" aria-live="polite">Choose a direction, then create your first groove.</div>
      </aside>
      ${MACRO_META.map(macroCard).join('')}
    </div>
    <section class="gc-pg-handoff" aria-labelledby="gc-pg-handoff-title">
      <div class="gc-pg-handoff-copy">
        <span class="gc-pg-overline">READY FOR SUNO</span>
        <strong id="gc-pg-handoff-title" class="gc-pg-handoff-title"></strong>
        <p class="gc-pg-prompt-preview"></p>
      </div>
      <div class="gc-pg-handoff-actions">
        <button type="button" id="gc-pg-copy-prompt" class="gc-pg-primary">
          <span class="material-icons" aria-hidden="true">content_copy</span>
          Copy Suno prompt
        </button>
        <button type="button" id="gc-pg-open-sequencer" class="gc-pg-secondary">
          Fine-tune steps
        </button>
      </div>
    </section>`;
  const sequencer = main.querySelector('.step-sequencer-panel');
  main.insertBefore(rootEl, sequencer || null);

  rootEl.addEventListener('click', (event) => {
    const intentButton = event.target.closest('.gc-pg-intent');
    if (intentButton) {
      GCRef.events?.emit('mutate:before', { reason: 'playground-intent' });
      state.intentId = intentButton.dataset.intent;
      state.macros = { ...DEFAULT_MACROS, ...findIntent(state.intentId).macros };
      state.momentId = 'custom';
      applyGenerated({ fresh: true });
      return;
    }
    const lockButton = event.target.closest('.gc-pg-lock');
    if (lockButton) {
      const id = lockButton.closest('.gc-pg-card').dataset.macro;
      GCRef.events?.emit('mutate:before', { reason: 'playground-lock' });
      state.locks[id] = !state.locks[id];
      lockButton.querySelector('.material-icons').textContent = state.locks[id] ? 'lock' : 'lock_open';
      render();
      return;
    }
    const momentButton = event.target.closest('.gc-pg-moment');
    if (momentButton) {
      applyMoment(momentButton.dataset.moment);
      return;
    }
    if (event.target.closest('#gc-pg-create')) applyGenerated();
    if (event.target.closest('#gc-pg-fresh')) applyGenerated({ fresh: true });
    if (event.target.closest('#gc-pg-listen')) document.getElementById('playButton')?.click();
    if (event.target.closest('#gc-pg-copy-prompt')) copySunoPrompt();
    if (event.target.closest('#gc-pg-open-sequencer')) setView('sequencer', { focus: true });
  });

  rootEl.addEventListener('input', (event) => {
    const range = event.target.closest('.gc-pg-card input[type="range"]');
    if (!range) return;
    const card = range.closest('.gc-pg-card');
    const id = card.dataset.macro;
    GCRef.events?.emit('mutate:before', { reason: 'playground-macro' });
    state.macros[id] = Number(range.value);
    state.locks[id] = false;
    state.momentId = 'custom';
    render();
    if (macroApplyTimer) clearTimeout(macroApplyTimer);
    macroApplyTimer = setTimeout(() => {
      macroApplyTimer = null;
      applyMacroCard(card, true);
    }, 90);
  });
  rootEl.addEventListener('change', (event) => {
    if (event.target.matches('.gc-pg-card input[type="range"]')) {
      if (macroApplyTimer) {
        clearTimeout(macroApplyTimer);
        macroApplyTimer = null;
      }
      applyMacroCard(event.target.closest('.gc-pg-card'));
    }
  });
}

function registerState() {
  const schema = window.GCSchema;
  if (!schema?.registerSection) return;
  schema.registerSection(
    'playground',
    () => clone(state),
    (value) => {
      normalizeState(value);
      render();
    }
  );
}

export function init(GC) {
  if (typeof document === 'undefined' || document.getElementById('gc-playground')) return;
  GCRef = GC || window.GC;
  const main = document.querySelector('main.main-content');
  if (!main || !GCRef) return;
  try {
    const savedView = localStorage.getItem(STORAGE_KEY);
    if (savedView === 'sequencer' || savedView === 'playground') state.view = savedView;
  } catch (e) { /* private mode */ }
  buildViewSwitch(main);
  buildPlayground(main);
  registerState();
  GCRef.events?.on('preset:loaded', () => {
    state.active = false;
    render();
  });
  GCRef.events?.on('gc:change', () => render());
  GCRef.events?.on('step', (step) => renderPlayhead(step));
  GCRef.events?.on('play', () => renderTransport(true));
  GCRef.events?.on('stop', () => renderTransport(false));
  GCRef.events?.on('ai-prompt:ready', () => render());
  render();
  window.GCPlayground = {
    generate: (options) => applyGenerated(options),
    setView,
    getState: () => clone(state)
  };
}
