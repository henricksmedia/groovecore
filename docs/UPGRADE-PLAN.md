# GrooveCore Master Upgrade Plan

**Status:** Approved architecture for the P0 implementation burst.
**Date:** 2026-07-28.
**Chief architect synthesis of three design proposals (workflow / sound / UX) + full codebase analysis (`scratchpad/plan-notes/*`).**
**Constraints honored:** static site, zero build step, Cloudflare Pages from repo root, vanilla JS + Tone.js v14 (vendored), no frameworks, app keeps working at every wave boundary, parallel agents never edit the same file concurrently.

---

## 1. Vision

GrooveCore becomes the only browser drum machine that combines the trifecta nobody else has:

1. **Authentic 808 synthesis** (io808 has it, but zero export and zero depth),
2. **Deep modern sequencing** — per-step velocity/accent/ratchet/flam/probability, chaining (BeatState has it, but exports nothing),
3. **Real export** — deterministic MIDI + WAV mix + per-instrument stems (Drumhaus/SEQ-16 have pieces, nobody has all).

Wrapped in a **daily-driver workflow**: work is never lost (autosave), never one click from destruction (undo), reachable from any device (share-URL, PWA offline), playable live (QWERTY pads, Web MIDI in, tap tempo), and governed by one sacred contract: **what you hear is exactly what lands in your DAW.**

Positioning: "Hardware heart, modern shell." The 808 panel keeps its skeuomorphic soul (orange-on-black, LED-glow steps, nixie BPM, silkscreen labels); everything around it becomes a fast, learnable, accessible modern app.

The bar to beat is **Drumhaus** (Tone.js, per-step velocity/flam/ratchet, WAV export, share URLs, offline PWA). Its weaknesses — sampled 8 voices, no MIDI export, no MIDI-in, no stems, no genre library — map exactly onto GrooveCore's existing strengths.

---

## 2. Gap analysis — "What am I missing?"

### 2.1 Trust defects (things that are silently broken today)

| Defect | Evidence | Consequence |
|---|---|---|
| **MIDI export is broken at the byte level** | midi-writer-js velocity passed as 0–1 against a 1–100 API → notes ≈ velocity 1 (near-silent); 480-PPQ tick math written into a 128-PPQN file → ~3.75× time stretch; `wait`/duration arithmetic serializes chords and drifts | The flagship "export to your DAW" feature produces wrong files |
| **Exports are nondeterministic by default** | `modalTiming ?? 5`, `modalVelocity ?? 8` inject ±20% timing jitter and ±8 velocity spread on every export | Export ≠ grid; re-export ≠ previous export; trust-killer |
| **Instrument identity crisis** | `ch` sounds like a closed hat, is labeled CLAP, exports GM 39 Hand Clap; `hc/mc/lc` sound like congas, are labeled hi-hats, export GM 42/44/46; `lc` and `oh` both export note 46; there is **no clap sound at all** | What you hear ≠ what the row says ≠ what lands in the DAW |
| **Dead controls** | Tune knob is a no-op on every voice (FrequencyEnvelope overrides `setValueAtTime`); pan knobs do nothing (no pan node); per-voice reverb/delay/EQ/comp knobs feed a dead-end chain (only distortion is audible); 64 heavy FX nodes instantiated for nothing | Users tweak knobs that do nothing |
| **Timing jitter** | `updateStep` ignores the Transport `time` argument and fires against `Tone.now()`; DOM queried inside the audio callback; swing/humanize are fixed-seconds, not tempo-relative | Not sample-accurate; swing feel changes radically with BPM |
| **Data silently lost** | 16 presets have duplicate `hc`/`cym` keys (last-one-wins); 242 of 2,894 inspiration hits (8.4%) silently dropped incl. all 127 crash hits; per-hit velocities flattened to per-instrument averages | The 268KB inspiration library's authored dynamics are inaudible |
| **Fragile platform** | Tailwind Play CDN (dev tool) in production; Tone + midi-writer from three CDNs; no favicon/manifest/OG; reset bug writes tempo knob = 120 on a 0–10 scale; save file still named `io808-save.json` | CDN outage breaks the app; no offline; stale branding |

### 2.2 Table-stakes features competitors have and GrooveCore lacks

Ranked by ubiquity across the competitive field:
1. **WAV audio export** (drumbit, OneMotion, Drumhaus, SEQ-16, PatternSketch…) — the #1 gap. Per-instrument **stems** would leapfrog everyone.
2. **Per-step velocity/accent** (Drumhaus, BeatState, ButtonBass) — trap hats are impossible without it.
3. **Pattern chaining / song mode** (drumbit 4 patterns, Drumhaus 8 bars, BeatState chains) — A/B alone is below par.
4. **Share-by-URL with zero backend** (Drumhaus's ~200-char compressed links) — perfect for static hosting.
5. **Autosave + undo** — refresh currently loses everything; RESET/CLEAR are one-click destructive with no undo.
6. **Real touch/mobile** — knobs and sliders are mouse-only today (zero pointer/touch events); 17 desynced per-row scroll containers.
7. **Keyboard/live play** — the entire keyboard surface today is one Escape handler. No Space, no pads, no tap tempo, no Ctrl+Z.
8. **PWA/offline** — only Drumhaus has it; a static site is one service worker away.
9. **Web MIDI in** — zero `requestMIDIAccess` anywhere.

### 2.3 What GrooveCore already has that nobody else does

Real 808 **synthesis** (not samples), a 58-preset + 114-sequence genre library (largest except BeatState), MIDI export **intent** with a documented GM mapping, and a distinctive hardware-soul visual identity. The plan protects and amplifies these.

---

## 3. The three governing decrees

### Decree 1 — Instrument identity: the audio engine is truth

What the user HEARS is what the UI says and what the MIDI file contains. Zero change to how existing patterns sound; only labels and exports become honest.

| Code | Canonical meaning (= current engine sound) | New UI label | New GM note (ch 10) |
|---|---|---|---|
| `bd` | Bass drum | BD BASS DRUM | 36 (unchanged) |
| `sd` | Snare | SD SNARE | 38 (unchanged) |
| `lt`/`mt`/`ht` | Toms | LT/MT/HT TOM | 45/47/50 (unchanged) |
| `rim` | Rimshot | RS RIMSHOT | 37 (unchanged) |
| `cp` | **NEW 808 handclap voice** | CP CLAP | **39 Hand Clap** |
| `hc`/`mc`/`lc` | Congas (that is what they synthesize) | HC/MC/LC CONGA | **63 / 62 / 64** (Open Hi / Mute Hi / Low Conga) |
| `cb` | Cowbell | CB COWBELL | 56 (unchanged) |
| `cl` | Claves | CL CLAVES | 75 (unchanged) |
| `ma` | Maracas | MA MARACAS | 70 (unchanged) |
| `ch` | Closed hat (that is what it plays) | CH CLOSED HAT | **42 Closed Hi-Hat** |
| `oh` | Open hat | OH OPEN HAT | 46 (no longer collides with `lc`) |
| `cym` | 808 CY cymbal | CY CYMBAL | 57 (kept in P0; note-51 ride option is P1) |
| `cr` | Crash | CR CRASH | 49 (unchanged) |
| `accent` | **Per-step accent flag, NOT a voice** | AC ACCENT (17th grid row, no level slider) | no note — velocity tier only |

Written once into `midi-mapping.js`; the duplicate maps (`GM_DRUM_MAP` in midi_export_enhanced.js, the inline fallback at app.js:1327) go off the hot path. The 29 presets already carrying inert `accent` arrays light up for free.

### Decree 2 — One event list: preview == export

`GrooveEvents.computePatternEvents()` (pure function, no DOM, no Tone) is the ONLY source of "which hits happen when, how loud" — consumed by the live scheduler, the MIDI exporter, and the WAV/stem renderer. Deterministic by default; humanize is an explicit opt-in with a **seeded** PRNG so re-exports are reproducible. Swing/shuffle are tempo-relative fractions of a 16th, expressed in ticks, identical in playback and export.

### Decree 3 — One snapshot schema: the workflow spine

Schema v2 (below) is serialized identically by autosave, undo, `.groove.json` project files, and share-URLs. Versioned (`v: 2`) with an `ext` bag so per-step features extend it without breaking old links. `true` step cells remain forever readable (legacy = velocity 100).

---

## 4. Data model v2 (frozen spec — every workstream codes against this)

Step cell today: `{ bd: true }`. New (truthiness-compatible — every existing `if (part[i][inst])` keeps working):

```jsonc
// pattern.part1[step] — cell values:
{ "bd": 127, "ch": 100, "sd": 45, "accent": true }
// cell[inst] = integer 1–127 (true accepted as legacy alias for 100)
// cell.accent = per-step accent flag (the AC row), applies to all hits on the step

// pattern.sfx1 — sparse per-step FX, key "step:inst":
{ "12:ch": { "r": 3 },          // ratchet ×2|×3|×4
  "4:sd":  { "f": 1 },          // flam
  "7:ch":  { "p": 50 },         // probability % (absent = 100)
  "9:bd":  { "m": 25 } }        // micro-shift −50..50 (% of a 16th) — schema reserved; UI in P1
```

Velocity tiers used by UI shortcuts and MIDI: **ghost 45 / normal 100 / accent 127**. Level knob stays channel gain (mixer); velocity is per-hit energy — independent, like hardware + DAW.

### Snapshot schema v2 (js/core/schema.js)

```jsonc
{
  "v": 2,
  "meta": { "app": "groovecore", "name": "untitled", "savedAt": "2026-07-28T…" },
  "tempo": 128,
  "knobValues": { /* full 0–10 map; element ids ARE the keys — never rename */ },
  "patternControls": { /* per-instrument probability/velocity/timing/flam/roll/pitchBend */ },
  "modalKnobValues": { /* per-instrument: { bd: { modalDecay: n, … }, sd: { … } }; flat legacy maps migrate on restore */ },
  "muteSolo": { "muted": [], "soloed": [] },
  "patterns": { "a": [16 × { "part1": [16 × cell], "part2": [], "length1": 16, "length2": 0, "sfx1": {} }], "b": [ … ] },
  "sel": { "variation": "a", "currentPattern": 0 },
  "ext": { "chain": { "mode": "loop", "slots": [{"v":"a","i":0}, …8], "pos": 0 } }
}
```

`migrateV1()` accepts old `io808-save.json` files (no `v` field, `true` cells, muteSoloState arrays) forever.

---

## 5. Public API contracts (frozen — implementers code against these verbatim)

### 5.1 `window.GC` — the app.js bridge (appended at END of app.js, before the `window.addEventListener('load', init)` line ~4632)

Because app.js is a classic script, its top-level `let` bindings are NOT on `window`. The bridge exposes them explicitly; ES modules touch app state ONLY through `GC`.

```js
window.GC = {
  version: 1, dataVersion: 2, flags: {},
  get patterns()        { return patterns },        set patterns(v)        { patterns = v },
  get knobValues()      { return knobValues },
  get patternControls() { return patternControls }, set patternControls(v) { patternControls = v },
  get modalKnobValues() { return modalKnobValues }, set modalKnobValues(v) { modalKnobValues = v },
  get muteSoloState()   { return muteSoloState },
  get tempo()           { return tempo },
  get variation()       { return variation },
  get currentPattern()  { return currentPattern },
  get isPlaying()       { return isPlaying },
  get currentStep()     { return currentStep },
  fns: { updateStepDisplay, updateUIFromState, updateAllKnobVisuals, updateNixieBPMDisplay,
         updatePatternIndicators, loadStylePreset, loadInspirationSequence, clearPattern,
         triggerInstrument, updateMasterVolume, updatePlayButton },
  setBpm(bpm) {   // the single canonical tempo setter (replaces 3 divergent code paths)
    bpm = Math.min(260, Math.max(40, Math.round(bpm)));
    tempo = bpm; knobValues.tempo = (bpm - 60) / 20;
    if (typeof Tone !== 'undefined') Tone.Transport.bpm.rampTo(bpm, 0.1);
    updateNixieBPMDisplay(); updateAllKnobVisuals();
  },
  selectPattern(variationKey, index),   // sets variation/currentPattern + updatePatternIndicators + updateStepDisplay
  duplicatePattern(fromRef, toRef),     // structuredClone of {part1, part2, length1, length2, sfx1}
  getState(),                            // deep-copied plain object of all state above (Sets → arrays)
  applyState(s),                         // writes back + Transport.bpm + all update* refreshers
  events: { on(e, f), off(e, f), emit(e, d) }   // tiny try/caught emitter
};
```

Events emitted by app.js: `'step'` (with step index, from updateStep), `'play'`, `'stop'`. Events consumed: modules emit `'mutate:before'` (undo snapshot), `'toast'`, `'export:open'`, `'browser:toggle'`, `'share:copy'`, `'undo'`/`'redo'`.

### 5.2 `window.GrooveParams` (js/audio/params.js)

- `INSTRUMENTS = ['bd','sd','lt','mt','ht','rim','cp','hc','mc','lc','cb','cl','ma','ch','oh','cym','cr']` (17 voices; `accent` is NOT a voice)
- `DEFAULTS[inst]` — the ONE copy of default params per voice (kills the 3-way duplication in app.js)
- `mapKnob(inst, param, v0to10)` → real units. Params: `level, tune, decay, tone, snappy, pan, drive, sendRev, sendDly`
- `KEYMAP` — pad key layout (see WS-D)

### 5.3 `window.GrooveAudio` (js/audio/voices.js + js/audio/bus.js)

- `await GrooveAudio.init()` — lazy, idempotent, called after first user gesture / `Tone.start()`. Builds the 6-osc metallic bank, master bus, send buses.
- `GrooveAudio.trigger(inst, { time, velocity = 100, accent = false, immediate = false })` — per-hit disposable node graph; `time` = the Transport callback's time argument; `immediate: true` uses `Tone.immediate()` (pad path, no lookahead); handles CH-chokes-OH; velocity scales envelope peak; accent multiplies gain ×`(1 + accentAmount/10 × 0.8)` pre-bus and extends hat/cym decay +15%.
- `GrooveAudio.setParam(inst, param, v0to10)` — stored in voiceParams, applied at next trigger (never mutates live envelope-driven signals — permanently fixes the dead-Tune bug class); `pan`/`level` apply immediately to the voice's Gain→Panner.
- `GrooveAudio.master.set(param, v0to10)` — `volume, drive, glue, ceiling, accentAmount`.
- `GrooveAudio.buildVoices(destination)` — factory usable inside `Tone.Offline` (every voice factory takes `(context, destination)`); the stems exporter needs zero engine changes.

### 5.4 `window.GrooveEvents` (js/core/events.js)

```js
computePatternEvents(patternOrChain, opts) // → sorted [{ step, barIndex, inst, velocity, accent, tick480, timeSec }]
// opts = { swing: 0–10, shufflePerInst: {}, ppq: 480, bpm, deterministic: true, seed: 42, humanize: 0 }
```
Pure. Expands sfx1 ratchets (2/3/4 evenly-spaced sub-hits, decaying gain), flams (grace note ~55% velocity, min(28ms, 25% of a 16th) early), probability (seeded PRNG gate). Swing = odd 16ths delayed `swing/10 × 0.55 × stepTicks`. Consumed by live scheduler (WS-F), MIDI exporter, WAV/stem renderer.

### 5.5 `window.GCKnobs` (js/ui/knob-engine.js — classic script, loaded before app.js)

`bind(el, {min:0, max:10, default:5, onChange})`, `set(id, value, {silent})`, `get(id)`, `on('gesture:start'|'gesture:end', cb)`. Pointer Events only (`pointerdown/move/up` + `setPointerCapture`) — mouse, touch, pen in one path, zero permanent document listeners. Shift = fine ×0.1, Ctrl = coarse ×3, wheel ±0.3 (passive:false), double-click/double-tap = reset to default (**tempo default = 120 BPM ⇒ knob 3.0, fixing the 160-BPM dblclick bug**). One rotation formula (`--rotation`), one slider formula (`--slider-width`), value-bubble tooltip while dragging, syncs `aria-valuenow`.

### 5.6 `window.GCToast` (js/ui/ui-kit.js)

`show(msg, {type, duration = 3500, action: {label, onClick}})` — bottom-left stack, `role="status" aria-live="polite"`, reduced-motion aware. Plus `menu(anchor, items)`, `overlay(html)`, `injectStyles(id, css)`. Includes the **alert shim**: `window.alert = m => GCToast.show(...)` — converts all 16+ existing `alert()` sites to toasts with zero app.js edits.

### 5.7 `window.GCInput` (js/perf/pads.js + midi-in.js)

`onHit(cb)` — registry; cb receives `{ inst, velocity, accent, source: 'key'|'midi', atTime }`. pads.js and midi-in.js emit; record.js subscribes.

---

## 6. Architecture: full file map

### 6.1 New files

| File | Owner WS | Purpose |
|---|---|---|
| `js/core/events.js` | A | Canonical event-list generator (Decree 2) + seeded mulberry32 PRNG |
| `js/audio/params.js` | A | Voice list, default params, knob→unit maps (single source of synth truth) |
| `js/audio/voices.js` | A | 17 circuit-accurate voice factories, metallic bank, choke, per-hit graphs, offline-capable |
| `js/audio/bus.js` | A | Master bus (sat→glue→limiter), plate-reverb + tape-delay sends, accent gain |
| `js/io/smf.js` | B | Hand-rolled SMF type-0/1 writer, real 480 PPQ, absolute ticks (~180 lines, zero deps) |
| `js/io/export-midi.js` | B | New MIDI export on events+smf+GrooveCoreMIDI; single/multi-track/chain; deterministic |
| `js/io/export-audio.js` | B | WAV mix + per-instrument stems via `Tone.Offline` + `GrooveAudio.buildVoices` |
| `js/io/wav-encode.js` | B | AudioBuffer → 16-bit PCM WAV (~60 lines) |
| `js/io/zip.js` | B | STORE-only ZIP builder with CRC32 (~100 lines) |
| `js/ui/export-menu.js` | B | Capture-phase intercept on `#exportMidi`; visible export menu; kills the Shift+click `prompt()` |
| `js/core/schema.js` | C | Snapshot v2, `migrateV1`, `validate`, sparse `toShare()`/`fromShare()`, `registerSection()` ext registry |
| `js/ui/ui-kit.js` | C | GCToast + menu + overlay + injectStyles + alert shim + velocity-tier grid CSS |
| `js/ui/history.js` | C | Undo/redo ring buffer ≥100 snapshots, gesture-boundary capture, `gc:change` emit |
| `js/ui/autosave.js` | C | localStorage `gc.autosave.v2`, debounced 400ms, beforeunload flush, 3-deep rotation, restore on boot |
| `js/ui/share.js` | C | `#s=` URLs: sparse JSON → `CompressionStream('deflate-raw')` → base64url (fallback `#S=` uncompressed); localStorage-independent |
| `js/ui/project-io.js` | C | Capture-phase intercept `#save`/`#load`; `.groove.json` v2 files; v1 migration; undoable load |
| `js/ui/keys.js` | D | Central focus-aware key router: Space, T, Ctrl+Z/Y/S/E, arrows = BPM, 1/2 = A/B, M, P, `?`; `register()` API |
| `js/ui/tempo-tools.js` | D | Tap tempo (T + injected TAP button, rolling avg, outlier discard) + metronome (M, beat-1 accent, re-arms after play) |
| `js/ui/shortcut-overlay.js` | D | `?` dialog listing every shortcut + the hidden knob gestures |
| `js/perf/pads.js` | D | QWERTY finger drumming, `immediate: true` triggers, ≤20ms, row-label flash |
| `js/perf/midi-in.js` | D | WebMIDI note-on → trigger with real velocity via the reverse map; hot-plug; `#midiInBtn` |
| `js/perf/record.js` | D | Live record: quantize hits to nearest 16th (round forward across loop seam), write per-step velocity |
| `js/ui/chain.js` | D | 8-slot chain bar after the sequencer panel: LOOP/CHAIN, slot picker (A/B × 16), DUP→, bar-quantized switching, registers `ext.chain` |
| `js/ui/knob-engine.js` | F | GCKnobs pointer engine (classic script) |
| `js/ui/preset-browser.js` + `js/data/preset-meta.js` | H | Searchable browser over 58 presets + 113 grooves: genre chips, BPM badges, favorites, recents, Surprise me |
| `js/ui/onboarding.js` | H | First-visit demo beat (classic808) + 3 coach marks; skipped if session restored or share-loaded |
| `js/ui/a11y.js` | H | Runtime ARIA: roving-tabindex grid, `role=slider` knobs, `aria-pressed` toggles, live region, modal focus traps |
| `js/ui/mobile.js` | H | Compact-dock toggle behavior |
| `js/ui/step-editor.js` | H | Drag-for-velocity on active steps (1px = 1 vel), horizontal drag-paint, Shift+click 127 / Alt+click 45 |
| `js/ui/step-context.js` | H | Right-click/long-press step menu: ghost/normal/accent, ratchet ×2/3/4, flam, probability, clear |
| `css/tokens.css, polish.css, a11y.css, mobile.css, preset-browser.css, onboarding.css, step-editor.css, step-context.css, toast.css` | H (toast.css: C) | Token layer, 808 step-bank colors, pulse-collision fix, focus rings, reduced-motion, single-scroll-surface mobile, 44px targets, cp/accent row styling |
| `vendor/Tone.min.js` | I | Tone.js 14.8.49, byte-identical to current cdnjs file |
| `vendor/tailwind-play.js` | I | Self-hosted copy of the current cdn.tailwindcss.com script (identical behavior, offline-safe; real freeze is P1) |
| `vendor/fonts/*` + `vendor/fonts/fonts.css` | I | Self-hosted Roboto (400/500/700/900), Material Icons, the single `drag_click` Symbols glyph; `font-display: swap` |
| `manifest.webmanifest`, `sw.js`, `icons/*`, `404.html`, `_headers`, `robots.txt` | I | Installable offline PWA, Cloudflare headers/caching, branded 404 |
| `js/main.js` | J | Boot loader: try/caught sequential imports of every module + SW registration (see §6.3) |
| `test-scripts/test_smf_bytes.html` | G | Byte-level MIDI regression (inline SMF parser: PPQ, tempo, ticks, velocities, channel, chords, determinism) |
| `test-scripts/test_state_roundtrip.html` | G | Snapshot→restore→snapshot equality; v1 migration; share encode/decode; simulated kill-tab |

### 6.2 Edited files (single-owner chains)

| File | Edit chain (strictly sequenced) |
|---|---|
| `app.js` | **WS-E** (bridge + data model v2 + workflow fixes) → **WS-F** (engine swap + scheduler + knob rewiring) |
| `index.html` | **WS-F** (append engine/knob script tags only) → **WS-J** (full integration edit) |
| `midi-mapping.js` | **WS-G** only (identity decree v3) |
| `presets.js` | **WS-G** only (de-dupe, cp retarget, stray-key fixes) |
| `README.md`, `docs/MIDI_MAPPING_MASTER_REFERENCE.md` | **WS-G** only (stale v1 table → decree table) |
| `styles.css` | **NOBODY in P0.** All visual changes are override stylesheets. Consolidation is P1. |
| `midi_export_enhanced.js`, `inspiration-sequences.js` | **NOBODY in P0.** The enhanced exporter stays on disk but is taken off the hot path at runtime (export-menu intercepts the button capture-phase AND export-midi.js overwrites `window.exportPatternToMidiEnhanced`/`MultiTrack` after load — belt and braces; if modules fail, legacy still works). |

### 6.3 Script order (index.html end state after WS-J)

```html
<head>
  vendor/fonts/fonts.css · vendor/tailwind-play.js (+ existing inline tailwind.config) · styles.css
  manifest link · favicon/apple-touch links · OG/Twitter/SEO meta · updated CSP meta (self-only hosts)
</head>
<body> … 
  vendor/Tone.min.js            (classic)
  presets.js · inspiration-sequences.js · midi-mapping.js · midi_export_enhanced.js  (classic, unchanged order)
  js/ui/knob-engine.js          (classic — must precede app.js)
  app.js                        (classic)
  js/audio/params.js · js/audio/voices.js · js/audio/bus.js · js/core/events.js   (type="module", attach window globals)
  js/main.js                    (type="module" — the boot loader, LAST)
</body>
```

The midi-writer-js inline `<script type="module">` importer (lines 39–51) is **deleted** — smf.js replaces the library entirely.

`js/main.js` (boot loader — the anti-collision keystone, adapted from the UX proposal):

```js
const MODULES = ['/js/ui/ui-kit.js','/js/core/schema.js','/js/ui/share.js','/js/ui/autosave.js',
  '/js/ui/history.js','/js/ui/keys.js','/js/ui/tempo-tools.js','/js/ui/shortcut-overlay.js',
  '/js/ui/chain.js','/js/ui/project-io.js','/js/io/export-midi.js','/js/io/export-audio.js',
  '/js/ui/export-menu.js','/js/perf/pads.js','/js/perf/midi-in.js','/js/perf/record.js',
  '/js/ui/preset-browser.js','/js/ui/a11y.js','/js/ui/mobile.js','/js/ui/onboarding.js',
  '/js/ui/step-editor.js','/js/ui/step-context.js'];
// CSS links injected the same way with onerror cleanup.
// Wait for window 'load' + 50ms (app.js init() bound to 'load' must run first), then:
for (const p of MODULES) { try { const m = await import(p); await m.init?.(window.GC); } catch (e) { console.warn('[boot]', p, e); } }
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(()=>{});
```

Module contract: every module exports `init(GC)`, self-injects its DOM (gc-prefixed ids/classes), reads/writes state only via `window.GC` / other frozen globals, and degrades to a no-op if a dependency is missing. Boot order is load-bearing: ui-kit first (everyone toasts), share before autosave (a `#s=` hash wins over restore), onboarding last (checks `GC.flags.loadedFromShare` / `restoredSession`).

---

## 7. P0 scope (ships in this burst)

1. **Honest identity** — decree applied to MIDI map, UI labels, docs, README; new CP clap voice; AC accent row; presets de-duped; ~236 dropped inspiration hits recovered; `lc`/`oh` collision gone.
2. **Circuit-accurate 17-voice engine** — per-hit disposable voice graphs; 6-osc metallic bank hats/cymbal with CH-chokes-OH and OH decay knob; working Tune everywhere (no compounding); hardware Decay/Tone/Snappy knobs; new CP clap; master bus (drive→glue→limiter) + plate/tape sends replacing 64 dead FX nodes; working pan.
3. **Sample-accurate timing** — Transport `time` arg through the whole trigger path; `Tone.Draw` playhead (no DOM in audio callback); tempo-relative swing/shuffle/humanize; no more empty catches.
4. **Per-step nuance** — velocity 1–127 (drag-edit, paint, Shift/Alt tiers), per-step accent row, ratchet ×2/3/4, flam, probability — identical in playback and every export (Decree 2).
5. **Deterministic export that's actually correct** — hand-rolled 480-PPQ SMF writer; byte-identical re-exports; chords share ticks; velocities verbatim; chain/song export; multi-track with per-track CCs; **WAV mix + per-instrument stems zip** (offline render, bar-aligned, ≤10s for a 4-pattern chain); visible export menu (no more `prompt()`).
6. **Workflow trust** — localStorage autosave (kill-tab test passes), 100-level undo/redo, project `.groove.json` v2 files (v1 loads forever), share-by-URL (compressed, Chromebook-safe), toasts everywhere.
7. **Live playability** — Space/T/Ctrl+Z/… shortcuts + `?` overlay; tap tempo; metronome; QWERTY pads ≤20ms; Web MIDI in; quantized live record; 8-slot pattern chaining with bar-quantized switching and one-action duplicate.
8. **Library as hero** — searchable preset browser (genre chips, BPM badges, favorites, recents) over all 171 patterns; demo-beat onboarding; undoable loads.
9. **Modern shell** — audio unlock on first gesture + iOS resume; pointer-event knobs (touch works); single-scroll-surface mobile grid with 44px targets and pinned labels; runtime ARIA + roving focus + reduced-motion; 808 step-bank colors (red/orange/yellow/cream by 4s); token layer.
10. **Platform** — all deps vendored (works fully offline); PWA installable; `_headers` caching/security; SEO/OG/favicon; 404.html; stale README MIDI table fixed.

**Honest P0 exclusions (→ P1):** count-in; micro-shift UI (schema field reserved); preset audition-before-load; mobile one-instrument portrait mode; performance mode (fullscreen, 1–8 cueing, hold-to-fill); MIDI learn/clock; MIDI file import; Tailwind true freeze + styles.css consolidation; app-shell restructure (top-bar transport, context panel); command palette; sampled alt-kit; part2/32-step playback.

---

## 8. P1 backlog (priority order)

1. **Tailwind freeze**: one-time `npx tailwindcss@3` run committed as `vendor/tailwind.css` (safelist JS-toggled classes), delete the Play script; then styles.css consolidation (port utilities to semantic CSS, 3–4 breakpoints, delete legacy modal block and `!important` war).
2. **App-shell restructure**: 48px top-bar transport, retire the sticky bottom deck, contextual right panel replacing `#instrumentModal` (tweak-while-looping), channel strips + selected-voice knob row.
3. **Generated grid** from a JS manifest (deletes ~800 lines of index.html; single source for labels/ids); then delete dead inline `.instrument-controls` panels and hidden `#mode/#instrument/#tap` block (+ app.js guards).
4. **Preset audition** (non-destructive 2-bar pre-listen), "grooves by feel" facets, pattern sparklines; lazy-load `inspiration-sequences.js` (268KB) for the ≤3s first-sound budget.
5. **Performance mode**: fullscreen, 1–8 quantized pattern cueing with cue countdown, hold-to-fill auto-revert, group mutes; latency measurement harness.
6. **Web MIDI extras**: MIDI learn, external clock sync, MIDI file import via the existing reverse map; erase-while-recording.
7. **Micro-shift / nudge UI** (`m` field), unquantized record capture, triplet grid.
8. ~~**Per-instrument modal state split**~~ (done — nested `modalKnobValues[inst]`, pattern-control defaults/FX badge, dead knobs disabled, randomize/tempo cleanup), named project manager (localStorage slots), command palette (Ctrl+K).
9. **CSP to `_headers`** (drop `unsafe-inline` once inline scripts are gone), CY note-51 migration toggle, optional sampled "vintage" alt-kit (~500KB `/samples/`, crash first), count-in polish.
10. **Adoption metrics** (localStorage counters: time-to-first-sound, restore success, exports/week, share creates/opens, undo usage).

---

## 9. P0 workstream partition (parallel-agent contract)

**Rule:** no two workstreams that can run in parallel touch the same file. Shared files have single-owner chains (§6.2). All contracts (§3–§5) are frozen by this document before any agent starts.

| WS | Name | Files (exclusive) | depends_on |
|---|---|---|---|
| **A** | Engine & event contracts | NEW `js/core/events.js`, `js/audio/params.js`, `js/audio/voices.js`, `js/audio/bus.js` | — |
| **B** | Export stack | NEW `js/io/smf.js`, `js/io/export-midi.js`, `js/io/export-audio.js`, `js/io/wav-encode.js`, `js/io/zip.js`, `js/ui/export-menu.js` | A |
| **C** | Workflow spine | NEW `js/core/schema.js`, `js/ui/ui-kit.js`, `js/ui/history.js`, `js/ui/autosave.js`, `js/ui/share.js`, `js/ui/project-io.js`, `css/toast.css` | — |
| **D** | Live play & control | NEW `js/ui/keys.js`, `js/ui/tempo-tools.js`, `js/ui/shortcut-overlay.js`, `js/ui/chain.js`, `js/perf/pads.js`, `js/perf/midi-in.js`, `js/perf/record.js` | — |
| **E** | app.js stage 1: bridge + data model v2 | EDIT `app.js` only | — |
| **F** | app.js stage 2: engine integration + knobs | EDIT `app.js`; NEW `js/ui/knob-engine.js`; EDIT `index.html` (script tags only) | A, E |
| **G** | MIDI truth, data hygiene, tests, docs | EDIT `midi-mapping.js`, `presets.js`, `README.md`, `docs/MIDI_MAPPING_MASTER_REFERENCE.md`; NEW `test-scripts/test_smf_bytes.html`, `test-scripts/test_state_roundtrip.html` | — |
| **H** | UX shell modules | NEW `js/ui/preset-browser.js`, `js/data/preset-meta.js`, `js/ui/onboarding.js`, `js/ui/a11y.js`, `js/ui/mobile.js`, `js/ui/step-editor.js`, `js/ui/step-context.js`, `css/tokens.css`, `css/polish.css`, `css/a11y.css`, `css/mobile.css`, `css/preset-browser.css`, `css/onboarding.css`, `css/step-editor.css`, `css/step-context.css` | — |
| **I** | Platform: vendoring, PWA, Cloudflare | NEW `vendor/*`, `manifest.webmanifest`, `sw.js`, `icons/*`, `404.html`, `_headers`, `robots.txt` | — |
| **J** | Final integration + QA | EDIT `index.html`; NEW `js/main.js` | B, C, D, F, G, H, I |

Waves: **1** = A, C, D, E, G, H, I (all parallel, zero file overlap) → **2** = B, F (parallel with each other; B owns only new `js/io/*` + `js/ui/export-menu.js`, F owns app.js/index.html/knob-engine) → **3** = J alone.

Safety rules for every agent: never rename existing element ids (ids ARE the state keys); namespace all injected DOM with `gc-` prefixes; try/catch module init; capture-phase interception instead of rewiring legacy handlers; keep legacy code paths on disk as fallback; the app must load and play at every wave boundary.

Per-workstream goals with exact anchors and acceptance criteria are in the structured workstream list accompanying this plan (and mirrored in §11 QA).

---

## 10. Cloudflare Pages deployment notes

**Deploys as-is**: connect the GitHub repo (`jshenricks/GrooveCore`, per `git-push.bat`), framework preset **None**, build command **empty**, output directory **`/`** (repo root). Every file ships as authored — no build step ever.

### `_headers` (WS-I ships this)

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), payment=()
  Content-Security-Policy: frame-ancestors 'none'

/vendor/*
  Cache-Control: public, max-age=31536000, immutable
/icons/*
  Cache-Control: public, max-age=31536000, immutable
/index.html
  Cache-Control: no-cache
/sw.js
  Cache-Control: no-cache
```

Notes: the page CSP stays in the `<meta>` tag in P0 (updated by WS-J to self-only hosts, keeping `'unsafe-inline'` for the tailwind config inline script and Play-runtime style injection, and `worker-src 'self' blob:` for Tone). `frame-ancestors` cannot live in a meta tag, so it rides in `_headers`. P1 moves the full CSP to `_headers` and drops `unsafe-inline`. HTML/`sw.js` are `no-cache` so deploys propagate instantly; hashed-free static assets rely on the SW cache version bump instead.

### PWA specifics

- `manifest.webmanifest`: name "GrooveCore — 808 Drum Machine", `display: standalone`, `theme_color`/`background_color: #0a0a0a`, 192/512 maskable icons (orange-on-black GC step-pad motif).
- `sw.js`: **versioned precache** (bump `CACHE = 'gc-v1'` on every deploy) of the complete shell: `/`, `index.html`, `styles.css`, `app.js`, `presets.js`, `inspiration-sequences.js`, `midi-mapping.js`, `midi_export_enhanced.js`, `js/**`, `css/**`, `vendor/**`, `icons/**`, `manifest.webmanifest`. Cache-first with network fallback; old caches deleted on `activate`. Result: installable, fully offline after first load — only Drumhaus has this today.
- `404.html`: Pages serves it automatically for unknown routes; branded orange-on-black ("pattern not found") with a link home.
- SEO/OG (WS-J in index.html): title/description, canonical URL, `og:title/description/image` (icons/og.png), Twitter card, `apple-touch-icon`, favicon (currently commented out — restore with real assets).
- Local dev remains `start.bat` (`python -m http.server 8083`); the SW registration is gated to `https:` so local file/HTTP dev never caches stale shells.

---

## 11. Manual QA checklist (Definition of Done for P0)

**Trust / export (the sacred contract)**
- [ ] `test-scripts/test_smf_bytes.html` passes: PPQ 480, tempo meta correct, notes at exact ticks, chords share a tick, velocities verbatim (45/100/127 tiers), channel-10 status bytes, two consecutive exports byte-identical.
- [ ] Program a hat ratchet ×3 + a ghost step + an accent step → export MIDI → import into Cakewalk (owner's DAW), FL Studio, Ableton: drums land on the decree's GM notes, velocities ≈45/100/127, ratchet audible as 3 notes inside one 16th.
- [ ] Export stems: zip contains one WAV per active instrument + `mix.wav` + the `.mid`; stems start sample-aligned at t=0; soloing stems in a DAW ≈ the mix; render ≤10s for a 4-pattern chain.
- [ ] Swing 6/10 at 90 BPM and 160 BPM: exported tick offsets are the same fraction of a step; playback feels identical to export (bounce and phase-compare by ear).
- [ ] Legacy `io808-save.json` v1 file loads and migrates; v2 `.groove.json` round-trips velocities, sfx, chain.

**Sound engine**
- [ ] Tune knob audibly pitches every tonal voice ±5 semitones; 10 rapid triggers = identical pitch (no compounding).
- [ ] CH chokes OH; OH decay knob sweeps 0.15–0.9s; hats/cymbal show metallic bank character (not flat noise); CP clap has the 3-spike flam + tail.
- [ ] 10-minute playback at 160 BPM with dense 16th hats: zero dropped hits, zero console errors, playhead never desyncs.
- [ ] Pan knobs audibly pan; master Drive/Glue/accent knobs work; accented steps hit harder and push the bus.
- [ ] All 58 presets and 113 dropdown sequences load with zero unmapped-hit warnings; crash hits from inspiration data now audible.

**Workflow**
- [ ] Kill-tab test: make 5 edits, kill the tab, reopen → exact state restored ≤1s (patterns, velocities, chain, tempo, knobs, mute/solo).
- [ ] Undo: 50-step mixed sequence (toggles, velocity drags, preset load, clear, chain edit, project load) fully reversible; knob gesture = one undo step; redo works; preset load = one step.
- [ ] Share: copy link in Chrome → open in Firefox private window (no localStorage) → identical beat + BPM; URL ≤2000 chars; visitor's own autosave untouched until they edit.
- [ ] Chain: AAAB chain of 8 slots plays with bar-quantized switching and visible active slot; DUP→ copies A into next slot; chain exports as full song (MIDI + WAV).

**Playability / UX**
- [ ] Cold first visit: demo beat audible within 2 gestures; the very first step-tap makes sound (unlock race won).
- [ ] Space toggles play everywhere except inputs/modals; `?` lists every shortcut; tap-tempo: 4 taps at ~96 BPM → 96±1 mid-playback, no glitch; metronome toggles while playing.
- [ ] QWERTY pads: key→sound ≤20ms desktop Chrome (loopback measure); MIDI controller note-on triggers with velocity; record arms only while playing and quantizes correctly across the loop seam.
- [ ] Preset browser: search "trap" filters ≤150ms; favorites persist; every load toasts with a working Undo.
- [ ] Touch (375px): knobs/sliders draggable via pointer; steps ≥44px; grid scrolls as ONE surface with pinned instrument labels; no page-level horizontal scroll; long-press opens the step menu; velocity drag works.
- [ ] iOS Safari: lock the phone 60s mid-session, unlock, press play → sound within 1s (context resume).
- [ ] Keyboard-only: tab to the grid, arrows navigate, Enter toggles; focus visible everywhere; NVDA announces step name+state and play/stop; `prefers-reduced-motion` stills the nixie and all pulsing.

**Platform**
- [ ] DevTools offline after first load → app fully functional (play, edit, export MIDI + WAV, save project).
- [ ] Zero requests to any third-party host; Lighthouse: installable PWA, a11y ≥90, no console errors.
- [ ] `_headers` live on the deployed site (check response headers); 404 page renders; OG preview correct in a link expander.
- [ ] Regression sweep: A/B variations, mute/solo, modal editing, clear-drag pattern length, column/row bulk toggles, help modal — all behave as before.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Engine swap changes the sound of existing presets | Voice specs derived from current behavior + circuit analysis; A/B listen check in QA; params.js keeps every constant in one reviewable table |
| `Tone.Offline` differs from live context in v14.8.49 | Factories take `(context, destination)` and are tested inside Offline first; +1.5s render tail; stems QA'd by ear against live |
| Snapshot-diff undo misses a mutation path | Undo + autosave share one commit stream; kill-tab QA exposes gaps; 5s interval-diff fallback |
| Share-URL schema locked before all features exist | `v` field + `ext` bag; decoders ignore unknown keys; v2 URLs valid forever |
| app.js edit stages conflict with each other | Strict E→F sequence, line-anchored edit lists, F rebases on E's landed file; both keep legacy fallbacks behind `window.X` guards |
| Boot loader import fails for one module | Every import individually try/caught — a broken module is a silent no-op, app keeps working |
| localStorage quota (full A/B bank ≈ 100–300KB) | Sparse encoding via the share serializer if >1MB; 5MB quota is ample |
| Vendored Tailwind Play script still console-warns | Accepted for P0 (byte-identical behavior, offline-safe); real freeze is P1 item #1 |

---

## 13. WS-J final integration QA report (2026-07-29, localhost:8083, Chromium)

Legend: **VERIFIED** = exercised and green in this pass · **VERIFIED (WS-x)** = proven by that workstream's recorded test battery, spot-checked here · **NEEDS-BROWSER/MANUAL** = requires a device, DAW, deployment, or human ears · **WAIVED** = out of P0 reach with reason.

### Integration work landed (beyond the checklist)

- `js/main.js` boot loader created per §6.3 (load+50ms, sequential try/caught imports of all 22 modules with `await m.init?.(window.GC)`, 9 CSS links injected with onerror cleanup, SW registration gated to https).
- `index.html`: vendored Tone/Tailwind/fonts, midi-writer importer deleted, self-only CSP, manifest/favicon/apple-touch/OG/Twitter/canonical meta, `js/main.js` last; CP row (after SD) + AC accent row (last, no level/gain/mute/solo) with all 16 cells each; Decree 1 relabels (HC HI CONGA / MC MID CONGA / LC LOW CONGA / CH CLOSED HAT — badges, tooltips, titles; codes and ids untouched); `#masterDrive`/`#masterGlue`/`#accentAmount` knobs (data-value 0/0/5) beside `#masterVolume`; `#recordBtn` + `#midiInBtn` placeholders beside `#playButton`; RHYTHM CONCEPTS tab + `#rhythm-tab` deleted (duplicate knob ids gone — now exactly 1 of each); afrobeats option corrected to 90 BPM (matches presets.js); all 16 `.pattern-label` tooltips normalized to the click-to-toggle wording; `#helpModal` rewritten as a task + shortcut reference matching the `?` overlay (artist name-drops removed).
- **Integration defects found and fixed** (trivial, genuinely required):
  1. `js/io/export-midi.js` never loaded `js/io/smf.js` → `window.GrooveSMF` was never attached and the ENTIRE new MIDI export was dead at runtime (`buildBytes` returned null). Fixed with `import './smf.js'` + `import '../core/events.js'` (same-URL module cache no-op in the app; makes the module self-sufficient). Also added the pure `exportPatternToBytes(pattern, opts)` byte adapter WS-G's harness probes for.
  2. `js/io/export-audio.js` likewise never loaded `wav-encode.js`/`zip.js` → `window.GCWavEncode`/`GCZip` absent, WAV/stems dead at runtime. Fixed with `import './wav-encode.js'` + `import './zip.js'`.
  3. `js/perf/record.js` / `js/perf/midi-in.js` adopt-existing-button branch skipped the click binding and style injection, leaving the new static placeholders inert. Fixed (bind + injectStyles, dataset guard against double-bind); midi-in also hides the placeholder when Web MIDI is unsupported.
  4. `css/polish.css` accent-row `font-size: 0` collapsed the row's max-content width so accent cells misaligned with every other row on scrollable layouts. Fixed with `color: transparent` (intrinsic width kept); verified pixel-aligned.
  5. `app.js` (allowed trivial fixes): `knobValues` gained `masterDrive/masterGlue/accentAmount` + `levelCp/gainCp/panCp/tuneCp/shuffleCp`; dblclick defaults 0 for drive/glue in both knob paths; `cp` added to the three bulk-toggle/reset instrument arrays; `getInstrumentInfo` relabeled to decree names + `cp` entry (modal titles now honest).

### §11 checklist status

**Trust / export**
- [x] `test_smf_bytes.html` — **VERIFIED**: PASS, 14/14 green (480 PPQ, tempo meta 128 BPM exact, channel 10, chords share tick 0, ghost 45 / accent 127 verbatim, ratchet ticks 1440/1480/1520, byte-identical re-exports) — using the new `exportPatternToBytes` adapter. Was amber-skipped before the smf.js import fix.
- [ ] DAW import (Cakewalk/FL/Ableton) — **NEEDS-MANUAL** (DAW on the owner's machine; byte-level equivalents all verified above + by WS-B's SMF-parsing harness).
- [~] Stems zip — **VERIFIED (WS-B)** (6-file zip in 1.0 s, ≤10 s budget); WS-J additionally fixed and re-verified the module wiring that made it reachable in the real app (`GCZip`/`GCWavEncode` now attach; `GCExportAudio.renderMix/renderStems` present). Sample-alignment listening check **NEEDS-MANUAL**.
- [ ] Swing 6/10 at 90/160 BPM phase-compare — **NEEDS-MANUAL** (by-ear); tick math tempo-relative by construction (WS-A events tests VERIFIED).
- [x] v1 migration + v2 round-trip — **VERIFIED**: `test_state_roundtrip.html` PASS 9/9 (true→100, share round-trip 431 chars, kill-tab restore).

**Sound engine**
- [~] Tune ±5 st, no compounding — **VERIFIED (WS-A)** (measured +5.05/−4.94 st, 0.024 st drift over 10 rapid hits).
- [~] CH chokes OH, OH decay 0.15–0.9 s, metallic bank, CP 3-spike flam — **VERIFIED (WS-A)** offline-render battery.
- [ ] 10-minute 160 BPM stress — **NEEDS-BROWSER** (long-run); live playback here: correct step cadence (11 step events / 1.5 s at 110 BPM), zero errors, engine `ready` with kit built.
- [~] Pan/Drive/Glue/accent knobs — knob→engine routing **VERIFIED** live (`GCKnobs.set('masterDrive'|'accentAmount')` → `knobValues` → `GrooveAudio.master.set`, no errors); audible A/B **NEEDS-MANUAL**.
- [x] All 58 presets + 113 grooves load clean — **VERIFIED**: automated sweep loaded all 171 with ZERO console errors and zero unmapped-hit warnings; cp/cr rows light up (dubstep_modern shows 2 cp hits + separate ch line).

**Workflow**
- [~] Kill-tab restore — **VERIFIED** via test-page simulation (exact deep-equal restore); real kill-tab **NEEDS-BROWSER**.
- [~] Undo 50-step mixed — **VERIFIED (WS-C)**; WS-J spot check green (step toggle → undo restores prior state).
- [~] Share cross-browser — encode/decode round-trip **VERIFIED** (test page); Chrome→Firefox private window **NEEDS-MANUAL**.
- [~] Chain AAAB + export — chain bar/state (`GCChain.state = {mode:'loop', slots:[…8]}`) **VERIFIED** present and matches the shape export-midi reads; bar-quantized audible switching **VERIFIED (WS-D)**; chain WAV/MIDI file check **NEEDS-MANUAL**.

**Playability / UX**
- [ ] Cold first visit ≤2 gestures — **NEEDS-BROWSER** (fresh profile); onboarding demo beat + first-gesture unlock observed working in this session's fresh-cache loads.
- [~] Space/?/tap/metronome — **VERIFIED (WS-D)**; `?` overlay opens with pads section here (Esc close needs real focus — works with trusted keys per WS-D).
- [~] Pads ≤20 ms / MIDI-in / record — **VERIFIED (WS-D)**; WS-J fixed the placeholder adoption so `#recordBtn`/`#midiInBtn` are actually clickable; REC/MIDI IN render styled next to PLAY.
- [~] Preset browser — **VERIFIED (WS-H)**; BROWSE (171) button present, search/favorites exercised there.
- [~] Touch 375 px — **VERIFIED (WS-H)** at 375 px; accent-row alignment fix re-verified on the scrollable layout.
- [ ] iOS Safari lock/unlock resume — **NEEDS-DEVICE**.
- [~] Keyboard-only + NVDA + reduced-motion — roving tabindex/ARIA **VERIFIED (WS-H)**; NVDA pass **NEEDS-MANUAL**.

**Platform**
- [ ] Offline after first load — **NEEDS-DEPLOY** (SW is https-gated by design; precache list verified: all 71 entries exist on disk).
- [x] Zero third-party requests — **VERIFIED**: full network log shows only localhost:8083 (fonts, Tone, Tailwind all vendored); every referenced file (62 URLs + 11 woff2) returns 200.
- [ ] Lighthouse installable/a11y ≥90 — **NEEDS-DEPLOY/BROWSER-TOOLING**.
- [ ] `_headers` live / 404 / OG preview — **NEEDS-DEPLOY** (files present and correct per §10; OG/canonical point at https://groovecore.pages.dev/ — update if the production domain differs).
- [x] Regression sweep — **VERIFIED**: A/B switch, mute/solo (incl. cp), step tiers (100/127/45/off + data-vel), bulk toggles (now include cp), help modal, tab cleanup (exactly one of each groove knob id), play/stop/step events, zero console errors across the entire session battery.

### Deviations / notes for the owner

- Canonical/OG URLs assume `https://groovecore.pages.dev/` (no domain was recorded anywhere in the repo) — swap in index.html if the real domain differs.
- `theme-color` meta updated `#232425` → `#0a0a0a` to match the manifest.
- Plain step-click **toggles** on/off (Shift=127, Alt=45 per WS-E); help copy documents that behavior.
- Bump `CACHE = 'gc-v1'` in sw.js on every deploy (WS-I note).
