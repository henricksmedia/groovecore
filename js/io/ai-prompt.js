/**
 * GrooveCore — js/io/ai-prompt.js
 *
 * Builds a Suno/Udio-style text prompt from the CURRENT sequence, following
 * Suno style-box best practices: comma-separated descriptors, genre/style first,
 * then rhythm/instrumentation, then mood/production, tempo last; no artist
 * names; concise.
 *
 * When a style/inspiration preset was loaded (GC.currentPresetSelection), the
 * prompt LEADS with that preset's genre (Suno-readable), never the GrooveCore
 * track title — names like "Astral Backwater Echo" mean nothing to Suno.
 * Rhythm tags still come from the live grid. If no preset is selected
 * (hand-edited pattern), genre is inferred from BPM + hit shape.
 *
 * ES module; exports init(GC) + buildStylePrompt(); attaches window.GCAIPrompt.
 */

import { findMeta } from '../data/preset-meta.js';

let GCRef = null;

function gc() { return GCRef || (typeof window !== 'undefined' ? window.GC : null); }

function vel(cell, inst) {
    const v = cell ? cell[inst] : undefined;
    if (v === true) return 100;
    const n = Number(v);
    return (isFinite(n) && n > 0) ? n : 0;
}

/** steps[inst] = sorted list of 0-based step indexes with a hit. */
function collect(pattern) {
    const cells = (pattern && Array.isArray(pattern.part1)) ? pattern.part1 : [];
    const steps = {};
    const vels = [];
    let accents = 0;
    for (let i = 0; i < Math.min(16, cells.length); i++) {
        const cell = cells[i];
        if (!cell) continue;
        for (const key of Object.keys(cell)) {
            if (key === 'accent') { if (cell.accent) accents++; continue; }
            const v = vel(cell, key);
            if (v > 0) {
                (steps[key] = steps[key] || []).push(i);
                vels.push(v);
            }
        }
    }
    return { steps, vels, accents, sfx: pattern && pattern.sfx1 ? pattern.sfx1 : {} };
}

function has(steps, inst, wanted) {
    const s = steps[inst] || [];
    return wanted.every(i => s.includes(i));
}

function count(steps, inst) { return (steps[inst] || []).length; }

/** Genre inference from tempo + rhythm shape — fallback when no preset is selected. */
function inferGenre(bpm, f) {
    if (f.fourOnFloor) {
        if (bpm >= 136) return 'melodic trance';
        if (bpm >= 124) return 'EDM house groove';
        if (bpm >= 116) return 'deep house';
        return 'electronic dance';
    }
    if (f.halftime) {
        if (bpm >= 130) return 'trap beat';
        return 'halftime electronic';
    }
    if (bpm >= 165) return 'drum and bass';
    if (bpm <= 96) return f.sparse ? 'downtempo indie-folktronica' : 'boom bap hip hop';
    if (bpm <= 118) return f.sparse ? 'atmospheric electronic' : 'indie electronic pop';
    return 'electronic groove';
}

/** Map Browse genre chips to Suno-friendly style phrases (no track titles). */
const GENRE_TO_SUNO = {
    'Treq': null, // fall through to rhythm inference — brand, not a Suno tag
    'Psyblues': 'delta blues, swampy foot-stomp, psybient atmosphere',
    'Delta Blues': 'delta blues, swampy foot-stomp shuffle, dusty front-porch groove',
    'Psybient': 'psybient, psychill',
    'Trip Hop': 'trip hop',
    'Reggae': 'reggae, dub',
    'Garage': 'UK garage, 2-step',
    'IDM': 'IDM, glitch',
    'Industrial': 'industrial, EBM',
    'Trance': 'trance',
    'Psy': 'psytrance',
};

/** Lead-in from the chosen preset's genre only — never the track label. */
function presetLeadIn(g) {
    const sel = g && g.currentPresetSelection;
    if (!sel || !sel.kind || !sel.key) return null;
    const meta = findMeta(sel.kind, sel.key);
    if (!meta || !meta.genre) return null;
    if (Object.prototype.hasOwnProperty.call(GENRE_TO_SUNO, meta.genre)) {
        return GENRE_TO_SUNO[meta.genre];
    }
    return meta.genre.toLowerCase();
}

function buildStylePrompt() {
    const g = gc();
    if (!g || !g.patterns) return null;
    const bank = g.patterns[g.variation];
    const pattern = bank && bank[Number(g.currentPattern) || 0];
    if (!pattern) return null;

    const bpm = Math.round(Number(g.tempo) || 120);
    const { steps, vels, accents, sfx } = collect(pattern);
    const totalHits = vels.length;
    if (!totalHits) return null;

    const f = {
        fourOnFloor: has(steps, 'bd', [0, 4, 8, 12]),
        halftime: !has(steps, 'bd', [0, 4, 8, 12]) &&
            (count(steps, 'sd') + count(steps, 'cp') > 0) &&
            (steps.sd || []).concat(steps.cp || []).every(i => i === 8 || i > 8),
        sparse: totalHits <= 14,
        dense: totalHits >= 44
    };

    const lead = presetLeadIn(g);
    const parts = [lead || inferGenre(bpm, f)];

    // Rhythm skeleton (from the live grid)
    if (f.fourOnFloor) parts.push('four-on-the-floor 808 kick');
    else if (count(steps, 'bd') <= 3 && count(steps, 'bd') > 0) parts.push('sparse deep 808 kick');
    else if (count(steps, 'bd') > 0) parts.push('syncopated 808 kick');

    const sdBack = has(steps, 'sd', [4, 12]);
    const cpBack = has(steps, 'cp', [4, 12]);
    if (sdBack && cpBack) parts.push('layered clap and snare backbeat');
    else if (cpBack) parts.push('handclap backbeat');
    else if (sdBack) parts.push('snare backbeat');
    else if (f.halftime) parts.push('halftime snare');

    // Hat language
    const chN = count(steps, 'ch');
    const ohSteps = steps.oh || [];
    const offbeatOpens = ohSteps.length > 0 && ohSteps.every(i => i % 4 === 2);
    if (chN >= 12) parts.push('driving 16th-note hi-hats');
    else if (chN >= 6) parts.push('steady 8th-note hats');
    if (offbeatOpens) parts.push('offbeat open hi-hats');
    if (Object.keys(sfx).some(k => sfx[k] && sfx[k].r >= 2)) parts.push('hi-hat rolls');

    // Percussion color
    if (count(steps, 'hc') + count(steps, 'mc') + count(steps, 'lc') > 0) parts.push('conga percussion');
    if (count(steps, 'lt') + count(steps, 'mt') + count(steps, 'ht') >= 5) parts.push('rolling tom groove');
    if (count(steps, 'cb') > 0) parts.push('cowbell accents');
    if (count(steps, 'cl') > 0) parts.push('claves');
    if (count(steps, 'ma') >= 6) parts.push('shaker groove');
    if (count(steps, 'cr') + count(steps, 'cym') > 0) parts.push('cymbal washes');

    // Dynamics + feel
    if (vels.some(v => v <= 65)) parts.push('ghost-note dynamics');
    if (accents > 0 || vels.some(v => v >= 113)) parts.push('punchy accents');
    const swing = g.knobValues ? Number(g.knobValues.swing) : 0;
    if (isFinite(swing) && swing > 2) parts.push('swung groove');
    if (f.sparse) parts.push('minimal, spacious, atmospheric');
    if (f.dense) parts.push('high energy');

    // Production frame + tempo (Suno reads BPM hints well)
    parts.push('analog TR-808 drum machine', 'clean instrumental beat', bpm + ' BPM');

    const meta = (g.currentPresetSelection && findMeta(g.currentPresetSelection.kind, g.currentPresetSelection.key)) || null;
    return {
        prompt: parts.join(', '),
        bpm,
        hits: totalHits,
        preset: meta ? { kind: meta.kind, key: meta.key, label: meta.label, genre: meta.genre } : null
    };
}

const api = { buildStylePrompt };

export function init(GC) {
    GCRef = GC || (typeof window !== 'undefined' ? window.GC : null) || null;
    window.GCAIPrompt = api;
    return api;
}

if (typeof window !== 'undefined') window.GCAIPrompt = api;

export { buildStylePrompt };
export default api;
