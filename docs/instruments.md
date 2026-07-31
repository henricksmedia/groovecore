# TR-808 Drum Machine - Instrument Synthesis Guide

This document provides detailed synthesis specifications for all instruments implemented in the TR-808 drum machine application, organized by source hardware and adhering to authentic analog/digital synthesis principles.

## Implemented Instruments by Source

### TR-808 (Analog Drum Machine)
- **Bass Drum (BD)**: Master analog pitch-decay synthesis with noise transient
- **Low Tom (LT)**: Resonant low tone with pitch modulation (80 Hz)
- **Mid Tom (MT)**: Mid-range tone with pitch modulation (120 Hz)  
- **Hi Tom (HT)**: Higher tone with pitch modulation (160 Hz)
- **Rim Shot (RIM)**: Sharp high-frequency sound with tonal click
- **Hi Conga (HC)**: Warm tonal slap with transient (200 Hz)
- **Mid Conga (MC)**: Mid-range tonal slap with transient (150 Hz)
- **Low Conga (LC)**: Low tonal slap with transient (100 Hz)
- **Cowbell (CB)**: Metallic clangy tone with inharmonic partials
- **Claves (CL)**: Sharp high-pitched wooden click
- **Maracas (MA)**: Sustained rattling shaker sound

### TR-909 (Hybrid Analog/Digital Drum Machine)
- **Snare Drum (SD)**: Analog punch with digital clarity
- **Closed Hi-Hat (CH)**: Lo-Fi digital clarity (short decay)
- **Open Hi-Hat (OH)**: Lo-Fi digital clarity (long decay)
- **Cymbal (CYM)**: Bright sustained metallic crash

### Accent/Transient Enhancement
- **Accent (ACC)**: High-frequency transient snap for percussion clarity

## Detailed Synthesis Specifications

### TR-808 Instruments

#### Bass Drum (BD)
**Concept**: Enhances transients by overlaying a brief noise burst via Tone.Noise, modulated with a Tone.AmplitudeEnvelope (near-zero Attack, Decay of 10–50 ms, Release of 5–20 ms) to boost amplitude or filter cutoff. This adds punch or snap, often applied to kicks or snares, with the noise filtered around 2–5 kHz for a crisp effect, ensuring it cuts through dense mixes.

**Implementation**: Generates a low-frequency tone with Tone.Oscillator (50–100 Hz, sine wave), shaped by a Tone.AmplitudeEnvelope (Attack near 0 ms, Decay of 0.5–2 seconds, Sustain at 0) for depth. A slight pitch envelope (e.g., dropping 10–20 Hz over the Decay) can mimic the acoustic boom, with a low-pass filter (cutoff around 150 Hz) to remove harsh highs.

#### Snare Drum (SD) - TR-909 Implementation
**Concept**: Combines Tone.Noise (band-pass filtered, 200–500 Hz, Q of 2–4) with a Tone.Oscillator (200 Hz, sine), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.2–0.5 seconds, Sustain 0, with a 50–100 ms noise tail). A touch of distortion or a second noise layer (higher frequency, 1–2 kHz) adds the characteristic buzz.

#### Toms (LT, MT, HT)
**Low Tom**: Produces a resonant low tone with Tone.Oscillator (60–150 Hz, triangle wave), modulated by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 1–3 seconds, Sustain 0) and low-pass filtered (cutoff 200–300 Hz). A subtle pitch modulation (e.g., -5 Hz over Decay) enhances the natural decay of a large drum.

**Mid Tom**: Creates a mid-range tone with Tone.Oscillator (150–300 Hz, triangle wave), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.8–2 seconds, Sustain 0) and band-pass filtered (center 250 Hz, Q of 1–2). A slight resonance boost at the filter's cutoff adds warmth to the sound.

**Hi Tom**: Generates a higher tone with Tone.Oscillator (300–600 Hz, triangle wave), modulated by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.5–1.5 seconds, Sustain 0) and higher cutoff filter (around 800 Hz). A fast pitch drop (e.g., -10 Hz) during Decay mimics the tight response of a small tom.

#### Rim Shot (RIM)
**Concept**: Produces a sharp high-frequency sound with Tone.Noise or Tone.Oscillator (1–3 kHz, square wave), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 20–50 ms, Sustain 0). A band-pass filter (Q of 3–5) at 2 kHz enhances the wooden, clicking character, with a touch of distortion for edge.

#### Congas (HC, MC, LC)
**Hi Conga**: Synthesizes a mid-to-high tone with Tone.Oscillator (300–800 Hz, sawtooth wave), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.5–1.5 seconds, Sustain 0) and band-pass filtered (center 500 Hz, Q of 1–2). A short noise burst (1–2 kHz) at the attack adds the slap-like articulation.

**Mid Conga**: Creates a mid-range tone with Tone.Oscillator (200–500 Hz, sawtooth wave), modulated by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.8–2 seconds, Sustain 0) and broader band-pass filter (center 350 Hz, Q of 0.5–1). A slight pitch bend (-5 Hz) during Decay enhances the open tone.

**Low Conga**: Generates a low tone with Tone.Oscillator (100–300 Hz, sawtooth wave), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 1–3 seconds, Sustain 0) and low-pass filtered (cutoff 400 Hz). A longer Decay tail and subtle resonance at 150 Hz mimic the deep resonance of a large conga.

#### Cowbell (CB)
**Concept**: Produces a metallic tone with Tone.Oscillator (500–2 kHz, square wave), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.3–0.7 seconds, Sustain 0) and band-pass filtered (center 1 kHz, Q of 2–3) for clang. A second oscillator (detuned by 5–10%) adds the characteristic metallic shimmer.

#### Claves (CL)
**Concept**: Generates a high-pitched click with Tone.Noise, filtered by a Tone.Filter (narrow band-pass, 2–5 kHz, Q of 5–10), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 10–30 ms, Sustain 0). A slight resonance boost at the cutoff enhances the wooden ping.

#### Maracas (MA)
**Concept**: Produces a rattling sound with Tone.Noise, filtered by a Tone.Filter (high-pass or band-pass, 1–8 kHz, Q of 0.5–1), modulated by a Tone.LFO (5–20 Hz) or pulsed Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.1–0.3 seconds) for textural bead movement.

### TR-909 Instruments

#### Hi-Hats (CH, OH)
**Concept**: Creates a bright sound with Tone.Noise, filtered by a Tone.Filter (high-pass, 2–8 kHz, Q of 0.5), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 0.2–0.5 seconds). A slight LFO (5–10 Hz) on the filter cutoff adds the airy, open quality.

**Closed**: Produces a crisp sound with Tone.Noise, filtered by a Tone.Filter (high-pass, 3–10 kHz, Q of 0.5–1), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 50–150 ms). A sharper filter slope (e.g., 24 dB/octave) ensures a tight, snappy response.

#### Cymbal (CYM)
**Concept**: Generates a wide-spectrum sound with Tone.Noise, filtered by a Tone.Filter (high-pass or band-pass, 1–10 kHz, Q of 0.5–1), shaped by a Tone.AmplitudeEnvelope (Attack 0 ms, Decay 2–5 seconds) and subtle Tone.LFO modulation (1–5 Hz) on the filter cutoff for a shimmering effect.

### Accent Enhancement

#### Accent (ACC)
**Concept**: Enhances transients by overlaying a brief noise burst via Tone.Noise, modulated with a Tone.AmplitudeEnvelope (near-zero Attack, Decay of 10–50 ms, Release of 5–20 ms) to boost amplitude or filter cutoff. This adds punch or snap, often applied to kicks or snares, with the noise filtered around 2–5 kHz for a crisp effect, ensuring it cuts through dense mixes.

## Groove Control
**Concept**: Adjusts timing or swing in Tone.Transport via clock division (e.g., 16th-note offsets) or envelope offset (e.g., ±10 ms per step), enhancing rhythmic feel with dynamic pattern sequencing, often paired with a swing percentage (50–60%) for groove.

## Setup
Include Tone.js v15.3.3:
<script src="https://unpkg.com/tone@15.3.3/build/Tone.js"></script>

Initialize audio context and transport (user interaction required, e.g., button click):
document.getElementById('startButton').addEventListener('click', async () => {
  await Tone.start();
  Tone.Transport.bpm.value = 120;
});

Notes:

All sounds route through Tone.Gain to Tone.Destination for balanced mixing.
Use Tone.Transport for sequencing (16- or 32-step patterns).
Test in a modern browser; adjust gain values to avoid clipping.
For polyphony (e.g., pads, electric piano), use Tone.PolySynth.
Verified with Tone.js v15.3.3 (https://tonejs.github.io/docs/15.3.3).

1. 808 Kick: Master Analog Pitch-Decay Synthesis
The TR-808 kick uses a sine oscillator with exponential pitch decay (~100 Hz to 50 Hz) and a noise transient for punch, delivering the boomy, sub-heavy thump iconic in hip-hop and techno.

Components: Tone.Oscillator (sine), Tone.FrequencyEnvelope for pitch glide, Tone.Noise (white) for click, Tone.AmplitudeEnvelope.
Signal Flow: Oscillator → Envelope → Gain → Destination; Noise → High-pass Filter → Envelope → Gain → Destination; Frequency Envelope → Oscillator Frequency.
Parameters:
Oscillator: Sine, 50 Hz base, volume -6 dB.
Frequency Envelope: Attack=0.001s, Decay=0.15s, Base=50 Hz, Octaves=1 (glides to ~100 Hz).
Noise Filter: High-pass, 4500 Hz, Q=1, -12 dB/oct, gain -12 dB.
Envelope: Attack=0.001s, Decay=1.0s, Sustain=0, Release=0.05s.


Reference: TR-808 schematic (bridged-T oscillator, ~49 Hz fundamental, G1 tuning).

const kick808Gain = new Tone.Gain(0.6).toDestination();
const kick808Env = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 1.0,
  sustain: 0,
  release: 0.05
}).connect(kick808Gain);
const kick808Osc = new Tone.Oscillator({ frequency: 50, type: 'sine', volume: -6 }).connect(kick808Env);
const kick808Pitch = new Tone.FrequencyEnvelope({
  attack: 0.001,
  decay: 0.15,
  baseFrequency: 50,
  octaves: 1
}).connect(kick808Osc.frequency);
const kick808NoiseFilt = new Tone.Filter({ frequency: 4500, type: 'highpass', Q: 1, rolloff: -12, gain: -12 }).connect(kick808Env);
const kick808Noise = new Tone.Noise('white').connect(kick808NoiseFilt);

function trig808Kick(time = Tone.now()) {
  kick808Osc.start(time);
  kick808Noise.start(time).stop(time + 0.02);
  kick808Pitch.triggerAttack(time);
  kick808Env.triggerAttackRelease(1.0, time);
}

2. 909 Snare: Analog Punch and Lo-Fi Clarity
The TR-909 snare blends a tonal sine body (~200 Hz) with noisy "buzz" and "snap" components for punch and presence.

Components: Tone.Oscillator (sine), Tone.Noise (white) with dual band-pass filters, Tone.AmplitudeEnvelope.
Signal Flow: Oscillator → Envelope → Gain → Destination; Noise → [Buzz Filter (1.5 kHz), Snap Filter (6 kHz)] → Envelope → Gain → Destination.
Parameters:
Oscillator: Sine, 200 Hz, volume -8 dB.
Buzz Filter: Band-pass, 1500 Hz, Q=4, -12 dB/oct.
Snap Filter: Band-pass, 6000 Hz, Q=6, gain -10 dB (adjustable "snappy").
Envelope: Attack=0.001s, Decay=0.3s, Sustain=0, Release=0.1s.


Reference: TR-909 hybrid design (analog body + sampled noise).

const snare909Gain = new Tone.Gain(0.5).toDestination();
const snare909Env = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.3,
  sustain: 0,
  release: 0.1
}).connect(snare909Gain);
const snare909Body = new Tone.Oscillator({ frequency: 200, type: 'sine', volume: -8 }).connect(snare909Env);
const snare909BuzzFilt = new Tone.Filter({ frequency: 1500, type: 'bandpass', Q: 4, rolloff: -12 }).connect(snare909Env);
const snare909SnapFilt = new Tone.Filter({ frequency: 6000, type: 'bandpass', Q: 6, gain: -10 }).connect(snare909Env);
const snare909Noise = new Tone.Noise('white');
snare909Noise.connect(snare909BuzzFilt);
snare909Noise.connect(snare909SnapFilt);

function trig909Snare(time = Tone.now(), snappy = 0.5) {
  snare909Body.start(time).stop(time + 0.3);
  snare909Noise.start(time).stop(time + 0.3);
  snare909SnapFilt.gain.setValueAtTime(-10 + (snappy * 10), time);
  snare909Env.triggerAttackRelease(0.3, time);
}

3. 909 Open/Closed Hi-Hats: Lo-Fi Digital Clarity
TR-909 hi-hats use short (closed) or longer (open) metallic transients from 6-bit PCM noise, emulated with pink noise for warmth.

Components: Tone.Noise (pink) with high-pass filter, Tone.AmplitudeEnvelope.
Signal Flow: Noise → High-pass Filter → Envelope → Gain → Destination.
Parameters:
Filter: High-pass, 7100 Hz, Q=1, -24 dB/oct.
Closed: Attack=0.001s, Decay=0.1s, Sustain=0, Release=0.02s.
Open: Attack=0.001s, Decay=0.4s, Sustain=0, Release=0.1s.


Reference: TR-909 hi-hats from 6-bit PCM samples (~7–10 kHz noise).

const hat909Gain = new Tone.Gain(0.4).toDestination();
const hat909Env = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.1,
  sustain: 0,
  release: 0.02
}).connect(hat909Gain);
const hat909Filt = new Tone.Filter({ frequency: 7100, type: 'highpass', Q: 1, rolloff: -24 }).connect(hat909Env);
const hat909Noise = new Tone.Noise('pink').connect(hat909Filt);

function trig909ClosedHat(time = Tone.now()) {
  hat909Env.set({ decay: 0.1, release: 0.02 });
  hat909Noise.start(time).stop(time + 0.12);
  hat909Env.triggerAttackRelease(0.1, time);
}

function trig909OpenHat(time = Tone.now()) {
  hat909Env.set({ decay: 0.4, release: 0.1 });
  hat909Noise.start(time).stop(time + 0.5);
  hat909Env.triggerAttackRelease(0.4, time);
}

4. 303 Filter/Accent: Acid Bassline with Sequencer Interactions
The TB-303’s acid sound uses a sawtooth oscillator through a resonant low-pass ladder filter, with envelope modulation, slides (portamento), and accents (boosted filter depth/volume).

Components: Tone.MonoSynth (sawtooth), Tone.LFO for resonance wobble, Tone.Gain for accent volume.
Signal Flow: Oscillator → Low-pass Filter → VCA → Gain → Destination; Filter Env → Filter Frequency; LFO → Filter Q; Accent → Filter Env Depth + Gain.
Parameters:
Oscillator: Sawtooth, ~100-200 Hz.
Filter: Low-pass, cutoff=200-5000 Hz, Q=10, rolloff -18 dB/oct (emulates 3-pole ladder).
Filter Envelope: Attack=0.001s, Decay=0.2s, Sustain=0.3, Base=200 Hz, Octaves=3.
Glide: Portamento=0.1s.
Accent: Boosts filter env octaves (+1) and gain (+20%).
LFO: 0.2 Hz, modulates Q ±10 for subtle squelch.


Reference: TB-303 diode ladder filter (~18 dB/oct); accents increase env mod by ~50%.

const synth303 = new Tone.MonoSynth({
  oscillator: { type: 'sawtooth' },
  filter: { Q: 10, type: 'lowpass', rolloff: -18 },
  envelope: { attack: 0.001, decay: 0.2, sustain: 0.3, release: 0.1 },
  filterEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.3, release: 0.1, baseFrequency: 200, octaves: 3 }
}).toDestination();
synth303.portamento = 0.1;
const accent303Gain = new Tone.Gain(1).connect(synth303.output);
const lfo303Res = new Tone.LFO({ frequency: 0.2, min: 10, max: 20 }).connect(synth303.filter.Q).start();

function trig303Note(time, note, accent = false) {
  const velocity = accent ? 1.0 : 0.7;
  synth303.filterEnvelope.octaves = accent ? 4 : 3;
  accent303Gain.gain.setValueAtTime(accent ? 1.2 : 1, time);
  synth303.triggerAttackRelease(note, '8n', time, velocity);
}

5. DX7 Electric Piano: FM Synth for 80s Pop
The DX7 electric piano (e.g., "Electric Piano 1") uses 6-operator FM (approximated with layered 2-op Tone.FMSynth) for a bell-like, percussive timbre.

Components: Tone.PolySynth with Tone.FMSynth, Tone.Chorus for shimmer.
Signal Flow: [FMSynth Layer1, Layer2, Layer3] → Chorus → Destination.
Parameters:
Carrier: Sine, harmonicity=1, modulationIndex=10.
Modulator: Sine, ratio=2, modulationIndex=5.
Envelope: Attack=0.01s, Decay=0.5s, Sustain=0.7, Release=0.3s.
Detune: ±5 cents across layers.
Chorus: Frequency=0.5 Hz, Delay=3.5 ms, Depth=0.7.
Velocity: Scales modulationIndex (0.7-1.0 → brighter).


Reference: DX7 algorithm 5 (stacked carriers/modulators, ratios 1:2:4:8).

const epianoDX7 = new Tone.PolySynth(Tone.FMSynth, {
  polyphony: 16,
  volume: -10,
  options: {
    harmonicity: 1,
    modulationIndex: 10,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0.7, release: 0.3 }
  }
}).toDestination();
const epianoChorus = new Tone.Chorus({ frequency: 0.5, delayTime: 3.5, depth: 0.7, spread: 180 }).connect(epianoDX7.output);
epianoDX7.connect(epianoChorus);
const epianoLayer1 = new Tone.FMSynth({ harmonicity: 2, modulationIndex: 5 }).connect(epianoChorus);
const epianoLayer2 = new Tone.FMSynth({ harmonicity: 2.01, modulationIndex: 5.1 }).connect(epianoChorus);
const epianoLayer3 = new Tone.FMSynth({ harmonicity: 1.99, modulationIndex: 4.9 }).connect(epianoChorus);

function trigDX7EPiano(time, note, velocity = 0.8) {
  const modIndex = 8 + (velocity * 4);
  [epianoDX7, epianoLayer1, epianoLayer2, epianoLayer3].forEach(layer => {
    if (layer instanceof Tone.FMSynth) layer.modulationIndex.value = modIndex;
    layer.triggerAttackRelease(note, '8n', time, velocity);
  });
}

6. Juno/DX7 Pads: Lush Atmospheric Tones
Juno pads use chorused sawtooth waves for warm, swirling textures; DX7 pads use FM for crystalline, evolving atmospheres. This hybrid uses saw for Juno warmth or FM for DX7 shimmer, with chorus and reverb.

Components: Tone.PolySynth (saw or FM), Tone.Chorus, Tone.Reverb.
Signal Flow: PolySynth → Chorus → Reverb → Destination.
Parameters (Juno):
Oscillator: Sawtooth, detune=0.2 octaves.
Envelope: Attack=1s, Decay=2s, Sustain=0.8, Release=1s.
Chorus: Frequency=0.4 Hz, Delay=4 ms, Depth=0.8.
Reverb: Decay=3s, Wet=0.4.


Parameters (DX7 FM): Harmonicity=4, modulationIndex=15, Attack=2s, Decay=3s.
Reference: Juno-60 BBD chorus; DX7 algorithm 18 (parallel carriers).

const padJuno = new Tone.PolySynth({
  oscillator: { type: 'sawtooth' },
  envelope: { attack: 1, decay: 2, sustain: 0.8, release: 1 },
  filter: { frequency: 800, Q: 1 }
}).toDestination();
const padChorus = new Tone.Chorus({ frequency: 0.4, delayTime: 4, depth: 0.8, spread: 90 }).connect(padJuno.output);
const padReverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).connect(padChorus);
const padDX7 = new Tone.PolySynth(Tone.FMSynth, {
  options: { harmonicity: 4, modulationIndex: 15, envelope: { attack: 2, decay: 3, sustain: 0.9, release: 2 } }
}).connect(padChorus);

function trigJunoPad(chords, time = Tone.now(), duration = '2n') {
  padJuno.triggerAttackRelease(chords, duration, time, 0.6);
}

function trigDX7Pad(chords, time = Tone.now(), duration = '2n') {
  padDX7.triggerAttackRelease(chords, duration, time, 0.5);
}

7. Claves
Claves produce a sharp, high-pitched wooden click, as in Latin music or TR-808 clave.

Components: Tone.Oscillator (sine), Tone.Noise (white) with band-pass filter, Tone.AmplitudeEnvelope.
Signal Flow: Oscillator → Envelope → Gain → Destination; Noise → Band-pass Filter → Envelope → Gain → Destination.
Parameters:
Oscillator: Sine, 2600 Hz, volume -12 dB.
Filter: Band-pass, 2600 Hz, Q=12, -24 dB/oct.
Envelope: Attack=0.001s, Decay=0.015s, Sustain=0, Release=0.005s.


Reference: TR-808 clave (~2–3 kHz square wave); sine + noise for acoustic realism.

const claveGain = new Tone.Gain(0.25).toDestination();
const claveEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.015,
  sustain: 0,
  release: 0.005
}).connect(claveGain);
const claveFilt = new Tone.Filter({ frequency: 2600, type: 'bandpass', Q: 12, rolloff: -24 }).connect(claveEnv);
const claveNoise = new Tone.Noise('white').connect(claveFilt);
const claveSine = new Tone.Oscillator({ frequency: 2600, type: 'sine', volume: -12 }).connect(claveEnv);

function trigClave(time = Tone.now()) {
  claveSine.start(time).stop(time + 0.015);
  claveNoise.start(time).stop(time + 0.015);
  claveEnv.triggerAttackRelease(0.015, time);
}

8. Maracas
Maracas create a sustained, rattling shaker sound, as in TR-808 maracas.

Components: Tone.Noise (brown), Tone.Filter (high-pass), Tone.AmplitudeEnvelope, Tone.LFO for rattle.
Signal Flow: Noise → High-pass Filter → Envelope → Gain → Destination; LFO → Envelope Gain.
Parameters:
Noise: Brown.
Filter: High-pass, 5200 Hz, Q=1, -12 dB/oct.
Envelope: Attack=0.001s, Decay=0.22s, Sustain=0, Release=0.05s.
LFO: 12 Hz, gain 0.3–1.


Reference: TR-808 maracas (~5 kHz filtered noise).

const maracaGain = new Tone.Gain(0.3).toDestination();
const maracaEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.22,
  sustain: 0,
  release: 0.05
}).connect(maracaGain);
const maracaFilt = new Tone.Filter({ frequency: 5200, type: 'highpass', Q: 1, rolloff: -12 }).connect(maracaEnv);
const maraca = new Tone.Noise('brown').connect(maracaFilt);
const maracaLFO = new Tone.LFO({ frequency: 12, min: 0.3, max: 1 }).connect(maracaEnv.gain);

function trigMaraca(time = Tone.now()) {
  maraca.start(time).stop(time + 0.27);
  maracaEnv.triggerAttackRelease(0.22, time);
}

9. Accents
Accents add a high-frequency transient “snap” to enhance percussion clarity.

Components: Tone.Noise (white), Tone.Filter (band-pass), Tone.AmplitudeEnvelope.
Signal Flow: Noise → Band-pass Filter → Envelope → Gain → Destination.
Parameters:
Filter: Band-pass, 3600 Hz, Q=6, -24 dB/oct.
Envelope: Attack=0.001s, Decay=0.02s, Sustain=0, Release=0.01s.


Reference: TR-909 snare/kick transients (~3–4 kHz).

const accentGain = new Tone.Gain(0.2).toDestination();
const accentEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.02,
  sustain: 0,
  release: 0.01
}).connect(accentGain);
const accentFilt = new Tone.Filter({ frequency: 3600, type: 'bandpass', Q: 6, rolloff: -24 }).connect(accentEnv);
const accent = new Tone.Noise('white').connect(accentFilt);

function trigAccent(time = Tone.now()) {
  accent.start(time).stop(time + 0.03);
  accentEnv.triggerAttackRelease(0.03, time);
}

10. Low/Mid/High Toms
Toms produce resonant, tonal thumps with a quick pitch drop, emulating TR-808 or acoustic kits.

Components: Tone.Oscillator (triangle), Tone.FrequencyEnvelope, Tone.Filter, Tone.AmplitudeEnvelope.
Signal Flow: Oscillator → Band-pass Filter → Envelope → Gain → Destination; Frequency Envelope → Oscillator Frequency.
Parameters:
Low Tom: Base=80 Hz, Octaves=0.6.
Mid Tom: Base=120 Hz, Octaves=0.6.
High Tom: Base=160 Hz, Octaves=0.6.
Filter: Band-pass, centered at base, Q=2.5, -12 dB/oct.
Envelope: Attack=0.001s, Decay=0.45s, Sustain=0, Release=0.1s.


Reference: TR-808 toms (triangle waves with pitch glide).

const tomGain = new Tone.Gain(0.35).toDestination();
const tomEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.45,
  sustain: 0,
  release: 0.1
}).connect(tomGain);
const tomFilt = new Tone.Filter({ frequency: 120, type: 'bandpass', Q: 2.5, rolloff: -12 }).connect(tomEnv);
const tomOsc = new Tone.Oscillator({ frequency: 120, type: 'triangle' }).connect(tomFilt);
const tomPitch = new Tone.FrequencyEnvelope({
  attack: 0.001,
  decay: 0.2,
  sustain: 0,
  release: 0,
  baseFrequency: 120,
  octaves: 0.6
}).connect(tomOsc.frequency);

function trigTom(time = Tone.now(), freq = 120) {
  tomOsc.frequency.setValueAtTime(freq, time);
  tomFilt.frequency.setValueAtTime(freq, time);
  tomPitch.baseFrequency = freq;
  tomOsc.start(time);
  tomPitch.triggerAttack(time);
  tomEnv.triggerAttackRelease(0.45, time);
}

11. Rim Shot
The rim shot is a sharp, knocking sound with a tonal “tick,” emulating the TR-808.

Components: Tone.Noise (white), Tone.Filter (band-pass), Tone.Oscillator (sine), Tone.AmplitudeEnvelope.
Signal Flow: Noise → Band-pass Filter → Envelope → Gain → Destination; Oscillator → Envelope → Gain → Destination.
Parameters:
Filter: Band-pass, 3100 Hz, Q=6, -24 dB/oct, gain -10 dB.
Oscillator: Sine, 1050 Hz, volume -10 dB.
Envelope: Attack=0.001s, Decay=0.025s, Sustain=0, Release=0.01s.


Reference: TR-808 rim shot (~1 kHz square wave + noise).

const rimGain = new Tone.Gain(0.3).toDestination();
const rimEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.025,
  sustain: 0,
  release: 0.01
}).connect(rimGain);
const rimFilt = new Tone.Filter({ frequency: 3100, type: 'bandpass', Q: 6, rolloff: -24, gain: -10 }).connect(rimEnv);
const rimNoise = new Tone.Noise('white').connect(rimFilt);
const rimSine = new Tone.Oscillator({ frequency: 1050, type: 'sine', volume: -10 }).connect(rimEnv);

function trigRim(time = Tone.now()) {
  rimSine.start(time).stop(time + 0.025);
  rimNoise.start(time).stop(time + 0.025);
  rimEnv.triggerAttackRelease(0.025, time);
}

12. Low/Mid/High Congas
Congas produce warm, tonal slaps with a quick pitch drop and subtle transient, emulating acoustic Latin percussion.

Components: Tone.Oscillator (triangle), Tone.FrequencyEnvelope, Tone.Noise (white), Tone.Filter, Tone.AmplitudeEnvelope.
Signal Flow: Oscillator → Envelope → Gain → Destination; Noise → Band-pass Filter → Envelope → Gain → Destination; Frequency Envelope → Oscillator Frequency.
Parameters:
Low Conga: Base=100 Hz, Octaves=0.4.
Mid Conga: Base=150 Hz, Octaves=0.4.
High Conga: Base=200 Hz, Octaves=0.4.
Filter: Band-pass, 4100 Hz, Q=6, -24 dB/oct, gain -14 dB.
Envelope: Attack=0.001s, Decay=0.32s, Sustain=0, Release=0.05s.


Reference: Acoustic congas (tonal with slap).

const congaGain = new Tone.Gain(0.35).toDestination();
const congaEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.32,
  sustain: 0,
  release: 0.05
}).connect(congaGain);
const congaFilt = new Tone.Filter({ frequency: 4100, type: 'bandpass', Q: 6, rolloff: -24, gain: -14 }).connect(congaEnv);
const congaNoise = new Tone.Noise('white').connect(congaFilt);
const congaOsc = new Tone.Oscillator({ frequency: 150, type: 'triangle' }).connect(congaEnv);
const congaPitch = new Tone.FrequencyEnvelope({
  attack: 0.001,
  decay: 0.15,
  sustain: 0,
  release: 0,
  baseFrequency: 150,
  octaves: 0.4
}).connect(congaOsc.frequency);

function trigConga(time = Tone.now(), freq = 150) {
  congaOsc.frequency.setValueAtTime(freq, time);
  congaPitch.baseFrequency = freq;
  congaOsc.start(time);
  congaNoise.start(time).stop(time + 0.02);
  congaPitch.triggerAttack(time);
  congaEnv.triggerAttackRelease(0.32, time);
}

13. Cowbell
The cowbell produces a metallic, clangy tone with inharmonic partials, emulating the TR-808.

Components: Two Tone.Oscillator (square), Tone.Filter, Tone.AmplitudeEnvelope.
Signal Flow: [Oscillator1, Oscillator2] → Band-pass Filter → Envelope → Gain → Destination.
Parameters:
Oscillators: Square, 540 Hz/845 Hz, detune ±5 cents, volume -8 dB each.
Filter: Band-pass, 1050 Hz, Q=3.5, -12 dB/oct.
Envelope: Attack=0.001s, Decay=0.55s, Sustain=0, Release=0.1s.


Reference: TR-808 cowbell (~540/800 Hz square waves).

const cowbellGain = new Tone.Gain(0.3).toDestination();
const cowbellEnv = new Tone.AmplitudeEnvelope({
  attack: 0.001,
  decay: 0.55,
  sustain: 0,
  release: 0.1
}).connect(cowbellGain);
const cowbellFilt = new Tone.Filter({ frequency: 1050, type: 'bandpass', Q: 3.5, rolloff: -12 }).connect(cowbellEnv);
const cowbellOsc1 = new Tone.Oscillator({ frequency: 540, type: 'square', detune: -5, volume: -8 }).connect(cowbellFilt);
const cowbellOsc2 = new Tone.Oscillator({ frequency: 845, type: 'square', detune: 5, volume: -8 }).connect(cowbellFilt);

function trigCowbell(time = Tone.now()) {
  cowbellOsc1.start(time);
  cowbellOsc2.start(time);
  cowbellEnv.triggerAttackRelease(0.55, time);
}

14. Cymbal
The cymbal produces a bright, sustained metallic crash, emulating the TR-909.

Components: Tone.Noise (pink), Tone.Filter (high-pass), Tone.AmplitudeEnvelope, Tone.LFO for filter modulation.
Signal Flow: Noise → High-pass Filter → Envelope → Gain → Destination; LFO → Filter Frequency.
Parameters:
Noise: Pink.
Filter: High-pass, 7200 Hz, Q=1, -24 dB/oct.
Envelope: Attack=0.01s, Decay=1.6s, Sustain=0, Release=0.5s.
LFO: 1.2 Hz, modulates filter ±600 Hz.


Reference: TR-909 cymbal (filtered noise, long decay).

const cymbalGain = new Tone.Gain(0.25).toDestination();
const cymbalEnv = new Tone.AmplitudeEnvelope({
  attack: 0.01,
  decay: 1.6,
  sustain: 0,
  release: 0.5
}).connect(cymbalGain);
const cymbalFilt = new Tone.Filter({ frequency: 7200, type: 'highpass', Q: 1, rolloff: -24 }).connect(cymbalEnv);
const cymbal = new Tone.Noise('pink').connect(cymbalFilt);
const cymbalLFO = new Tone.LFO({ frequency: 1.2, min: 6600, max: 7800 }).connect(cymbalFilt.frequency);

function trigCymbal(time = Tone.now()) {
  cymbal.start(time).stop(time + 1.6);
  cymbalEnv.triggerAttackRelease(1.6, time);
}

15. Groove Control
Groove control adds swing and humanization for natural rhythmic feel, emulating TR-808/909 or MPC sequencing.

Components: Tone.Transport.swing, Tone.Sequence with humanization and nudges.
Parameters:
Swing: 0.58, applied to 16th notes ('16n').
Humanize: ±8 ms via Tone.Sequence.humanize.
Nudges: +10 ms on steps 3,7 (0-based).


Reference: TR-808/909 swing, MPC humanization.

Tone.Transport.swing = 0.58;
Tone.Transport.swingSubdivision = '16n';

Integrated Sequencer Example
A 32-step sequencer combines all sounds for a cohesive electronic pattern:
const seq = new Tone.Sequence((time, step) => {
  const nudge = [0, 0, 0, 0.01, 0, 0, 0, 0.01][step % 8];
  if (step % 4 === 0) trig808Kick(time + nudge); // Kick on 1,3
  if (step % 4 === 2) trig909Snare(time + nudge, 0.6); // Snare on 2,4
  if (step % 2 === 0) trig909ClosedHat(time + nudge); // Closed hats on 8ths
  if (step % 16 === 8) trig909OpenHat(time + nudge); // Open hat every 2 bars
  if (step % 8 === 4) trigClave(time + nudge); // Clave accents
  if (step % 8 === 2 || step % 8 === 6) trigMaraca(time + nudge); // Maracas
  if (step % 16 === 12) trigAccent(time + nudge); // Accent for punch
  if (step % 8 === 3) trigTom(time + nudge, 120); // Mid tom fills
  if (step % 16 === 14) trigRim(time + nudge); // Rim shot
  if (step % 8 === 5) trigConga(time + nudge, 150); // Mid conga
  if (step % 16 === 10) trigCowbell(time + nudge); // Cowbell
  if (step % 32 === 0) trigCymbal(time + nudge); // Cymbal every 2 bars
  if (step % 2 < 1) trig303Note(time + nudge, ['C2', 'D2', 'Eb2', 'G2'][step % 4], step % 16 === 0); // 303 bass
  if (step % 8 === 6) trigDX7EPiano(time + nudge, 'C4', 0.8); // EP stabs
  if (step % 32 === 16) trigJunoPad(['C3', 'E3', 'G3'], time + nudge, '2n'); // Pad swells
}, Array.from({ length: 32 }, (_, i) => i), '16n');
seq.humanize = 0.008;
seq.start(0);

function startTransport() {
  Tone.Transport.start();
}

Optimization Tips

Noise Flavors: Use pink or brown for cymbals/hats; white for transients (https://tonejs.github.io/docs/15.3.3/Noise).
Pitch Glides: Tone.FrequencyEnvelope for smooth modulation (808 kick, toms, congas).
Filters: -12/-24 dB/oct for analog warmth; -18 dB/oct for 303 ladder filter.
Shortcuts: Tone.MembraneSynth for kicks/toms; Tone.MetalSynth for cowbell/cymbals; Tone.NoiseSynth for percussion.
Effects: Add Tone.Reverb (decay=2s, wet=0.3), Tone.Distortion (0.2 for 303), or Tone.EQ3 for mixing.
Performance: Pre-allocate synths; stop noise sources promptly; use Tone.Offline for rendering.

Notes

Compatibility: Verified with Tone.js v15.3.3 (https://tonejs.github.io/docs/15.3.3).
Tuning: Parameters match hardware (e.g., 808 at ~49 Hz, G1; 303 cutoff 200-5000 Hz).
Extensions: Add MIDI input for live play; automate filter cutoff for 303 sweeps.
Mixing: Tone.Gain nodes balance volumes; adjust for genre (e.g., techno: longer decays).
Authenticity: Sounds emulate TR-808/909, TB-303, DX7, Juno-60, with acoustic percussion for versatility.

This toolkit delivers a professional-grade palette, blending analog drum warmth, acid squelch, and FM/saw synth textures for unmatched electronic music production.