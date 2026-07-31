// =============================================================================
// GrooveCore preset browser (WS-H)
// ES module. Searchable browser over all 58 style presets + 113 inspiration
// grooves. Injects a BROWSE button into .quick-actions (the two native selects
// are hidden by css/preset-browser.css but stay in the DOM and keep working).
// Fails soft: needs window.GC (or the legacy global loaders) to load anything.
// =============================================================================

import { PRESET_META, GENRES, findMeta } from '../data/preset-meta.js';

const FAVS_KEY = 'gc.favs.v1';
const RECENT_KEY = 'gc.recent.v1';
const RECENT_MAX = 8;

let GCref = null;
let panelEl = null;
let listEl = null;
let searchEl = null;
let openerBtn = null;
let activeChipEl = null;
let lastFocused = null;

let state = {
  open: false,
  tab: 'styles',          // 'styles' | 'grooves'
  query: '',
  genre: null,            // null = all
  activeIndex: 0,
  visible: []             // currently rendered meta entries
};

// ---------------------------------------------------------------------------
// Storage helpers (never throw — private mode etc.)
// ---------------------------------------------------------------------------

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : fallback;
  } catch (e) { return fallback; }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* quota/private */ }
}

function idOf(m) { return `${m.kind}:${m.key}`; }

function getFavs() { return readJson(FAVS_KEY, []); }

function toggleFav(m) {
  const favs = getFavs();
  const id = idOf(m);
  const i = favs.indexOf(id);
  if (i === -1) favs.unshift(id); else favs.splice(i, 1);
  writeJson(FAVS_KEY, favs);
  return i === -1;
}

function pushRecent(m) {
  const id = idOf(m);
  const rec = readJson(RECENT_KEY, []).filter(x => x !== id);
  rec.unshift(id);
  writeJson(RECENT_KEY, rec.slice(0, RECENT_MAX));
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

function loaderFor(m) {
  const fns = (GCref && GCref.fns) || {};
  if (m.kind === 'style') {
    return fns.loadStylePreset || (typeof window.loadStylePreset === 'function' ? window.loadStylePreset : null);
  }
  return fns.loadInspirationSequence || (typeof window.loadInspirationSequence === 'function' ? window.loadInspirationSequence : null);
}

function toast(msg, withUndo) {
  if (window.GCToast && typeof window.GCToast.show === 'function') {
    const opts = { type: 'info' };
    if (withUndo && GCref && GCref.events) {
      opts.action = { label: 'Undo', onClick: () => GCref.events.emit('undo') };
    }
    window.GCToast.show(msg, opts);
  }
}

function loadEntry(m) {
  const load = loaderFor(m);
  if (!load) {
    toast('Preset loading is unavailable right now', false);
    return;
  }
  if (GCref && GCref.events && typeof GCref.events.emit === 'function') {
    GCref.events.emit('mutate:before', { reason: 'preset', label: m.label });
  }
  try {
    load(m.key);
  } catch (e) {
    console.warn('[preset-browser] load failed', m.key, e);
    toast(`Could not load ${m.label}`, false);
    return;
  }
  pushRecent(m);
  if (GCref && GCref.events && typeof GCref.events.emit === 'function') {
    GCref.events.emit('preset:loaded', { kind: m.kind, key: m.key, label: m.label });
  }
  if (window.GCA11y && typeof window.GCA11y.announce === 'function') {
    window.GCA11y.announce(`Loaded ${m.label}, ${m.bpm} BPM`);
  }
  toast(`Loaded ${m.emoji} ${m.label} — ${m.bpm} BPM`, true);
  close();
}

function surpriseMe() {
  const pool = state.tab === 'grooves'
    ? PRESET_META.filter(m => m.kind === 'groove')
    : PRESET_META.filter(m => m.kind === 'style');
  const pick = pool[Math.floor(Math.random() * pool.length)];
  if (pick) loadEntry(pick);
}

// ---------------------------------------------------------------------------
// Filtering + rendering
// ---------------------------------------------------------------------------

function filtered() {
  const kind = state.tab === 'grooves' ? 'groove' : 'style';
  const q = state.query.trim().toLowerCase();
  const favs = getFavs();
  const recents = readJson(RECENT_KEY, []);

  let list = PRESET_META.filter(m => m.kind === kind);
  if (state.genre) list = list.filter(m => m.genre === state.genre);
  if (q) {
    list = list.filter(m =>
      m.label.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.key.toLowerCase().includes(q) ||
      String(m.bpm).includes(q));
  }

  // Favorites first, then recents, then manifest order.
  const rank = m => {
    const id = idOf(m);
    if (favs.includes(id)) return 0;
    const ri = recents.indexOf(id);
    if (ri !== -1) return 1 + ri / 100;
    return 2;
  };
  return list.slice().sort((a, b) => rank(a) - rank(b));
}

function genresForTab() {
  const kind = state.tab === 'grooves' ? 'groove' : 'style';
  const present = new Set(PRESET_META.filter(m => m.kind === kind).map(m => m.genre));
  return GENRES.filter(g => present.has(g));
}

function optionId(i) { return `gc-pb-opt-${i}`; }

function renderList() {
  if (!listEl) return;
  state.visible = filtered();
  if (state.activeIndex >= state.visible.length) state.activeIndex = 0;
  const favs = getFavs();

  if (!state.visible.length) {
    listEl.innerHTML = '<div class="gc-pb-empty">No matches. Try another search or genre.</div>';
    listEl.removeAttribute('aria-activedescendant');
    return;
  }

  listEl.innerHTML = state.visible.map((m, i) => {
    const fav = favs.includes(idOf(m));
    const active = i === state.activeIndex;
    return `
      <div class="gc-pb-item${active ? ' gc-active' : ''}" role="option" id="${optionId(i)}"
           aria-selected="${active}" data-index="${i}">
        <span class="gc-pb-emoji" aria-hidden="true">${m.emoji}</span>
        <span class="gc-pb-label">${m.label}</span>
        <span class="gc-pb-genre">${m.genre}</span>
        <span class="gc-pb-bpm">${m.bpm} BPM</span>
        <button class="gc-pb-fav${fav ? ' gc-faved' : ''}" type="button" data-fav="${i}"
                aria-label="${fav ? 'Remove from' : 'Add to'} favorites: ${m.label}"
                aria-pressed="${fav}">${fav ? '★' : '☆'}</button>
      </div>`;
  }).join('');
  listEl.setAttribute('aria-activedescendant', optionId(state.activeIndex));
}

function renderChips() {
  const chipsEl = panelEl.querySelector('.gc-pb-chips');
  if (!chipsEl) return;
  const genres = genresForTab();
  chipsEl.innerHTML = ['<button type="button" class="gc-pb-chip' + (state.genre === null ? ' gc-active' : '') + '" data-genre="">All</button>']
    .concat(genres.map(g =>
      `<button type="button" class="gc-pb-chip${state.genre === g ? ' gc-active' : ''}" data-genre="${g}">${g}</button>`))
    .join('');
}

function renderTabs() {
  panelEl.querySelectorAll('.gc-pb-tab').forEach(t => {
    const selected = t.dataset.tab === state.tab;
    t.classList.toggle('gc-active', selected);
    t.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

function refresh() {
  renderTabs();
  renderChips();
  renderList();
}

function setActive(i, scroll) {
  if (!state.visible.length) return;
  state.activeIndex = Math.max(0, Math.min(i, state.visible.length - 1));
  listEl.querySelectorAll('.gc-pb-item').forEach(el => {
    const on = Number(el.dataset.index) === state.activeIndex;
    el.classList.toggle('gc-active', on);
    el.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  listEl.setAttribute('aria-activedescendant', optionId(state.activeIndex));
  if (scroll) {
    const el = listEl.querySelector(`[data-index="${state.activeIndex}"]`);
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }
}

// ---------------------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------------------

function open() {
  if (!panelEl || state.open) return;
  state.open = true;
  lastFocused = document.activeElement;
  panelEl.classList.add('gc-open');
  panelEl.setAttribute('aria-hidden', 'false');
  refresh();
  if (searchEl) {
    searchEl.value = state.query;
    setTimeout(() => searchEl.focus(), 30);
  }
}

function close() {
  if (!panelEl || !state.open) return;
  state.open = false;
  panelEl.classList.remove('gc-open');
  panelEl.setAttribute('aria-hidden', 'true');
  if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
    lastFocused.focus();
  }
  lastFocused = null;
}

// ---------------------------------------------------------------------------
// DOM construction
// ---------------------------------------------------------------------------

function buildPanel() {
  panelEl = document.createElement('div');
  panelEl.id = 'gc-preset-browser';
  panelEl.setAttribute('aria-hidden', 'true');
  panelEl.innerHTML = `
    <div class="gc-pb-backdrop"></div>
    <div class="gc-pb-panel" role="dialog" aria-modal="true" aria-label="Preset browser">
      <div class="gc-pb-head">
        <input class="gc-pb-search" type="search" placeholder="Search presets…  (press /)"
               aria-label="Search presets" autocomplete="off" spellcheck="false">
        <button class="gc-pb-surprise" type="button" title="Load a random preset">🎲 Surprise me</button>
        <button class="gc-pb-close" type="button" aria-label="Close preset browser">✕</button>
      </div>
      <div class="gc-pb-tabs" role="tablist" aria-label="Preset type">
        <button class="gc-pb-tab gc-active" type="button" role="tab" data-tab="styles" aria-selected="true">Styles</button>
        <button class="gc-pb-tab" type="button" role="tab" data-tab="grooves" aria-selected="false">Grooves</button>
      </div>
      <div class="gc-pb-chips" role="group" aria-label="Filter by genre"></div>
      <div class="gc-pb-list" role="listbox" aria-label="Presets" tabindex="0"></div>
      <div class="gc-pb-foot">★ favorites float to the top · Enter loads · Esc closes</div>
    </div>`;
  document.body.appendChild(panelEl);

  listEl = panelEl.querySelector('.gc-pb-list');
  searchEl = panelEl.querySelector('.gc-pb-search');

  panelEl.querySelector('.gc-pb-backdrop').addEventListener('click', close);
  panelEl.querySelector('.gc-pb-close').addEventListener('click', close);
  panelEl.querySelector('.gc-pb-surprise').addEventListener('click', surpriseMe);

  panelEl.querySelector('.gc-pb-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.gc-pb-tab');
    if (!tab) return;
    state.tab = tab.dataset.tab;
    state.genre = null;
    state.activeIndex = 0;
    refresh();
  });

  panelEl.querySelector('.gc-pb-chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.gc-pb-chip');
    if (!chip) return;
    state.genre = chip.dataset.genre || null;
    state.activeIndex = 0;
    refresh();
  });

  searchEl.addEventListener('input', () => {
    state.query = searchEl.value;
    state.activeIndex = 0;
    renderList();
  });

  listEl.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      e.stopPropagation();
      const m = state.visible[Number(favBtn.dataset.fav)];
      if (m) { toggleFav(m); renderList(); }
      return;
    }
    const item = e.target.closest('.gc-pb-item');
    if (item) {
      const m = state.visible[Number(item.dataset.index)];
      if (m) loadEntry(m);
    }
  });

  listEl.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.gc-pb-item');
    if (item) {
      const i = Number(item.dataset.index);
      if (i !== state.activeIndex) setActive(i, false);
    }
  });

  // Keyboard: arrows navigate the listbox from anywhere in the panel.
  panelEl.addEventListener('keydown', (e) => {
    if (!state.open) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === '/' && document.activeElement !== searchEl) {
      e.preventDefault();
      searchEl.focus();
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(state.activeIndex + 1, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(state.activeIndex - 1, true); }
    else if (e.key === 'Home' && document.activeElement === listEl) { e.preventDefault(); setActive(0, true); }
    else if (e.key === 'End' && document.activeElement === listEl) { e.preventDefault(); setActive(state.visible.length - 1, true); }
    else if (e.key === 'Enter') {
      const m = state.visible[state.activeIndex];
      if (m && document.activeElement !== searchEl) { e.preventDefault(); loadEntry(m); }
      else if (m && document.activeElement === searchEl) { e.preventDefault(); loadEntry(m); }
    } else if (e.key === 'Tab') {
      // simple trap within the panel
      const focusables = Array.from(panelEl.querySelectorAll('button, input, [tabindex="0"]'))
        .filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function refreshActivePresetChip() {
  if (!activeChipEl) return;
  const sel = (GCref && GCref.currentPresetSelection) || null;
  const meta = (sel && sel.kind && sel.key) ? findMeta(sel.kind, sel.key) : null;
  if (!meta) {
    activeChipEl.hidden = true;
    activeChipEl.removeAttribute('data-kind');
    activeChipEl.removeAttribute('data-key');
    activeChipEl.innerHTML = '';
    activeChipEl.title = '';
    return;
  }
  activeChipEl.hidden = false;
  activeChipEl.dataset.kind = meta.kind;
  activeChipEl.dataset.key = meta.key;
  activeChipEl.title = `${meta.label} · ${meta.genre} · ${meta.bpm} BPM — click to browse`;
  activeChipEl.innerHTML =
    `<span class="gc-active-preset-emoji" aria-hidden="true">${meta.emoji || ''}</span>` +
    `<span class="gc-active-preset-label">${meta.label}</span>` +
    `<span class="gc-active-preset-genre">${meta.genre}</span>`;
}

function buildOpener() {
  const host = document.querySelector('.quick-actions');
  if (!host) return;
  openerBtn = document.createElement('button');
  openerBtn.id = 'gc-browse-btn';
  openerBtn.type = 'button';
  openerBtn.setAttribute('aria-haspopup', 'dialog');
  const total = PRESET_META.length;
  openerBtn.innerHTML = `<span aria-hidden="true">🎛️</span> BROWSE <span class="gc-browse-count">${total}</span>`;
  openerBtn.title = 'Browse all styles and grooves (B)';
  openerBtn.addEventListener('click', () => (state.open ? close() : open()));
  host.insertBefore(openerBtn, host.firstChild);

  // Compact “now playing” chip — sits in the unused gap beside BROWSE, hidden until a preset loads
  activeChipEl = document.createElement('button');
  activeChipEl.id = 'gc-active-preset';
  activeChipEl.type = 'button';
  activeChipEl.hidden = true;
  activeChipEl.setAttribute('aria-live', 'polite');
  activeChipEl.addEventListener('click', () => {
    if (!state.open) open();
  });
  host.insertBefore(activeChipEl, openerBtn.nextSibling);
  refreshActivePresetChip();
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  if (typeof document === 'undefined') return;
  if (document.getElementById('gc-preset-browser')) return; // idempotent
  GCref = GC || window.GC || null;

  buildPanel();
  buildOpener();

  // Marker class lets the CSS hide the two native selects only once the
  // browser is actually available.
  document.documentElement.classList.add('gc-has-preset-browser');

  if (GCref && GCref.events && typeof GCref.events.on === 'function') {
    GCref.events.on('browser:toggle', () => (state.open ? close() : open()));
    GCref.events.on('preset:changed', () => refreshActivePresetChip());
    GCref.events.on('preset:loaded', () => refreshActivePresetChip());
  }
  refreshActivePresetChip();
}
