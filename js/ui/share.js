// =============================================================================
// GrooveCore — js/ui/share.js  (WS-C)
// Share-by-URL with zero backend:
//   makeShareURL() = GCSchema.toShare() -> JSON -> CompressionStream
//   ('deflate-raw') -> base64url -> '#s='  (fallback '#S=' = uncompressed
//   base64url when CompressionStream is missing).
//
// On init (BEFORE autosave restores — main.js boot order guarantees it) the
// hash is parsed, the shared beat restored, GC.flags.loadedFromShare set, and
// the hash stripped via history.replaceState. Injects a SHARE button next to
// #save and listens for the 'share:copy' bus event.
// Works with localStorage disabled — this module never touches storage.
//
// ES module. Exports init(GC). No-ops when window.GC / GCSchema are absent.
// =============================================================================

let GC = null;
let schema = null;

// -----------------------------------------------------------------------------
// base64url <-> bytes
// -----------------------------------------------------------------------------

function bytesToB64url(bytes) {
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// -----------------------------------------------------------------------------
// deflate-raw via CompressionStream (with graceful absence)
// -----------------------------------------------------------------------------

function hasCompression() {
  return typeof CompressionStream === 'function';
}

function hasDecompression() {
  return typeof DecompressionStream === 'function';
}

async function deflateRaw(bytes) {
  const cs = new CompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(cs);
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function inflateRaw(bytes) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

// -----------------------------------------------------------------------------
// Encode / decode
// -----------------------------------------------------------------------------

async function makeShareURL() {
  if (!schema) return null;
  const share = schema.toShare();
  if (!share) return null;
  const json = JSON.stringify(share);
  const bytes = new TextEncoder().encode(json);

  const base = location.origin + location.pathname + location.search;
  if (hasCompression()) {
    try {
      const packed = await deflateRaw(bytes);
      return base + '#s=' + bytesToB64url(packed);
    } catch (e) {
      console.warn('[gc-share] compression failed, falling back', e);
    }
  }
  return base + '#S=' + bytesToB64url(bytes);
}

async function decodeHash(hash) {
  // Returns the share object, or null when the hash is not ours / undecodable.
  if (typeof hash !== 'string') return null;
  let payload = null;
  let compressed = false;
  if (hash.indexOf('#s=') === 0) { payload = hash.slice(3); compressed = true; }
  else if (hash.indexOf('#S=') === 0) { payload = hash.slice(3); compressed = false; }
  if (!payload) return null;

  let bytes;
  try {
    bytes = b64urlToBytes(payload);
  } catch (e) {
    throw new Error('malformed share link');
  }
  if (compressed) {
    if (!hasDecompression()) throw new Error('this browser cannot open compressed share links');
    bytes = await inflateRaw(bytes);
  }
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

// -----------------------------------------------------------------------------
// Copy to clipboard (layered fallbacks; final resort = show the URL)
// -----------------------------------------------------------------------------

async function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) {
    return false;
  }
}

async function doShare() {
  const toast = window.GCToast;
  const url = await makeShareURL();
  if (!url) {
    if (toast) toast.show('Nothing to share yet', { type: 'warn' });
    return null;
  }
  const copied = await copyText(url);
  if (copied) {
    if (toast) toast.show('Share link copied (' + url.length + ' chars)', { type: 'success' });
  } else if (toast && typeof toast.overlay === 'function') {
    // Clipboard blocked (http, permissions): show the link for manual copy.
    const wrap = document.createElement('div');
    const h = document.createElement('div');
    h.style.cssText = 'font-weight:700;margin-bottom:10px;color:#ff6500;';
    h.textContent = 'Copy your share link';
    const box = document.createElement('textarea');
    box.readOnly = true;
    box.value = url;
    box.style.cssText = 'width:100%;min-height:90px;background:#000;color:#eee;border:1px solid #444;border-radius:4px;padding:8px;font-size:11px;word-break:break-all;';
    wrap.appendChild(h);
    wrap.appendChild(box);
    toast.overlay(wrap);
    box.focus();
    box.select();
  }
  return url;
}

// -----------------------------------------------------------------------------
// Boot: parse an incoming share hash
// -----------------------------------------------------------------------------

async function loadFromHash() {
  const hash = location.hash;
  if (!hash || (hash.indexOf('#s=') !== 0 && hash.indexOf('#S=') !== 0)) return false;

  let share = null;
  try {
    share = await decodeHash(hash);
  } catch (e) {
    console.warn('[gc-share] failed to decode share link', e);
    const toast = window.GCToast;
    if (toast) toast.show('Could not open share link: ' + e.message, { type: 'error' });
    stripHash();
    return false;
  }
  if (!share) return false;

  const snap = schema.fromShare(share);
  if (!snap || !schema.restore(snap)) {
    const toast = window.GCToast;
    if (toast) toast.show('Share link contained an invalid beat', { type: 'error' });
    stripHash();
    return false;
  }

  if (GC.flags) GC.flags.loadedFromShare = true;
  stripHash();
  const toast = window.GCToast;
  if (toast) toast.show('Shared beat loaded', { type: 'success' });
  return true;
}

function stripHash() {
  try {
    history.replaceState(null, '', location.pathname + location.search);
  } catch (e) { /* noop */ }
}

// -----------------------------------------------------------------------------
// SHARE button next to #save
// -----------------------------------------------------------------------------

function injectShareButton() {
  if (document.getElementById('gc-share-btn')) return;
  const save = document.getElementById('save');
  if (!save) return;
  const btn = document.createElement('button');
  btn.id = 'gc-share-btn';
  // Mirror the existing action-button styling so it sits in naturally.
  btn.className = 'action-btn flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors';
  btn.title = 'Copy a share link to this beat';
  btn.innerHTML = '<span class="material-icons text-sm">link</span><span class="button-text">SHARE</span>';
  btn.addEventListener('click', () => { doShare(); });
  save.insertAdjacentElement('afterend', btn);
}

// -----------------------------------------------------------------------------
// init + global attach
// -----------------------------------------------------------------------------

const api = { makeShareURL, share: doShare };

export async function init(gc) {
  GC = gc || window.GC || null;
  schema = window.GCSchema || null;
  if (!GC || !schema) {
    console.warn('[gc-share] GC bridge or GCSchema missing — share disabled');
    return null;
  }

  // Awaited by the boot loader, so this completes BEFORE autosave.init runs:
  // a #s= hash always wins over the restored session.
  await loadFromHash();

  injectShareButton();

  if (GC.events && typeof GC.events.on === 'function') {
    GC.events.on('share:copy', () => { doShare(); });
  }

  window.GCShare = api;
  return api;
}

export { makeShareURL, doShare };
