import assert from 'node:assert/strict';
import { DEFAULTS } from '../js/audio/params.js';
import { METALLIC_FREQS } from '../js/audio/voices.js';

assert.equal(DEFAULTS.bd.freq, 49.5, '808 kick must settle near the measured bridged-T frequency');
assert.ok(DEFAULTS.bd.pitchEnvOctaves <= 1, '808 kick transient must not use an exaggerated pitch dive');
assert.deepEqual(
  [DEFAULTS.sd.freq, DEFAULTS.sd.freq2],
  [173.3, 336],
  '808 snare must use the later-schematic bridged-T pair'
);
assert.deepEqual(
  METALLIC_FREQS,
  [205.3, 304.4, 369.6, 522.7, 540, 800],
  '808 hats and cymbal must share the canonical six-oscillator metal bank'
);
assert.deepEqual(
  [DEFAULTS.cb.freq, DEFAULTS.cb.freq2],
  [540, 845],
  '808 cowbell must retain its two square-wave oscillators'
);

console.log('analog-model: canonical TR-808 circuit invariants passed');
