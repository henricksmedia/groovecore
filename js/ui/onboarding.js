// =============================================================================
// GrooveCore first-visit onboarding (WS-H)
// ES module. On a truly cold first visit (no gc.seen flag, no restored
// autosave session, no share-URL load, empty grid) loads the classic808 demo
// beat and shows 3 dismissable coach marks. Runs LAST in the boot order so it
// can trust GC.flags set by share.js / autosave.js.
// =============================================================================

const SEEN_KEY = 'gc.seen';

function hasSeen() {
  try { return !!localStorage.getItem(SEEN_KEY); } catch (e) { return true; }
}

function markSeen() {
  try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* private mode */ }
}

// True when no step cell holds anything in either variation.
function gridIsEmpty(GC) {
  try {
    const patterns = GC && GC.patterns;
    if (!patterns) return false; // can't verify -> don't overwrite anything
    for (const varKey of Object.keys(patterns)) {
      const bank = patterns[varKey];
      if (!Array.isArray(bank)) continue;
      for (const pattern of bank) {
        if (!pattern) continue;
        for (const part of [pattern.part1, pattern.part2]) {
          if (!Array.isArray(part)) continue;
          for (const cell of part) {
            if (cell && typeof cell === 'object') {
              for (const k in cell) {
                if (cell[k]) return false;
              }
            }
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Coach marks
// ---------------------------------------------------------------------------

const MARKS = [
  {
    anchor: () => document.getElementById('playButton'),
    title: 'Press play',
    body: 'We loaded a classic 808 groove to get you started. Hit PLAY — or just tap Space.'
  },
  {
    anchor: () => document.querySelector('.instrument-row .step-button'),
    title: 'Make it yours',
    body: 'Tap steps to add and remove hits. Drag up and down on a lit pad to shape its velocity.'
  },
  {
    anchor: () => document.getElementById('gc-browse-btn') || document.querySelector('.quick-actions'),
    title: 'Explore 170+ grooves',
    body: 'BROWSE opens the full library — styles, grooves, genre filters and favorites.'
  }
];

let markEl = null;
let markIndex = 0;

function positionMark(anchor) {
  const tip = markEl.querySelector('.gc-coach-tip');
  const rect = anchor.getBoundingClientRect();
  const tipW = Math.min(300, window.innerWidth - 24);
  let left = rect.left + rect.width / 2 - tipW / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - tipW - 12));
  let top = rect.bottom + 10;
  if (top + 150 > window.innerHeight) top = Math.max(12, rect.top - 150);
  tip.style.width = `${tipW}px`;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function showMark(i) {
  const remaining = MARKS.slice(i);
  const next = remaining.find(m => m.anchor());
  if (!next) { finish(); return; }
  markIndex = MARKS.indexOf(next);

  const anchor = next.anchor();
  const isLast = markIndex >= MARKS.length - 1;
  markEl.querySelector('.gc-coach-step').textContent = `${markIndex + 1} / ${MARKS.length}`;
  markEl.querySelector('.gc-coach-title').textContent = next.title;
  markEl.querySelector('.gc-coach-body').textContent = next.body;
  markEl.querySelector('.gc-coach-next').textContent = isLast ? 'Got it' : 'Next';
  positionMark(anchor);
  const nextBtn = markEl.querySelector('.gc-coach-next');
  if (nextBtn) nextBtn.focus();
}

function finish() {
  markSeen();
  if (markEl) {
    markEl.remove();
    markEl = null;
  }
  window.removeEventListener('resize', onResize);
}

function onResize() {
  const m = MARKS[markIndex];
  const anchor = m && m.anchor();
  if (markEl && anchor) positionMark(anchor);
}

function startCoachMarks() {
  markEl = document.createElement('div');
  markEl.id = 'gc-onboarding';
  markEl.innerHTML = `
    <div class="gc-coach-tip" role="dialog" aria-label="Getting started tip">
      <div class="gc-coach-head">
        <span class="gc-coach-step">1 / 3</span>
        <button class="gc-coach-skip" type="button" aria-label="Skip the tour">Skip</button>
      </div>
      <div class="gc-coach-title"></div>
      <div class="gc-coach-body"></div>
      <button class="gc-coach-next" type="button">Next</button>
    </div>`;
  document.body.appendChild(markEl);

  markEl.querySelector('.gc-coach-skip').addEventListener('click', finish);
  markEl.querySelector('.gc-coach-next').addEventListener('click', () => {
    if (markIndex >= MARKS.length - 1) finish();
    else showMark(markIndex + 1);
  });
  markEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); finish(); }
  });
  window.addEventListener('resize', onResize);

  showMark(0);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
  if (typeof document === 'undefined') return;
  if (document.getElementById('gc-onboarding')) return;
  if (hasSeen()) return;

  const flags = (GC && GC.flags) || {};
  if (flags.restoredSession || flags.loadedFromShare) {
    // Not a cold start — never show the tour again either.
    markSeen();
    return;
  }
  if (!gridIsEmpty(GC)) {
    markSeen();
    return;
  }

  // Load the demo beat through the bridge (fall back to the classic global).
  const load = (GC && GC.fns && GC.fns.loadStylePreset) ||
    (typeof window.loadStylePreset === 'function' ? window.loadStylePreset : null);
  if (load) {
    try { load('classic808'); } catch (e) { console.warn('[onboarding] demo load failed', e); }
  }

  markSeen();
  startCoachMarks();
}
