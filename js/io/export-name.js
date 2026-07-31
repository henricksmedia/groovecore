/**
 * GrooveCore — shared export filename stems.
 *
 * Recognition order (left → right, what you scan in Downloads):
 *   1. Preset label (UI name), else project name if set
 *   2. Pattern slot (a1) or "chain"
 * Callers append bpm / kind / duration / extension.
 *
 * Example: groovecore-ebm-march-a1-128bpm-mix-28s.wav
 */

import { findMeta } from '../data/preset-meta.js';

function gc() {
  return (typeof window !== 'undefined') ? window.GC : null;
}

/** Filesystem-safe slug from a human label. */
export function fileSafeSlug(name, maxLen) {
  maxLen = maxLen || 40;
  let s = String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > maxLen) {
    s = s.slice(0, maxLen).replace(/-+$/g, '');
  }
  return s;
}

/** Current pattern pad label, e.g. "a1". */
export function patternSlot() {
  const g = gc();
  if (!g) return 'pattern';
  return String(g.variation || 'a') + (Number(g.currentPattern || 0) + 1);
}

/**
 * Human identity for the export: active preset label, else non-default project name.
 * Empty string when neither is available (caller falls back to slot-only).
 */
export function identitySlug() {
  const g = gc();
  const sel = g && g.currentPresetSelection;
  if (sel && sel.kind && sel.key) {
    const meta = findMeta(sel.kind, sel.key);
    if (meta && meta.label) {
      const fromLabel = fileSafeSlug(meta.label);
      if (fromLabel) return fromLabel;
    }
    const fromKey = fileSafeSlug(sel.key);
    if (fromKey) return fromKey;
  }
  const project = g && g.flags && g.flags.projectName;
  if (typeof project === 'string' && project && project !== 'untitled') {
    const fromProject = fileSafeSlug(project);
    if (fromProject) return fromProject;
  }
  return '';
}

/**
 * Core filename stem after "groovecore-".
 * @param {'pattern'|'chain'|'multi'|'chain-multi'|string} [mode]
 * @returns {string} e.g. "ebm-march-a1", "a1", "velvet-knock-chain"
 */
export function exportStem(mode) {
  const id = identitySlug();
  const slot = (mode === 'chain' || mode === 'chain-multi') ? 'chain' : patternSlot();
  return id ? (id + '-' + slot) : slot;
}
