// =============================================================================
// GrooveCore mobile shell behavior (WS-H)
// ES module. Injects the compact-dock expander toggle for the sticky bottom
// deck (css/mobile.css collapses the deck to one row below 1024px).
// Fails soft: no-ops when the DOM it needs is absent.
// =============================================================================

export function init(GC) {
  if (typeof document === 'undefined') return;

  wrapGridScroller();
  trackDeckHeight();

  const dock = document.querySelector('.sticky-bottom-section');
  const masterControls = dock && dock.querySelector('.master-controls');
  if (!dock || !masterControls) return;
  if (document.getElementById('gc-groove-toggle')) return; // idempotent

  const btn = document.createElement('button');
  btn.id = 'gc-groove-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'groove-tab');
  btn.setAttribute('aria-label', 'Show groove and effects controls');
  btn.innerHTML = 'GROOVE <span class="gc-caret" aria-hidden="true">▴</span>';
  masterControls.appendChild(btn);

  function setExpanded(expanded) {
    dock.classList.toggle('gc-expanded', expanded);
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.setAttribute('aria-label', expanded
      ? 'Hide groove and effects controls'
      : 'Show groove and effects controls');
  }

  btn.addEventListener('click', () => {
    setExpanded(!dock.classList.contains('gc-expanded'));
  });
}

// Wrap the pattern-labels row + all instrument rows in one .gc-grid-scroll
// container. css/mobile.css makes THAT the horizontal scroller below 1024px,
// so the sequencer header (PLAY/REC/…) sits outside the scroll surface and can
// stick to the viewport instead of scrolling away with the grid.
// Publish the real heights of the fixed chrome (sticky deck, fixed header) as
// CSS variables so shell.css can pad the content by measurement instead of the
// hardcoded constants styles.css used (170px top / 120px bottom). Tracks
// resizes, wrapping, and the GROOVE expander opening/closing.
function trackDeckHeight() {
  if (typeof ResizeObserver !== 'function') return;
  const track = (selector, varName) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(varName, el.offsetHeight + 'px');
    };
    new ResizeObserver(publish).observe(el);
    publish();
  };
  track('.sticky-bottom-section', '--gc-deck-h');
  track('.app-header', '--gc-header-h');
}

function wrapGridScroller() {
  const panel = document.querySelector('.step-sequencer-panel');
  if (!panel || panel.querySelector('.gc-grid-scroll')) return; // idempotent
  const rows = panel.querySelectorAll(':scope > .pattern-labels, :scope > .instrument-row');
  if (!rows.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'gc-grid-scroll';
  rows[0].parentNode.insertBefore(wrap, rows[0]);
  rows.forEach((row) => wrap.appendChild(row));
}
