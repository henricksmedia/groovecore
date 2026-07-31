// =============================================================================
// GrooveCore runtime accessibility layer (WS-H)
// ES module. init(GC) is called by js/main.js after app.js has initialized.
// Adds ARIA + keyboard support to the existing DOM without editing index.html.
// Fails soft: every section feature-detects its DOM and GC.
// =============================================================================

// Decree labels (identity decree v3) — code -> spoken name.
const INSTRUMENT_NAMES = {
  bd: 'Bass Drum',
  sd: 'Snare Drum',
  lt: 'Low Tom',
  mt: 'Mid Tom',
  ht: 'High Tom',
  rim: 'Rimshot',
  cp: 'Clap',
  hc: 'High Conga',
  mc: 'Mid Conga',
  lc: 'Low Conga',
  cb: 'Cowbell',
  cl: 'Claves',
  ma: 'Maracas',
  ch: 'Closed Hi-Hat',
  oh: 'Open Hi-Hat',
  cym: 'Cymbal',
  cr: 'Crash Cymbal',
  accent: 'Accent'
};

function instName(code) {
  return INSTRUMENT_NAMES[code] || (code ? code.toUpperCase() : 'Instrument');
}

let announcerEl = null;
let announceTimer = 0;

function announce(msg) {
  if (!announcerEl || !msg) return;
  // Clear-then-set so repeated identical messages are re-announced.
  clearTimeout(announceTimer);
  announcerEl.textContent = '';
  announceTimer = setTimeout(() => { announcerEl.textContent = msg; }, 40);
}

// ---------------------------------------------------------------------------
// Step grid: role=button, labels, aria-pressed sync, roving tabindex.
// ---------------------------------------------------------------------------

function labelForStep(btn) {
  const inst = btn.dataset.instrument;
  const step = btn.dataset.step;
  return `${instName(inst)}, step ${step}`;
}

function syncStepAria(btn) {
  btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
  if (btn.classList.contains('disabled')) {
    btn.setAttribute('aria-disabled', 'true');
  } else {
    btn.removeAttribute('aria-disabled');
  }
}

function initStepGrid() {
  const panel = document.querySelector('.step-sequencer-panel');
  if (!panel) return;

  const rows = Array.from(panel.querySelectorAll('.instrument-row'))
    .map(row => Array.from(row.querySelectorAll('.step-button')))
    .filter(cells => cells.length > 0);
  if (!rows.length) return;

  rows.forEach((cells, r) => {
    cells.forEach((btn, c) => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', labelForStep(btn));
      btn.setAttribute('tabindex', (r === 0 && c === 0) ? '0' : '-1');
      syncStepAria(btn);
    });
  });

  // aria-pressed follows the 'active' class, whoever toggles it.
  const gridObserver = new MutationObserver(muts => {
    for (const m of muts) {
      const t = m.target;
      if (t.nodeType === 1 && t.classList && t.classList.contains('step-button')) {
        syncStepAria(t);
      }
    }
  });
  gridObserver.observe(panel, { attributes: true, attributeFilter: ['class'], subtree: true });

  function position(btn) {
    for (let r = 0; r < rows.length; r++) {
      const c = rows[r].indexOf(btn);
      if (c !== -1) return { r, c };
    }
    return null;
  }

  function moveFocus(from, to) {
    if (!to || to === from) return;
    from.setAttribute('tabindex', '-1');
    to.setAttribute('tabindex', '0');
    to.focus();
  }

  panel.addEventListener('keydown', (e) => {
    const btn = e.target;
    if (!(btn instanceof HTMLElement) || !btn.classList.contains('step-button')) return;
    const pos = position(btn);
    if (!pos) return;
    const { r, c } = pos;
    const row = rows[r];
    let target = null;

    switch (e.key) {
      case 'ArrowRight': target = row[Math.min(c + 1, row.length - 1)]; break;
      case 'ArrowLeft':  target = row[Math.max(c - 1, 0)]; break;
      case 'ArrowDown': {
        const nr = Math.min(r + 1, rows.length - 1);
        target = rows[nr][Math.min(c, rows[nr].length - 1)];
        break;
      }
      case 'ArrowUp': {
        const nr = Math.max(r - 1, 0);
        target = rows[nr][Math.min(c, rows[nr].length - 1)];
        break;
      }
      case 'Home': target = row[0]; break;
      case 'End':  target = row[row.length - 1]; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.stopPropagation(); // don't let a global Space-to-play handler fire too
        btn.click();
        announce(`${labelForStep(btn)} ${btn.classList.contains('active') ? 'on' : 'off'}`);
        return;
      default: return;
    }

    e.preventDefault();
    moveFocus(btn, target);
  });
}

// ---------------------------------------------------------------------------
// Knobs and sliders: role=slider + value sync.
// ---------------------------------------------------------------------------

function knobLabel(el) {
  const container = el.closest('.knob-container, .control-group');
  if (container) {
    const lbl = container.querySelector('.knob-label, .control-label');
    if (lbl && lbl.textContent.trim()) {
      const inst = el.dataset.instrument || el.closest('[data-instrument]')?.dataset?.instrument;
      const base = lbl.textContent.trim();
      return inst ? `${instName(inst)} ${base}` : base;
    }
  }
  return el.id || 'Control';
}

function sliderValue(el) {
  // Knobs carry data-value 0-10 (tempo carries BPM but the knob engine
  // re-syncs aria-valuenow itself); sliders carry --slider-width %.
  if (el.dataset.value !== undefined) {
    const v = parseFloat(el.dataset.value);
    return isNaN(v) ? 0 : v;
  }
  const w = parseFloat((el.style.getPropertyValue('--slider-width') || '0'));
  return isNaN(w) ? 0 : Math.round(w) / 10;
}

function initKnobsAndSliders() {
  const controls = document.querySelectorAll('.knob, .volume-slider, .shuffle-slider');
  if (!controls.length) return;

  controls.forEach(el => {
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '10');
    el.setAttribute('aria-valuenow', String(sliderValue(el)));
    el.setAttribute('aria-label', knobLabel(el));
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  });

  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      const el = m.target;
      if (el.nodeType === 1) el.setAttribute('aria-valuenow', String(sliderValue(el)));
    }
  });
  controls.forEach(el => obs.observe(el, { attributes: true, attributeFilter: ['data-value', 'style'] }));
}

// ---------------------------------------------------------------------------
// Toggle buttons: mute / solo / variation / tab buttons -> aria-pressed.
// ---------------------------------------------------------------------------

function toggleName(btn) {
  if (btn.classList.contains('mute-btn')) return `Mute ${instName(btn.dataset.instrument)}`;
  if (btn.classList.contains('solo-btn')) return `Solo ${instName(btn.dataset.instrument)}`;
  if (btn.classList.contains('variation-btn')) return `Pattern ${btn.dataset.variation || btn.textContent.trim()}`;
  if (btn.classList.contains('tab-btn')) return `${btn.textContent.trim()} tab`;
  return btn.textContent.trim() || 'Toggle';
}

function initToggles() {
  const toggles = document.querySelectorAll('.mute-btn, .solo-btn, .variation-btn, .tab-btn');
  if (!toggles.length) return;

  const sync = btn => btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

  toggles.forEach(btn => {
    btn.setAttribute('aria-label', toggleName(btn));
    sync(btn);
  });

  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.target.nodeType === 1) sync(m.target);
    }
  });
  toggles.forEach(btn => obs.observe(btn, { attributes: true, attributeFilter: ['class'] }));
}

// ---------------------------------------------------------------------------
// Decorative icons.
// ---------------------------------------------------------------------------

function hideIcons() {
  document.querySelectorAll('.material-icons, .material-symbols-outlined').forEach(el => {
    el.setAttribute('aria-hidden', 'true');
  });
}

// ---------------------------------------------------------------------------
// Live region announcer.
// ---------------------------------------------------------------------------

function initAnnouncer(GC) {
  announcerEl = document.getElementById('gc-announcer');
  if (!announcerEl) {
    announcerEl = document.createElement('div');
    announcerEl.id = 'gc-announcer';
    announcerEl.setAttribute('role', 'status');
    announcerEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(announcerEl);
  }

  if (GC && GC.events && typeof GC.events.on === 'function') {
    GC.events.on('play', () => announce('Playing'));
    GC.events.on('stop', () => announce('Stopped'));
    GC.events.on('preset:loaded', d => {
      announce(`Loaded ${d && d.label ? d.label : 'preset'}`);
    });
  }
}

// ---------------------------------------------------------------------------
// Modal focus traps for #instrumentModal and #helpModal.
// ---------------------------------------------------------------------------

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapModal(modal, isOpenFn) {
  let lastFocused = null;
  let wasOpen = isOpenFn();

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  function onKeydown(e) {
    if (e.key !== 'Tab' || !isOpenFn()) return;
    const focusables = Array.from(modal.querySelectorAll(FOCUSABLE))
      .filter(el => el.offsetParent !== null || el === document.activeElement);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
      e.preventDefault();
      first.focus();
    }
  }

  modal.addEventListener('keydown', onKeydown);

  const obs = new MutationObserver(() => {
    const open = isOpenFn();
    if (open === wasOpen) return;
    wasOpen = open;
    if (open) {
      lastFocused = document.activeElement;
      const target = modal.querySelector(FOCUSABLE);
      if (target) setTimeout(() => target.focus(), 30);
    } else if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
      lastFocused.focus();
      lastFocused = null;
    }
  });
  obs.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
}

function initModalTraps() {
  const inst = document.getElementById('instrumentModal');
  if (inst) trapModal(inst, () => !inst.classList.contains('hidden'));

  const help = document.getElementById('helpModal');
  if (help) trapModal(help, () => help.classList.contains('show'));
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  if (typeof document === 'undefined') return;
  try { initAnnouncer(GC); } catch (e) { console.warn('[a11y] announcer', e); }
  try { initStepGrid(); } catch (e) { console.warn('[a11y] grid', e); }
  try { initKnobsAndSliders(); } catch (e) { console.warn('[a11y] sliders', e); }
  try { initToggles(); } catch (e) { console.warn('[a11y] toggles', e); }
  try { hideIcons(); } catch (e) { console.warn('[a11y] icons', e); }
  try { initModalTraps(); } catch (e) { console.warn('[a11y] traps', e); }

  // Public surface for other gc modules (preset browser announces loads).
  window.GCA11y = { announce, instName };
}
