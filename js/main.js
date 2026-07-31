// =============================================================================
// GrooveCore boot loader (plan §6.3) — the anti-collision keystone.
//
// Waits for the window 'load' event (+50ms so app.js's own init(), bound to
// 'load', always runs first), then sequentially imports every feature module
// with an individual try/catch: a broken module is a silent no-op and the app
// keeps working. Modules read/write state only through window.GC and the other
// frozen globals; each exports init(GC).
//
// Boot order is load-bearing (plan §6.3):
//   ui-kit first (everyone toasts), schema before share/autosave,
//   share before autosave (a #s= hash wins over the autosave restore),
//   keys before tempo-tools/shortcut-overlay/pads, ui-kit before export-menu,
//   onboarding after a11y/mobile (it checks GC.flags set by earlier modules).
// =============================================================================

// Asset version: bump on every deploy (and mirror in index.html's ?v= tags +
// sw.js CACHE name) so browsers pick up new module/CSS code on a normal
// reload instead of serving heuristically-cached copies.
const ASSET_V = 'gc9';

const MODULES = [
  '/js/ui/ui-kit.js',
  '/js/core/schema.js',
  '/js/ui/share.js',
  '/js/ui/autosave.js',
  '/js/ui/history.js',
  '/js/ui/keys.js',
  '/js/ui/tempo-tools.js',
  '/js/ui/shortcut-overlay.js',
  '/js/ui/chain.js',
  '/js/ui/project-io.js',
  '/js/io/export-midi.js',
  '/js/io/export-audio.js',
  '/js/io/ai-prompt.js',
  '/js/ui/export-menu.js',
  '/js/perf/pads.js',
  '/js/perf/midi-in.js',
  '/js/perf/record.js',
  '/js/ui/preset-browser.js',
  '/js/ui/a11y.js',
  '/js/ui/mobile.js',
  '/js/ui/onboarding.js',
  '/js/ui/step-editor.js',
  '/js/ui/step-context.js'
];

// Override stylesheets, injected after styles.css (which is already in <head>).
// tokens.css must come first — everything else consumes its custom properties.
// toast.css is injected here too so ui-kit.js's own guard sees the link and
// does not double-load it.
const STYLESHEETS = [
  'css/tokens.css',
  'css/toast.css',
  'css/polish.css',
  'css/a11y.css',
  'css/mobile.css',
  'css/preset-browser.css',
  'css/onboarding.css',
  'css/step-editor.css',
  'css/step-context.css'
];

function injectStylesheet(href) {
  try {
    const already = Array.prototype.some.call(
      document.querySelectorAll('link[rel="stylesheet"]'),
      (l) => (l.getAttribute('href') || '') === href
    );
    if (already) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    // A missing stylesheet must never leave a dangling broken <link>.
    link.onerror = () => { try { link.remove(); } catch (e) { /* detached */ } };
    document.head.appendChild(link);
  } catch (e) {
    console.warn('[boot] css', href, e);
  }
}

async function boot() {
  for (const href of STYLESHEETS) injectStylesheet(href + '?v=' + ASSET_V);

  for (const path of MODULES) {
    try {
      const m = await import(path + '?v=' + ASSET_V);
      await m.init?.(window.GC);
    } catch (e) {
      console.warn('[boot]', path, e);
    }
  }

  // Service worker: https only, so local file/HTTP dev never caches a stale
  // shell (plan §10). Registration failure is silently non-fatal.
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

function start() {
  // app.js's init() is bound to 'load'; the 50ms delay guarantees it has
  // finished building window.GC before any module touches it.
  setTimeout(() => { boot(); }, 50);
}

if (document.readyState === 'complete') {
  start();
} else {
  window.addEventListener('load', start, { once: true });
}
