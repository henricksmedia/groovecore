# GrooveCore Roadmap — Upcoming Features

Tracking doc for features not yet built. The shipped-P0 record and its backlog
live in [UPGRADE-PLAN.md](UPGRADE-PLAN.md); data-quality history is in
[PRESET-AUDIT.md](PRESET-AUDIT.md). Newest decisions at the top of each section.

## Headline: TB-303 bassline lane

**Status:** proposed (2026-07-30) — awaiting a design decision.
**Why:** the 808's historical companion, and the highest-value addition for the
primary workflow (Suno/AI reference exports): kick + acid bassline gives the AI
melody, key, and groove to lock onto instead of drums alone.

Scope sketch:
- **Voice** (builds on the existing engine): saw/square oscillator →
  resonant lowpass with envelope modulation, accent, and slide (portamento on
  tied notes). Rides the existing offline renderer, stems, and AI-loop tiling.
- **Sequencer lane** (the real work): pitch per step — note + octave + slide +
  accent + rest — a new row type with its own compact piano-lane editor under
  the drum grid, collapsible like the GROOVE deck.
- **Exports:** pitched MIDI track alongside channel-10 drums, bass stem in the
  zip, Suno-prompt descriptors ("acid bassline, squelchy 303", key/scale).

Open design decision (owner to pick):
- **(a) Full 303 authenticity** — 16-step pitch lane, slides/accents, classic
  acid workflow; more powerful, more UI.
- **(b) Simple bass lane** — pick a scale, tap steps; faster to use, less
  tweakable.

Estimated size: comparable to 2–3 of the original P0 workstreams.

## Queued (smaller, known-value)

- **Sub-16th step resolution** (triplets / 32nds): several inspiration
  sequences were authored with triplet/hemiola feel that the 16-step grid
  flattens (see PRESET-AUDIT). Needs per-step sub-resolution in the event
  model + editors.
- **Revive the ~205 commented-out accent hits** in inspiration-sequences.js —
  the accent row exists now; the authored accent data is still parked in
  comments.
- **Clap (cp) mapping for the inspiration loader**: `mapInstrumentName` has no
  clap/handclap entry, so groove sequences substitute rimshot/ghost snare.
  Add the mapping, then retarget clap-intent lines.
- **Per-row instrument controls drawer restyle** (LEVEL/GAIN/PAN/TUNE/SHUFFLE
  expander): last visual holdout of the old styling; bring it into the shell
  design language.
- **Fix the one duplicate display name**: "Garage Revival" appears in both
  Rock (rock_8) and Indie (indie_10) dropdown entries.

## Platform / deploy (blocked on going live)

- **Deploy to Cloudflare Pages** (git-push.bat → connect repo; bump `ASSET_V`
  in js/main.js + index.html `?v=` tags + sw.js CACHE name on every deploy).
- **Post-deploy manual QA** (UPGRADE-PLAN §11 leftovers): DAW import of an
  exported .mid, stems listening check, offline PWA install + reload,
  Lighthouse pass, `_headers`/404/OG verification, real-hardware Web MIDI
  input test, cross-browser share links, iOS audio resume, NVDA pass.
- **Tailwind Play → compiled CSS freeze** (P1 from UPGRADE-PLAN): replace the
  runtime Tailwind Play vendor script with generated static CSS.

## Later / ideas (from the P1 backlog)

- Performance mode (stripped-down live-play view).
- Preset audition (hover-preview a groove before loading it).
- MIDI learn (map hardware knobs/pads to app controls) and MIDI file import.
