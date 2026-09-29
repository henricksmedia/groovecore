# Circuit modeling standard

GrooveCore uses circuit-informed synthesis. It does not claim component-perfect
SPICE emulation or sampled hardware identity.

## TR-808

Primary reference: the [Roland TR-808 service notes](https://archive.org/details/roland_Roland_TR-808_Service_Manual).
The bass-drum model also follows Werner et al.,
[A Physically-Informed, Circuit-Bendable, Digital Model of the Roland TR-808 Bass Drum Circuit](https://www.dafx14.fau.de/papers/dafx14_kurt_james_werner_a_physically_informed,_ci.pdf).

Required invariants:

- Bass drum: bridged-T-like decaying sine near 49.5 Hz, short trigger-induced
  pitch transient, post-resonator tone filtering, and decay feedback behavior.
- Snare: two independently decaying bridged-T resonators plus filtered white
  noise. The later schematic calculates approximately 173.3 Hz and 336 Hz.
- Toms, congas, rim and clave: decaying pseudo-sine resonators, not generic
  subtractive synth patches.
- Hats and cymbal: one shared six-square-oscillator metal bank at 205.3, 304.4,
  369.6, 522.7, 540 and 800 Hz, with separate filtering/envelopes.
- Cowbell: 540/845 Hz square-wave pair.
- Clap: repeated noise bursts followed by a filtered noise tail.
- Accent: common trigger-amplitude behavior across active voices.

## TB-303

References:

- Tim Stinchcombe, [Diode Ladder Filters](https://www.timstinchcombe.co.uk/index.php?pge=diode)
- Sonic Potions, [Analysis of the µPD650C-133 CPU timing](https://sonic-potions.com/Documentation/Analysis_of_the_D650C-133_CPU_timing.pdf)

A GrooveCore 303 must include a saw/square oscillator, nonlinear four-pole diode
ladder response, main and volume envelopes, resonance interaction, accumulated
accent sweep, and sequencer-correct gate/slide behavior. A generic `MonoSynth`
with portamento is not acceptable as a “true 303.”

The live application does not yet ship a TB-303 voice or pitch lane. Until the
voice, sequencer, playback and export paths exist together, the UI and
documentation must not claim that it does.
