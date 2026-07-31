/**
 * One-shot: inject genre-gap style presets into presets.js, index.html, preset-meta.js.
 * Run from repo root: node scripts/add-genre-gap-presets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const Z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const row = (arr) => arr.slice();

/** Full 18-key pattern object from sparse overrides */
function pat(o) {
  return {
    bd: row(o.bd || Z), sd: row(o.sd || Z), cp: row(o.cp || Z), rim: row(o.rim || Z),
    ch: row(o.ch || Z), oh: row(o.oh || Z), cb: row(o.cb || Z), cl: row(o.cl || Z),
    ma: row(o.ma || Z), lt: row(o.lt || Z), mt: row(o.mt || Z), ht: row(o.ht || Z),
    hc: row(o.hc || Z), mc: row(o.mc || Z), lc: row(o.lc || Z),
    cym: row(o.cym || Z), cr: row(o.cr || Z), accent: row(o.accent || Z)
  };
}

function fmtArr(a) {
  return '[' + a.join(', ') + ']';
}

function toPresetJs(key, comment, bpm, patterns) {
  const lines = Object.entries(patterns).map(([k, v]) => {
    const pad = k.length === 2 ? '  ' : k.length === 3 ? ' ' : '';
    return `        ${k}:${pad} ${fmtArr(v)},`;
  });
  return `    ${key}: {
      // ${comment}
      bpm: ${bpm},
      patterns: {
${lines.join('\n')}
      }
    }`;
}

// ---------------------------------------------------------------------------
// Preset definitions — musically idiomatic, sparse, genre-true
// ---------------------------------------------------------------------------

const NEW = [
  // ===== Afro (+3 → 5) =====
  {
    key: 'amapiano', label: 'Amapiano', emoji: '🎹', bpm: 112, genre: 'Afro',
    comment: 'Amapiano — soft skippy kick, log-drum tom pulse, shaker bed, sparse clap. Piano-ready pocket, never busy.',
    optgroup: 'afro',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      ma:     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      lt:     [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      mt:     [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      hc:     [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'gqom', label: 'Gqom', emoji: '🔊', bpm: 127, genre: 'Afro',
    comment: 'Gqom (Durban) — broken kick lattice, hard sparse claps, almost no hats. Raw, dark, club pressure.',
    optgroup: 'afro',
    patterns: pat({
      bd:     [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      rim:    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      ch:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      lt:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'afroswing', label: 'Afroswing', emoji: '🕺', bpm: 104, genre: 'Afro',
    comment: 'Afroswing — UK groove: syncopated kick, snappy snare+clap on 2&4, light 16th hats, rim ghosts. Melodic-rap ready.',
    optgroup: 'afro',
    patterns: pat({
      bd:     [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      rim:    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
      ch:     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      ma:     [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== DnB (+4 → 5) =====
  {
    key: 'dnb_liquid', label: 'Liquid DnB', emoji: '💧', bpm: 174, genre: 'DnB',
    comment: 'Liquid drum & bass — classic two-step (kick 1 + 11), soft snare hits, rolling ghost hats, airy opens. Flowing, not aggressive.',
    optgroup: 'dnb',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ch:     [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      rim:    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'dnb_jumpup', label: 'Jump-Up DnB', emoji: '🦘', bpm: 174, genre: 'DnB',
    comment: 'Jump-up — bouncy two-step with extra kick energy, snappy snare+clap, busy hats, dancefloor grin.',
    optgroup: 'dnb',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1],
      oh:     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'dnb_neuro', label: 'Neurofunk', emoji: '🧬', bpm: 172, genre: 'DnB',
    comment: 'Neurofunk — tight dark two-step, ghost snares, surgical hats, rim ticks. Precision, not swing.',
    optgroup: 'dnb',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      rim:    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      ch:     [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      oh:     [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'jungle', label: 'Jungle', emoji: '🌴', bpm: 170, genre: 'DnB',
    comment: 'Jungle — Amen-flavored chop: syncopated kicks, snare cluster language, rolling hats, tom flick. Rawer than liquid.',
    optgroup: 'dnb',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
      ch:     [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      mt:     [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ht:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
    })
  },

  // ===== Dubstep (+1 → 5) =====
  {
    key: 'dubstep_deep', label: 'Deep Dubstep', emoji: '🌑', bpm: 140, genre: 'Dubstep',
    comment: 'Deep / dubstep — half-time gospel: kick on 1, lonely snare+clap on beat 3, minimal hats, space is the drop.',
    optgroup: 'dubstep',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      ch:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      rim:    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    })
  },

  // ===== Hip-Hop (+1 → 5) =====
  {
    key: 'lofi_hiphop', label: 'Lo-Fi Hip-Hop', emoji: '📻', bpm: 84, genre: 'Hip-Hop',
    comment: 'Lo-fi hip-hop — lazy kick pocket, soft snare on 2&4, dusty hat gaps, rim ghosts. Study-beat space, not trap density.',
    optgroup: 'hiphop',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      rim:    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      ma:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== House (+2 → 5) =====
  {
    key: 'classic_house', label: 'Classic House', emoji: '🏠', bpm: 124, genre: 'House',
    comment: 'Classic / Chicago house — strict 4otf, clap on 2&4, OFFBEAT open hats (the genre DNA), light 8th closed hats.',
    optgroup: 'house',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      oh:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'progressive_house', label: 'Progressive House', emoji: '📈', bpm: 126, genre: 'House',
    comment: 'Progressive house — driving 4otf, clap stack, rolling 16th hats, wide offbeat opens, hypnotic build energy.',
    optgroup: 'house',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      oh:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== Indie (+1 → 5) =====
  {
    key: 'dream_pop', label: 'Dream Pop', emoji: '☁️', bpm: 98, genre: 'Indie',
    comment: 'Dream pop — sparse soft kick, brushed snare on 2&4, airy open hats, almost no clutter. Reverb lives in the arrangement.',
    optgroup: 'indie',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      ma:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      cym:    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== K-Pop (+1 → 5) =====
  {
    key: 'kpop_edm', label: 'K-Pop EDM', emoji: '🎆', bpm: 128, genre: 'K-Pop',
    comment: 'K-pop EDM hybrid — 4otf festival kick, clap+snare punch on 2&4, rolling hats, open-hat lifts. Chorus/drop ready.',
    optgroup: 'kpop',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      oh:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      cr:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== Phonk (+3 → 5) =====
  {
    key: 'phonk_house', label: 'Phonk House', emoji: '🏠', bpm: 128, genre: 'Phonk',
    comment: 'Phonk house — 4otf under Memphis cowbell + clap backbeat. Club tempo with phonk DNA.',
    optgroup: 'phonk',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      oh:     [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      cb:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'cowbell_phonk', label: 'Cowbell Phonk', emoji: '🔔', bpm: 140, genre: 'Phonk',
    comment: 'Cowbell phonk — midtempo half-time snare, cowbell as the lead motif (drift cousin), sparse kick. The bell IS the hook.',
    optgroup: 'phonk',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      ch:     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      cb:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      rim:    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    })
  },
  {
    key: 'phonk_tape', label: 'Tape Phonk', emoji: '📼', bpm: 95, genre: 'Phonk',
    comment: 'Tape phonk — slower Memphis crawl, dirty snare on 3 (half-time), lo-fi hat chatter, cowbell ghosts. Cassette grit.',
    optgroup: 'phonk',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      ch:     [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0],
      cb:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      rim:    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    })
  },

  // ===== Rock (+1 → 5) =====
  {
    key: 'blues_rock', label: 'Blues Rock', emoji: '🎸', bpm: 112, genre: 'Rock',
    comment: 'Blues rock — pocket kick (1 + and-of-2 feel), snare on 2&4, 8th hats with open lift, rim ghosts. Shuffle soul without double-time.',
    optgroup: 'rock',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      rim:    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      cr:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },

  // ===== Trance (+3 → 5) =====
  {
    key: 'uplifting_trance', label: 'Uplifting Trance', emoji: '🌅', bpm: 138, genre: 'Trance',
    comment: 'Uplifting trance — strict quarter 4otf (never 8th kicks), clap on 2&4, rolling 16ths, wide offbeat opens. Hands-up DNA.',
    optgroup: 'trance',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      oh:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      cr:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'tech_trance', label: 'Tech Trance', emoji: '⚙️', bpm: 140, genre: 'Trance',
    comment: 'Tech trance — quarter 4otf, harder clap, tighter 16th hats, sparse opens. Techno muscle under trance drive.',
    optgroup: 'trance',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      sd:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      rim:    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      ch:     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      oh:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'progressive_trance', label: 'Progressive Trance', emoji: '🌊', bpm: 132, genre: 'Trance',
    comment: 'Progressive trance — deeper 4otf, soft clap, rolling hats with breathing gaps, patient offbeat opens. Hypnotic, not anthem.',
    optgroup: 'trance',
    patterns: pat({
      bd:     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      oh:     [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      ma:     [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      accent: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    })
  },

  // ===== Trap (+2 → 5) =====
  {
    key: 'trap_soul', label: 'Trap Soul', emoji: '💜', bpm: 128, genre: 'Trap',
    comment: 'Trap soul — melodic-trap pocket: sparse kick, soft snare on 2&4, airy hat rolls with gaps, room to sing. Not drill density.',
    optgroup: 'trap',
    patterns: pat({
      bd:     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      cp:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0],
      oh:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      rim:    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    })
  },
  {
    key: 'pluggnb', label: 'Pluggnb', emoji: '🧸', bpm: 142, genre: 'Trap',
    comment: 'Pluggnb — soft bouncing kicks, gentle snare, fluttering 16th hats with intentional holes, cute/melodic trap adjacent.',
    optgroup: 'trap',
    patterns: pat({
      bd:     [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
      sd:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ch:     [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      oh:     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      rim:    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      accent: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    })
  }
];

// ---------------------------------------------------------------------------
// Apply to files
// ---------------------------------------------------------------------------

const presetsPath = path.join(root, 'presets.js');
const htmlPath = path.join(root, 'index.html');
const metaPath = path.join(root, 'js/data/preset-meta.js');

let presetsSrc = fs.readFileSync(presetsPath, 'utf8');
let htmlSrc = fs.readFileSync(htmlPath, 'utf8');
let metaSrc = fs.readFileSync(metaPath, 'utf8');

for (const p of NEW) {
  if (presetsSrc.includes(`\n    ${p.key}:`)) {
    console.log('skip existing', p.key);
    continue;
  }
}

const block = ',\n' + NEW.map(p => toPresetJs(p.key, p.comment, p.bpm, p.patterns)).join(',\n');

// Insert before final `};` of stylePresets (last occurrence after neo_soul_rap)
const marker = '    neo_soul_rap:';
const idx = presetsSrc.lastIndexOf(marker);
if (idx === -1) throw new Error('neo_soul_rap not found');
const closeIdx = presetsSrc.indexOf('\n  };', idx);
if (closeIdx === -1) throw new Error('stylePresets close not found');
presetsSrc = presetsSrc.slice(0, closeIdx) + block + presetsSrc.slice(closeIdx);
fs.writeFileSync(presetsPath, presetsSrc);

// HTML options — insert next to related genre clusters
const htmlInserts = [
  { after: 'afro_house', keys: ['amapiano', 'gqom', 'afroswing'] },
  { after: 'dnb', keys: ['dnb_liquid', 'dnb_jumpup', 'dnb_neuro', 'jungle'] },
  { after: 'dubstep_melodic', keys: ['dubstep_deep'] },
  { after: 'neo_soul_rap', keys: ['lofi_hiphop'] },
  { after: 'basshouse', keys: ['classic_house', 'progressive_house'] },
  { after: 'cloud_rock', keys: ['dream_pop'] },
  { after: 'kpophiphop', keys: ['kpop_edm'] },
  { after: 'driftphonk', keys: ['phonk_house', 'cowbell_phonk', 'phonk_tape'] },
  { after: 'punk_rock', keys: ['blues_rock'] },
  { after: 'psytrance', keys: ['uplifting_trance', 'tech_trance', 'progressive_trance'] },
  { after: 'latintrap', keys: ['trap_soul', 'pluggnb'] }
];

function optionHtml(p) {
  return `<option value="${p.key}">${p.emoji} ${p.label} (${p.bpm} BPM)</option>`;
}

const byKey = Object.fromEntries(NEW.map(p => [p.key, p]));

for (const { after, keys } of htmlInserts) {
  const re = new RegExp(`(<option value="${after}"[^>]*>[^<]*</option>)`);
  if (!re.test(htmlSrc)) {
    console.warn('HTML anchor missing:', after);
    continue;
  }
  const inject = keys.map(k => optionHtml(byKey[k])).join('\n          ');
  htmlSrc = htmlSrc.replace(re, `$1\n          ${inject}`);
}
fs.writeFileSync(htmlPath, htmlSrc);

// preset-meta — insert after matching genre neighbors
const metaLines = NEW.map(p =>
  `  { kind: 'style', key: '${p.key}',${' '.repeat(Math.max(1, 22 - p.key.length))}label: '${p.label}',${' '.repeat(Math.max(1, 24 - p.label.length))}emoji: '${p.emoji}', bpm: ${String(p.bpm).padEnd(3)}, genre: '${p.genre}' },`
);

// Place before the grooves section
const grooveMark = '  // ===== Grooves / inspiration sequences';
if (!metaSrc.includes(grooveMark)) throw new Error('groove mark missing');
const already = NEW.filter(p => metaSrc.includes(`key: '${p.key}'`));
if (already.length) console.log('meta already has', already.map(p => p.key).join(', '));
const toAdd = NEW.filter(p => !metaSrc.includes(`key: '${p.key}'`));
metaSrc = metaSrc.replace(
  grooveMark,
  toAdd.map(p => {
    const padKey = ' '.repeat(Math.max(1, 22 - p.key.length));
    const padLabel = ' '.repeat(Math.max(1, 24 - p.label.length));
    return `  { kind: 'style', key: '${p.key}',${padKey}label: '${p.label}',${padLabel}emoji: '${p.emoji}', bpm: ${String(p.bpm).padEnd(3)}, genre: '${p.genre}' },`;
  }).join('\n') + '\n\n' + grooveMark
);
fs.writeFileSync(metaPath, metaSrc);

console.log('Added', NEW.length, 'presets');
