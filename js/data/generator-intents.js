// Beginner-facing musical directions for the Playground.
// These are deliberately small, opinionated rhythm grammars rather than
// aliases for the much larger preset library.

export const GENERATOR_INTENTS = [
  {
    id: 'night-drive',
    label: 'Night Drive',
    eyebrow: 'DARK · SWUNG',
    description: 'A spacious, late-night two-step pocket.',
    bpm: 128,
    color: '#d64b3c',
    backbeat: [4, 12],
    kick: [0, 7, 10],
    hatMode: 'eighths',
    swing: 6,
    colorVoices: ['cl', 'lc', 'mc'],
    fillVoices: ['lt', 'mt', 'ht', 'cym'],
    macros: { pulse: 4, pocket: 8, motion: 5, tone: 4, space: 8, energy: 5, surprise: 3 },
    suno: 'dark UK garage, nocturnal future garage, swung two-step drums, deep sub pressure'
  },
  {
    id: 'club-pulse',
    label: 'Club Pulse',
    eyebrow: 'DIRECT · DANCE',
    description: 'Four-on-the-floor weight with an open-hat lift.',
    bpm: 124,
    color: '#f06b2e',
    backbeat: [4, 12],
    kick: [0, 4, 8, 12],
    hatMode: 'offbeat',
    swing: 1,
    colorVoices: ['cl', 'cb', 'hc'],
    fillVoices: ['lt', 'mt', 'ht', 'cr'],
    macros: { pulse: 9, pocket: 3, motion: 7, tone: 6, space: 4, energy: 8, surprise: 3 },
    suno: 'deep modern house, direct four-on-the-floor club rhythm, warm late-night energy'
  },
  {
    id: 'boom-room',
    label: 'Boom Room',
    eyebrow: 'HEAVY · HUMAN',
    description: 'A dusty head-nod beat with room for vocals.',
    bpm: 88,
    color: '#dd9b29',
    backbeat: [4, 12],
    kick: [0, 6, 10],
    hatMode: 'eighths',
    swing: 7,
    colorVoices: ['lc', 'cb', 'cl'],
    fillVoices: ['lt', 'mt', 'ht', 'cym'],
    macros: { pulse: 6, pocket: 9, motion: 3, tone: 8, space: 6, energy: 5, surprise: 4 },
    suno: 'dusty experimental boom bap, thick analog drums, lazy head-nod pocket, vocal-ready'
  },
  {
    id: 'trap-space',
    label: 'Trap Space',
    eyebrow: 'HALF-TIME · WIDE',
    description: 'Sparse low-end punctuation and restless hats.',
    bpm: 142,
    color: '#d7b835',
    backbeat: [8],
    kick: [0, 6, 11],
    hatMode: 'sixteenths',
    swing: 2,
    colorVoices: ['cl', 'cb', 'hc'],
    fillVoices: ['lt', 'ht', 'mt', 'cr'],
    macros: { pulse: 5, pocket: 2, motion: 9, tone: 5, space: 8, energy: 7, surprise: 7 },
    suno: 'spacious halftime trap, deep 808 punctuation, restless hats, wide vocal gaps'
  },
  {
    id: 'broken-neon',
    label: 'Broken Neon',
    eyebrow: 'ANGULAR · BRIGHT',
    description: 'Clipped club drums with controlled disruption.',
    bpm: 148,
    color: '#e34d34',
    backbeat: [4, 11],
    kick: [0, 3, 7, 10, 14],
    hatMode: 'sixteenths',
    swing: 2,
    colorVoices: ['cb', 'hc', 'cl', 'mc'],
    fillVoices: ['lt', 'ht', 'cym', 'mt'],
    macros: { pulse: 8, pocket: 2, motion: 10, tone: 9, space: 3, energy: 10, surprise: 10 },
    suno: 'deconstructed club, hyperpop-adjacent electronic, clipped drums, glitch percussion, aggressive'
  },
  {
    id: 'slow-bloom',
    label: 'Slow Bloom',
    eyebrow: 'SOFT · CINEMATIC',
    description: 'A minimal pulse that grows through percussion.',
    bpm: 78,
    color: '#bca443',
    backbeat: [4, 12],
    kick: [0, 9],
    hatMode: 'quarters',
    swing: 4,
    colorVoices: ['cl', 'lc', 'mc'],
    fillVoices: ['lt', 'mc', 'cym', 'mt'],
    macros: { pulse: 2, pocket: 6, motion: 2, tone: 3, space: 10, energy: 2, surprise: 2 },
    suno: 'cinematic downtempo, atmospheric electronic, soft evolving percussion, intimate and spacious'
  },
  {
    id: 'velvet-knock',
    label: 'Velvet Knock',
    eyebrow: 'SILKY · FUNKY',
    description: 'Soft-edged disco drums with a confident pocket.',
    bpm: 108,
    color: '#cf6b47',
    backbeat: [4, 12],
    kick: [0, 4, 8, 12],
    hatMode: 'offbeat',
    swing: 4,
    colorVoices: ['cb', 'cl', 'hc'],
    fillVoices: ['lt', 'mt', 'ht', 'cr'],
    macros: { pulse: 8, pocket: 6, motion: 6, tone: 7, space: 4, energy: 6, surprise: 4 },
    suno: 'nu-disco, funky house, silky analog drums, confident groove, clean dance production'
  },
  {
    id: 'ghost-machine',
    label: 'Ghost Machine',
    eyebrow: 'HAUNTED · AIRY',
    description: 'Muted mechanical rhythm drifting through a large room.',
    bpm: 78,
    color: '#9c806f',
    backbeat: [4, 12],
    kick: [0, 10],
    hatMode: 'quarters',
    swing: 5,
    colorVoices: ['mc', 'lc', 'cl'],
    fillVoices: ['lt', 'mt', 'cym', 'ht'],
    macros: { pulse: 3, pocket: 7, motion: 3, tone: 6, space: 10, energy: 3, surprise: 4 },
    suno: 'ambient downtempo, cinematic electronica, muted drum-machine dust, distant industrial atmosphere'
  },
  {
    id: 'afterhours-cowbell',
    label: 'Afterhours Bell',
    eyebrow: 'NOIR · FUNK',
    description: 'A warm house pulse built around metallic punctuation.',
    bpm: 112,
    color: '#d78035',
    backbeat: [4, 12],
    kick: [0, 4, 8, 12],
    hatMode: 'offbeat',
    swing: 3,
    colorVoices: ['cb', 'cb', 'cl', 'hc'],
    fillVoices: ['lt', 'ht', 'mt', 'cr'],
    macros: { pulse: 9, pocket: 5, motion: 6, tone: 10, space: 5, energy: 7, surprise: 5 },
    suno: 'leftfield house, dark nu-disco, filtered cowbell hook, warm four-on-the-floor drums'
  },
  {
    id: 'liquid-runner',
    label: 'Liquid Runner',
    eyebrow: 'FAST · FLOWING',
    description: 'Weightless breakbeat momentum with tuned percussion.',
    bpm: 174,
    color: '#54a88f',
    backbeat: [4, 12],
    kick: [0, 3, 7, 10, 14],
    hatMode: 'sixteenths',
    swing: 3,
    colorVoices: ['mc', 'hc', 'cb', 'cl'],
    fillVoices: ['lt', 'mt', 'ht', 'cym'],
    macros: { pulse: 7, pocket: 7, motion: 10, tone: 6, space: 5, energy: 8, surprise: 7 },
    suno: 'liquid drum and bass, flowing breakbeats, rolling ghost hats, warm sub bass, atmospheric'
  },
  {
    id: 'dub-chamber',
    label: 'Dub Chamber',
    eyebrow: 'DEEP · HYPNOTIC',
    description: 'A restrained techno pulse with echo-shaped negative space.',
    bpm: 124,
    color: '#6d9d70',
    backbeat: [4, 12],
    kick: [0, 4, 8, 12],
    hatMode: 'offbeat',
    swing: 2,
    colorVoices: ['lc', 'mc', 'cl'],
    fillVoices: ['lt', 'ht', 'mt', 'cym'],
    macros: { pulse: 8, pocket: 4, motion: 4, tone: 4, space: 10, energy: 5, surprise: 2 },
    suno: 'dub techno, deep house, hypnotic chord echoes, soft drum machine, spacious and minimal'
  },
  {
    id: 'jersey-bounce',
    label: 'Jersey Bounce',
    eyebrow: 'BOUNCY · CHOPPED',
    description: 'Elastic club kicks and hard gaps built for vocal chops.',
    bpm: 145,
    color: '#cf4678',
    backbeat: [4, 7, 12],
    kick: [0, 3, 6, 10, 14],
    hatMode: 'sixteenths',
    swing: 2,
    colorVoices: ['cb', 'mc', 'hc', 'cl'],
    fillVoices: ['lt', 'ht', 'mt', 'cr'],
    macros: { pulse: 9, pocket: 3, motion: 8, tone: 7, space: 7, energy: 9, surprise: 8 },
    suno: 'Jersey club, Baltimore club, elastic triplet kick bounce, chopped vocal-ready gaps, hard club drums'
  }
];

export const DEFAULT_MACROS = {
  pulse: 5,
  pocket: 5,
  motion: 4,
  tone: 5,
  space: 6,
  energy: 5,
  surprise: 3
};

// One-click musical arcs. Locked cards are intentionally left untouched when
// a moment is applied, letting a beginner keep the identity of the groove.
export const MOMENT_PROFILES = [
  {
    id: 'intro',
    label: 'Intro',
    cue: 'Hold back',
    icon: 'first_page',
    macros: { pulse: 3, pocket: 5, motion: 2, tone: 3, space: 9, energy: 2, surprise: 1 }
  },
  {
    id: 'verse',
    label: 'Verse',
    cue: 'Find the pocket',
    icon: 'horizontal_rule',
    macros: { pulse: 5, pocket: 6, motion: 4, tone: 4, space: 7, energy: 4, surprise: 2 }
  },
  {
    id: 'chorus',
    label: 'Chorus',
    cue: 'Open it up',
    icon: 'trending_up',
    macros: { pulse: 7, pocket: 5, motion: 7, tone: 6, space: 5, energy: 8, surprise: 4 }
  },
  {
    id: 'drop',
    label: 'Drop',
    cue: 'Peak impact',
    icon: 'flash_on',
    macros: { pulse: 9, pocket: 4, motion: 8, tone: 8, space: 3, energy: 10, surprise: 8 }
  }
];

export const MACRO_META = [
  { id: 'pulse', label: 'Pulse', low: 'Sparse', high: 'Driving', group: 'foundation' },
  { id: 'pocket', label: 'Pocket', low: 'Tight', high: 'Loose', group: 'backbeat' },
  { id: 'motion', label: 'Motion', low: 'Steady', high: 'Rolling', group: 'motion' },
  { id: 'tone', label: 'Color', low: 'Clean', high: 'Textured', group: 'color' },
  { id: 'space', label: 'Space', low: 'Dense', high: 'Open', group: 'space' },
  { id: 'energy', label: 'Energy', low: 'Soft', high: 'Peak', group: 'energy' },
  { id: 'surprise', label: 'Surprise', low: 'Safe', high: 'Wild', group: 'surprise' }
];

export function findIntent(id) {
  return GENERATOR_INTENTS.find((intent) => intent.id === id) || GENERATOR_INTENTS[0];
}
