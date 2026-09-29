import assert from 'node:assert/strict';
import { generateGroove } from '../js/core/groove-generator.js';
import { GENERATOR_INTENTS, MOMENT_PROFILES } from '../js/data/generator-intents.js';

const macros = {
  pulse: 5,
  pocket: 5,
  motion: 5,
  tone: 5,
  space: 5,
  energy: 5,
  surprise: 5
};

function voice(pattern, instrument) {
  return pattern.part1.map((cell) => cell[instrument] || 0);
}

const first = generateGroove({ intentId: 'club-pulse', macros, seed: 42, variant: 0 });
const repeat = generateGroove({ intentId: 'club-pulse', macros, seed: 42, variant: 0 });
assert.deepEqual(first, repeat, 'same input must produce the same groove');
assert.equal(first.bpm, 120);
[0, 4, 8, 12].forEach((step) => assert.ok(first.pattern.part1[step].bd, `club kick missing at ${step}`));

const varied = generateGroove({
  intentId: 'club-pulse',
  macros: { ...macros, surprise: 9 },
  seed: 42,
  variant: 1,
  previousPattern: first.pattern,
  locks: { pulse: true }
});
assert.deepEqual(voice(varied.pattern, 'bd'), voice(first.pattern, 'bd'), 'locked pulse must preserve kick');

const countHits = (pattern) => pattern.part1.reduce(
  (sum, cell) => sum + Object.keys(cell).filter((key) => key !== 'accent').length,
  0
);
const spaceLocked = generateGroove({
  intentId: 'club-pulse',
  macros: { ...macros, tone: 10, motion: 10, surprise: 10 },
  seed: 42,
  variant: 3,
  previousPattern: first.pattern,
  locks: { space: true }
});
assert.equal(countHits(spaceLocked.pattern), countHits(first.pattern), 'locked space must preserve density');

for (const intent of GENERATOR_INTENTS) {
  assert.deepEqual(
    Object.keys(intent.macros).sort(),
    Object.keys(macros).sort(),
    `${intent.id} must shape every macro`
  );
  Object.values(intent.macros).forEach((value) => {
    assert.ok(value >= 0 && value <= 10, `${intent.id} macro outside 0–10`);
  });
  assert.ok(intent.suno.length > 20, `${intent.id} needs useful Suno direction`);
  const result = generateGroove({ intentId: intent.id, macros: intent.macros, seed: 123, variant: 0 });
  assert.equal(result.bpm, intent.bpm, `${intent.id} recipe must land on its advertised BPM`);
  const hits = result.pattern.part1.reduce(
    (sum, cell) => sum + Object.keys(cell).filter((key) => key !== 'accent').length,
    0
  );
  assert.ok(hits >= 5, `${intent.id} should create a usable groove`);
  result.pattern.part1.forEach((cell) => {
    Object.entries(cell).forEach(([key, value]) => {
      if (key !== 'accent') assert.ok(value >= 1 && value <= 127, `${intent.id} velocity out of range`);
    });
  });
}
const intentSignatures = new Set(GENERATOR_INTENTS.map((intent) => JSON.stringify(
  generateGroove({ intentId: intent.id, macros: intent.macros, seed: 123, variant: 0 })
)));
assert.equal(intentSignatures.size, GENERATOR_INTENTS.length, 'every musical direction must create a distinct recipe');

for (const moment of MOMENT_PROFILES) {
  assert.deepEqual(
    Object.keys(moment.macros).sort(),
    Object.keys(macros).sort(),
    `${moment.id} must define every macro`
  );
  Object.values(moment.macros).forEach((value) => assert.ok(value >= 0 && value <= 10));
}

for (const macro of Object.keys(macros)) {
  const signatures = new Set();
  for (let value = 0; value <= 10; value++) {
    const result = generateGroove({
      intentId: 'night-drive',
      macros: { ...macros, [macro]: value },
      seed: 90210,
      variant: 2
    });
    signatures.add(JSON.stringify(result));
  }
  assert.equal(signatures.size, 11, `${macro} must produce a distinct result at every slider step`);
}

const colorFour = generateGroove({ intentId: 'night-drive', macros: { ...macros, tone: 4 }, seed: 99, variant: 1 });
const colorFive = generateGroove({ intentId: 'night-drive', macros: { ...macros, tone: 5 }, seed: 99, variant: 1 });
assert.deepEqual(voice(colorFour.pattern, 'bd'), voice(colorFive.pattern, 'bd'), 'color must not reroll the kick layer');

const causalBase = generateGroove({ intentId: 'night-drive', macros, seed: 808, variant: 3 });
const kickPresence = (pattern) => voice(pattern, 'bd').map(Boolean);
for (const macro of ['pocket', 'motion', 'tone', 'space', 'energy', 'surprise']) {
  const changed = generateGroove({
    intentId: 'night-drive',
    macros: { ...macros, [macro]: macros[macro] === 10 ? 9 : macros[macro] + 1 },
    seed: 808,
    variant: 3
  });
  assert.deepEqual(
    kickPresence(changed.pattern),
    kickPresence(causalBase.pattern),
    `${macro} must not reroll kick placement`
  );
}

const countMotionHits = (pattern) => pattern.part1.reduce(
  (sum, cell) => sum + ['ch', 'oh', 'ma'].filter((instrument) => !!cell[instrument]).length,
  0
);
for (const intent of GENERATOR_INTENTS) {
  const isolated = { ...macros, space: 0, surprise: 0 };
  const lowMotion = generateGroove({
    intentId: intent.id,
    macros: { ...isolated, motion: 2 },
    seed: 314,
    variant: 0
  });
  const highMotion = generateGroove({
    intentId: intent.id,
    macros: { ...isolated, motion: 10 },
    seed: 314,
    variant: 0
  });
  const lowCount = countMotionHits(lowMotion.pattern);
  const highCount = countMotionHits(highMotion.pattern);
  assert.ok(lowCount <= 5, `${intent.id} low Motion must remain sparse, got ${lowCount} hits`);
  assert.ok(highCount > lowCount, `${intent.id} high Motion must add visible movement`);
}

const variationMacros = {
  pulse: 8,
  pocket: 8,
  motion: 8,
  tone: 8,
  space: 8,
  energy: 8,
  surprise: 8
};
const variationA = generateGroove({
  intentId: 'night-drive',
  macros: variationMacros,
  seed: 123,
  variant: 0
});
const variationB = generateGroove({
  intentId: 'night-drive',
  macros: variationMacros,
  seed: 123,
  variant: 1
});
for (const macro of Object.keys(variationMacros)) {
  assert.notDeepEqual(
    variationA.visualSteps[macro],
    variationB.visualSteps[macro],
    `${macro} must show a visible change between variations`
  );
}

console.log(`groove-generator: ${GENERATOR_INTENTS.length} intents and ${MOMENT_PROFILES.length} moments passed`);
