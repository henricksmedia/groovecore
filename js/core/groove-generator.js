import { DEFAULT_MACROS, findIntent } from '../data/generator-intents.js';

const STEPS = 16;
const GROUPS = {
  pulse: ['bd'],
  pocket: ['sd', 'cp', 'rim'],
  motion: ['ch', 'oh', 'ma'],
  tone: ['cb', 'cl', 'hc', 'mc', 'lc'],
  surprise: ['lt', 'mt', 'ht', 'cym', 'cr']
};
const VOICES = ['bd', 'sd', 'lt', 'mt', 'ht', 'rim', 'cp', 'hc', 'mc', 'lc', 'cb', 'cl', 'ma', 'ch', 'oh', 'cym', 'cr'];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function hashSeed(...parts) {
  let h = 2166136261;
  String(parts.join('|')).split('').forEach((char) => {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 16777619);
  });
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function emptyPattern() {
  return {
    part1: Array.from({ length: STEPS }, () => ({})),
    part2: Array.from({ length: STEPS }, () => ({})),
    length1: STEPS,
    length2: 0,
    sfx1: {}
  };
}

function hit(pattern, step, instrument, velocity) {
  const s = ((Math.round(step) % STEPS) + STEPS) % STEPS;
  pattern.part1[s][instrument] = Math.round(clamp(velocity, 1, 127));
}

function remove(pattern, step, instrument) {
  if (pattern.part1[step]) delete pattern.part1[step][instrument];
}

function velocityFor(energy, strong, rng) {
  const base = 62 + energy * 4.7 + (strong ? 14 : 0);
  return clamp(Math.round(base + (rng() - 0.5) * 12), 38, 127);
}

function shuffled(values, rng) {
  const out = values.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function addFoundation(pattern, intent, macros, rng) {
  const { pulse, energy } = macros;
  const extras = shuffled(
    [2, 3, 5, 6, 7, 9, 10, 11, 14, 15].filter((step) => !intent.kick.includes(step)),
    rng
  );
  const candidates = Array.from(new Set([0, ...intent.kick, ...extras]));
  const target = Math.min(candidates.length, 1 + Math.round(pulse * 0.65));
  candidates.slice(0, target).forEach((step, index) => {
    const pulseLift = pulse * 1.2;
    hit(pattern, step, 'bd', velocityFor(energy, index === 0, rng) + pulseLift - (index >= intent.kick.length ? 12 : 0));
  });
}

function addBackbeat(pattern, intent, macros, rng) {
  const { pocket, tone, energy } = macros;
  intent.backbeat.forEach((step, index) => {
    const instrument = tone >= 7 && index % 2 ? 'cp' : 'sd';
    hit(pattern, step, instrument, velocityFor(energy, true, rng));
    if (energy >= 8 && instrument === 'sd') hit(pattern, step, 'cp', velocityFor(energy, false, rng) - 8);
  });

  const ghostCandidates = shuffled(
    intent.backbeat.flatMap((step) => [(step - 1 + STEPS) % STEPS, (step + 1) % STEPS]),
    rng
  );
  const ghostCount = Math.max(0, Math.min(4, Math.floor((pocket - 2) / 2)));
  ghostCandidates.slice(0, ghostCount).forEach((step) => hit(pattern, step, 'sd', 34 + pocket * 3));
  if (pocket <= 2 && intent.backbeat.length > 1) {
    hit(pattern, intent.backbeat[0], 'rim', 64);
  }
}

function hatSteps(intent) {
  const quarters = [0, 4, 8, 12];
  const offbeats = [2, 6, 10, 14];
  const oddSixteenths = [1, 3, 5, 7, 9, 11, 13, 15];
  if (intent.hatMode === 'offbeat') return [...offbeats, ...quarters, ...oddSixteenths];
  if (intent.hatMode === 'sixteenths') return [0, 8, 4, 12, ...offbeats, ...oddSixteenths];
  if (intent.hatMode === 'quarters') return [...quarters, ...offbeats, ...oddSixteenths];
  return [...quarters, ...offbeats, ...oddSixteenths];
}

function addMotion(pattern, intent, macros, rng) {
  const { motion, energy } = macros;
  const orderedSteps = hatSteps(intent);
  const targetCount = Math.min(STEPS, 2 + Math.round(motion * 1.4));
  const steps = orderedSteps.slice(0, targetCount);
  steps.forEach((step) => {
    const velocity = velocityFor(energy, step % 4 === 0, rng) - 22 + motion;
    hit(pattern, step, 'ch', velocity);
  });

  const openCandidates = shuffled([2, 6, 10, 14], rng);
  const openCount = Math.min(4, Math.floor(motion / 3));
  openCandidates.slice(0, openCount).forEach((step) => {
    remove(pattern, step, 'ch');
    hit(pattern, step, 'oh', velocityFor(energy, false, rng) - 12 + motion);
  });
  const shakerCandidates = shuffled([3, 7, 11, 15, 1], rng);
  const shakerCount = Math.max(0, Math.floor((motion - 4) / 2));
  shakerCandidates.slice(0, shakerCount).forEach((step) => hit(pattern, step, 'ma', 42 + energy * 3 + motion));
}

function addColor(pattern, intent, macros, rng) {
  const { tone, energy } = macros;
  const steps = shuffled([1, 3, 5, 7, 9, 11, 13, 15, 6, 14], rng);
  const voices = intent.colorVoices || ['rim', 'cl', 'cb', 'hc', 'mc', 'lc'];
  steps.slice(0, tone).forEach((step, index) => {
    const instrument = voices[index % voices.length];
    hit(pattern, step, instrument, velocityFor(energy, false, rng) - 18 + tone);
  });
}

function addSurprise(pattern, intent, macros, rng) {
  const { surprise, energy } = macros;
  const steps = shuffled([12, 13, 14, 15, 11, 10, 7, 3, 6, 9], rng);
  const voices = intent.fillVoices || ['lt', 'mt', 'ht', 'cym', 'cr'];
  steps.slice(0, surprise).forEach((step, index) => {
    const instrument = voices[index % voices.length];
    hit(pattern, step, instrument, velocityFor(energy, index === surprise - 1, rng) - 8);
    if (instrument === 'ch' && surprise >= 6) {
      pattern.sfx1[`${step}:ch`] = { r: surprise >= 9 ? 4 : surprise >= 7 ? 3 : 2 };
    }
  });
}

function applySpace(pattern, macros, rng) {
  const { space } = macros;
  const protectedVoices = new Set(['bd', 'sd', 'cp']);
  const candidates = [];
  pattern.part1.forEach((cell, step) => {
    Object.keys(cell).forEach((instrument) => {
      if (instrument === 'accent' || protectedVoices.has(instrument)) return;
      candidates.push([step, instrument]);
    });
  });
  const ordered = shuffled(candidates, rng);
  const selected = [];
  const selectedSteps = new Set();
  ordered.forEach((candidate) => {
    if (selected.length >= space || selectedSteps.has(candidate[0])) return;
    selected.push(candidate);
    selectedSteps.add(candidate[0]);
  });
  ordered.forEach((candidate) => {
    if (selected.length >= space || selected.includes(candidate)) return;
    selected.push(candidate);
  });
  selected.forEach(([step, instrument]) => {
    remove(pattern, step, instrument);
    delete pattern.sfx1[`${step}:${instrument}`];
  });
  return [...new Set(selected.map(([step]) => step))];
}

function applyEnergy(pattern, macros, rng) {
  const ordered = [0, 4, 8, 12, 2, 6, 10, 14, 15, 7, 11, 3, 5, 9, 13, 1];
  let remaining = macros.energy;
  shuffled(ordered, rng).forEach((step) => {
    if (remaining <= 0) return;
    const cell = pattern.part1[step];
    if (Object.keys(cell).length) {
      cell.accent = true;
      remaining--;
    }
  });
}

function copyVoice(next, previous, instrument) {
  for (let step = 0; step < STEPS; step++) {
    delete next.part1[step][instrument];
    const value = previous?.part1?.[step]?.[instrument];
    if (value) next.part1[step][instrument] = value;
  }
  Object.keys(next.sfx1).forEach((key) => {
    if (key.endsWith(`:${instrument}`)) delete next.sfx1[key];
  });
  Object.entries(previous?.sfx1 || {}).forEach(([key, value]) => {
    if (key.endsWith(`:${instrument}`)) next.sfx1[key] = clone(value);
  });
}

function applyLocks(next, previous, locks) {
  if (!previous || !locks) return;
  Object.entries(GROUPS).forEach(([group, instruments]) => {
    if (!locks[group]) return;
    instruments.forEach((instrument) => copyVoice(next, previous, instrument));
  });
  if (locks.energy) {
    for (let step = 0; step < STEPS; step++) {
      delete next.part1[step].accent;
      if (previous?.part1?.[step]?.accent) next.part1[step].accent = true;
      Object.keys(next.part1[step]).forEach((instrument) => {
        const oldVelocity = previous?.part1?.[step]?.[instrument];
        if (instrument !== 'accent' && oldVelocity) next.part1[step][instrument] = oldVelocity;
      });
    }
  }
  if (locks.space) {
    const countHits = (pattern) => pattern.part1.reduce(
      (sum, cell) => sum + Object.keys(cell || {}).filter((key) => key !== 'accent').length,
      0
    );
    const target = countHits(previous);
    let current = countHits(next);
    const removable = [];
    next.part1.forEach((cell, step) => {
      Object.keys(cell).forEach((instrument) => {
        if (!['accent', 'bd', 'sd', 'cp'].includes(instrument)) removable.push([step, instrument]);
      });
    });
    while (current > target && removable.length) {
      const [step, instrument] = removable.pop();
      remove(next, step, instrument);
      delete next.sfx1[`${step}:${instrument}`];
      current--;
    }
    if (current < target) {
      previous.part1.forEach((cell, step) => {
        Object.entries(cell || {}).forEach(([instrument, velocity]) => {
          if (current >= target || instrument === 'accent' || next.part1[step][instrument]) return;
          hit(next, step, instrument, velocity);
          const oldFx = previous.sfx1?.[`${step}:${instrument}`];
          if (oldFx) next.sfx1[`${step}:${instrument}`] = clone(oldFx);
          current++;
        });
      });
    }
  }
}

function describe(macros) {
  const words = [];
  words.push(macros.pulse >= 7 ? 'driving' : macros.pulse <= 3 ? 'sparse' : 'steady');
  words.push(macros.pocket >= 7 ? 'loose pocket' : macros.pocket <= 3 ? 'tight pocket' : 'balanced pocket');
  if (macros.motion >= 7) words.push('rolling percussion');
  if (macros.space >= 7) words.push('open arrangement');
  if (macros.energy >= 8) words.push('peak energy');
  if (macros.surprise >= 7) words.push('restless fills');
  return words.join(' · ');
}

function voicePatches(macros) {
  const patches = {};
  VOICES.forEach((instrument) => {
    const isKick = instrument === 'bd';
    const isAtmospheric = ['sd', 'cp', 'rim', 'lt', 'mt', 'ht', 'hc', 'mc', 'lc', 'cb', 'cl', 'ma', 'oh', 'cym', 'cr'].includes(instrument);
    patches[instrument] = {
      tone: clamp(2.2 + macros.tone * 0.58, 0, 10),
      sendRev: clamp(macros.space * (isKick ? 0.12 : isAtmospheric ? 0.62 : 0.32), 0, 7),
      sendDly: clamp((macros.space - 3) * (isAtmospheric ? 0.34 : 0.12), 0, 3)
    };
  });
  return patches;
}

export function generateGroove(input = {}) {
  const intent = findIntent(input.intentId);
  const macros = {};
  Object.keys(DEFAULT_MACROS).forEach((key) => {
    macros[key] = Math.round(clamp(input.macros?.[key] ?? DEFAULT_MACROS[key], 0, 10));
  });
  const seed = Number.isFinite(Number(input.seed)) ? Number(input.seed) : Date.now();
  const variant = Math.max(0, Math.round(Number(input.variant) || 0));
  const rngFor = (role) => mulberry32(hashSeed(seed, variant, intent.id, role));
  const pattern = emptyPattern();

  addFoundation(pattern, intent, macros, rngFor('foundation'));
  addBackbeat(pattern, intent, macros, rngFor('backbeat'));
  addMotion(pattern, intent, macros, rngFor('motion'));
  addColor(pattern, intent, macros, rngFor('color'));
  addSurprise(pattern, intent, macros, rngFor('surprise'));
  let spaceSteps = applySpace(pattern, macros, rngFor('space'));
  applyEnergy(pattern, macros, rngFor('energy'));
  applyLocks(pattern, input.previousPattern, input.locks);
  if (input.locks?.space && Array.isArray(input.previousVisualSteps?.space)) {
    spaceSteps = input.previousVisualSteps.space.slice();
  }
  const stepsFor = (instruments) => pattern.part1.reduce((steps, cell, step) => {
    if (instruments.some((instrument) => !!cell[instrument])) steps.push(step);
    return steps;
  }, []);
  const visualSteps = {
    pulse: stepsFor(GROUPS.pulse),
    pocket: stepsFor(GROUPS.pocket),
    motion: stepsFor(GROUPS.motion),
    tone: stepsFor(GROUPS.tone),
    space: spaceSteps,
    energy: pattern.part1.reduce((steps, cell, step) => {
      if (cell.accent) steps.push(step);
      return steps;
    }, []),
    surprise: stepsFor(GROUPS.surprise)
  };

  return {
    pattern,
    visualSteps,
    bpm: Math.round(clamp(
      intent.bpm + (macros.energy - (intent.macros?.energy ?? 5)) * 1.2,
      40,
      260
    )),
    knobPatches: {
      swing: clamp(intent.swing + (macros.pocket - 5) * 0.7, 0, 10),
      humanize: clamp(macros.pocket * 0.28, 0, 3),
      polyrhythm: clamp(macros.motion * 0.25, 0, 3),
      syncopation: clamp(macros.surprise * 0.25, 0, 3),
      masterDrive: clamp(macros.energy * 0.35, 0, 4),
      masterGlue: clamp(macros.energy * 0.24, 0, 3),
      accentAmount: clamp(3 + macros.energy * 0.6, 0, 10)
    },
    voicePatches: voicePatches(macros),
    meta: {
      intentId: intent.id,
      intentLabel: intent.label,
      description: describe(macros),
      seed,
      variant
    }
  };
}

export { hashSeed, mulberry32 };
