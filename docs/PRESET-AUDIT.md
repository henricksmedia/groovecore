# GrooveCore Preset Audit — "Are my presets accurate?"

**Date:** 2026-07-29
**Scope:** all 58 style presets in `presets.js` and all 114 inspiration sequences in `inspiration-sequences.js` (172 items graded), plus structural validation of `index.html` dropdowns and `preset-meta.js`.
**Method:** six genre-family auditors (producer/drum-programming review, grading each pattern against its named genre), an independent judge pass on every "wrong" verdict, programmatic structural validation via Node loading the real data, and a fixer that applied every judge-confirmed correction. Every fix was re-verified programmatically afterward.

---

## 1. Executive summary

**Short answer: about 79% of your presets were accurate; 21% were not, and all of those are now fixed.**

- **172 items graded: 36 wrong (all confirmed by the judge, zero rejections), 136 authentic or acceptable.** All 36 wrong items received exact replacement patterns and were applied.
- The wrong items were not random — they cluster into **five systemic bugs**, each repeated across multiple presets:
  1. **8th-note kick plague** — `trance`, `psytrance`, `hardstyle` had a kick on every 8th note where these genres demand a strict quarter-note four-on-the-floor. At 138–150 BPM this played as a machine-gun double-time kick.
  2. **Dubstep with no halftime** — all four dubstep presets (`dubstep`, `dubstep_modern`, `dubstep_riddim`, `dubstep_melodic`) put snares on beats 2 and 4 instead of the genre-defining lone snare on beat 3. Comments even claimed "(half-time)"; the data wasn't.
  3. **Rock/metal 8th-resolution authoring bug** — `classic_rock`, `hard_rock`, `power_metal` (and, harmlessly, punk/thrash/black/death) were written as if 16 steps were two bars of 8ths, so they played as a double-time hardcore skank with zero backbeat. Fine for punk and thrash; genre-destroying for classic rock.
  4. **The old-label instrument trap** — `afrobeats` and `afro_house` had their entire hi-hat drive authored on `hc` (high conga), so the top end fired as a metronomic conga rattle, while their clap-intent line sat on `ch` (closed hi-hat). Both fully remapped.
  5. **Wrong-format inspiration data** — `hiphop_2`, `hiphop_3`, `treq_7`, and `beat_2` were authored with beat numbers 1–16 (a 4-bar count) in a 1-bar 1–4.75 engine; every hit at beat ≥ 5 clamped onto the last 16th, so most of the pattern detonated simultaneously on step 16. `beat_2` was additionally **completely silent** — all its instrument names (`BD_BAS`, `SD_SNA`, etc.) were unmapped.
- A sixth, smaller cluster: **scattered/displaced kicks and snares in individual inspirations** — 10 psy/trance entries with syncopated kicks where psytrance demands strict quarters, and 5 pop/country/indie/rnb entries with the backbeat snare displaced off beats 2/4 (`pop_11`'s flams at 1.95/3.95 were literally overwriting its backbeat velocities).
- Structurally the library is in **good shape**: all 18 instrument keys canonical, all step arrays exactly 16 cells of 0/1, no duplicate keys, all tempos in range, and 171/172 UI BPM labels matched the data (the one mismatch — afrobeats 100 vs 90 — is resolved).
- **Verified after fixes:** `node --check` passes on all three data files; a programmatic reload confirms 58 presets / 592 pattern rows, all instrument names map, no all-zero rows remain, all velocities 1–127, no fixed entry uses beats > 4.75, and all 171 `preset-meta.js` BPMs match the data.

---

## 2. Full verdict table

Verdicts: **AUTHENTIC** = a knowledgeable listener of that genre nods; **ACCEPTABLE** = recognizably the genre, with taste-level gripes; **WRONG** = a listener would say "that is not the genre" or the data is broken. All WRONG items were fixed.

### 2a. Style presets (presets.js) — 58 items

| Preset | BPM | Verdict | One-line issue |
|---|---|---|---|
| trap | 140 | acceptable | Textbook 140 trap core; over-orchestrated perc bed, tom fill every bar |
| drill | 150 | authentic | Idiomatic skipping kick, drill snare drag, correct hat holes |
| classic808 | 110 | authentic | Canonical Planet-Rock-lineage electro groove |
| phonk | 70 | acceptable | Solid Memphis halftime; cym on 1 is crash-intent (cosmetic); 4 dead conga rows removed |
| driftphonk | 155 | authentic | Prominent cowbell line is exactly the drift signature |
| boom_bap | 92 | acceptable | Textbook Premier-grid core; cowbell on every "a" isn't boom-bap vocabulary |
| gangsta_rap | 88 | acceptable | Plays fine, but literal pattern duplicate of boom_bap — zero G-funk identity |
| neo_soul_rap | 85 | acceptable | Dilla-adjacent 3-3-2 kick carries it; oh every "a" heavy for the pocket |
| treq | 128 | acceptable | Coherent big-tent house; on-beat hats less pumpy than offbeats |
| treq_empire | 132 | acceptable | Nothing misplaced; rim exactly doubles oh, busy static perc |
| treq_electronic | 130 | acceptable | Driving techno-flavored; clap on push hits unusual |
| jerseyclub | 130 | **WRONG → fixed** | Straight 8th kicks erased the genre; replaced with signature tresillo+backbeat kick (steps 1,4,7,11,13) |
| indiedance | 125 | acceptable | Idiomatic nu-disco; oh under the kick on downbeats is odd |
| ukgarage | 130 | **WRONG → fixed** | No backbeat anywhere (snares on 3/8/11/16); replaced with 2-step backbeat on 5/13 + ghosts on 11/16 |
| basshouse | 128 | acceptable | Minimal, correct bass-house bones |
| trance | 138 | **WRONG → fixed** | Kick on every 8th at 138; now quarter-note 4-on-the-floor, oh moved to signature offbeat 8ths |
| psytrance | 142 | **WRONG → fixed** | Same 8th-note kick bug; now strict quarter kick (the "roll" lives in the 16th ch/ma rows, which were already right) |
| tech_house | 128 | acceptable | Correct skeleton; rim-as-offbeat-perc is a nice touch |
| deep_house | 120 | acceptable | Close to authentic; offbeat-8th mid conga is genuinely idiomatic |
| hardstyle | 150 | **WRONG → fixed** | 8th kicks = 300 hits/min gabber blur; now quarter-note distorted-kick pattern |
| futurebass | 150 | acceptable | Valid non-halftime skeleton; kitchen-sink percussion un-idiomatic |
| melodicfuturebass | 140 | acceptable | Clean and appropriately gentle; 2 dead all-zero rows (hc, mc) removed |
| aggressivefuturebass | 160 | acceptable | Festival-leaning but coherent; kick doubling the backbeat softens the crack |
| trapfuturebass | 145 | acceptable | Best skeleton of the four future-bass presets; perc stack dilutes it |
| glitchhop | 110 | authentic | Lurching chopped kick/snare sells the glitch; dead-center tempo |
| bass_music | 140 | acceptable | Comment says "half-time kick" but data is 4-on-floor — defensible under the umbrella term |
| dnb | 174 | authentic | Credible programmed two-step break at the genre-center tempo |
| dubstep | 140 | **WRONG → fixed** | Backbeat snares where halftime demands snare on beat 3 only; fixed (bd 1 + and-of-2, sd step 9, crash-intent cym → cr) |
| dubstep_modern | 140 | **WRONG → fixed** | Same defect; fixed (sd+cp on step 9, bd 1 + step 11, cym → cr) |
| dubstep_riddim | 150 | **WRONG → fixed** | Riddim is the most rigidly halftime subgenre; fixed (sd+cp step 9, bd 1 + step 15, cym → cr) |
| dubstep_melodic | 140 | **WRONG → fixed** | Same defect; fixed (single kick on 1, big lonely snare+clap on step 9, cym → cr) |
| afrobeats | 90→100 | **WRONG → fixed** | Hi-hat drive authored on high conga (old-label trap) + clap-intent on ch + BPM label/data mismatch; full remap (hc→ch, ch→cp, hc removed), bpm 90→100 |
| latintrap | 90 | acceptable | Genuinely Latin doubled-tresillo kick; no hat language at all for something called "trap" |
| afro_house | 122 | **WRONG → fixed** | Same old-label trap as afrobeats; same remap applied, bpm 122 kept |
| treq_synthpop | 135 | acceptable | Correct post-hygiene cp use; hats on every odd 16th rather than classic off-8ths |
| kpop | 110 | authentic | Dense-but-coherent K-pop dance-pop kit |
| kpopballad | 85 | authentic | Exactly what an 85 BPM K-ballad should be; 2 dead rows (hc, mc) removed |
| kpopdance | 125 | authentic | Instantly reads K-pop dance; ma doubling ch is white-noise-ish |
| kpophiphop | 95 | authentic | Classic boom-bap-adjacent kick at the right tempo |
| folktronica | 115 | authentic | Clicky Four-Tet-style lattice; the no-snare choice is correct |
| breakbeat | 170 | acceptable | The break is good, but 170 is jungle territory for a "breakbeat" label |
| indie | 120 | acceptable | Works, but core rows are byte-identical to indiedance |
| traditional_country | 100 | acceptable | Works as an 808 stomp; cowbell on the "a" 16ths, Nashville-via-Havana clutter |
| outlaw_country | 105 | acceptable | Core reads country-rock; ma/cl/cb triple layer too busy for "outlaw" |
| pop_country | 105 | acceptable | Radio country-pop; cym single hit on step 16 mislabeled as a downbeat crash |
| bro_country | 110 | acceptable | Bombastic but that's the genre; cl/oh collisions on the "a"s |
| modern_country | 115 | acceptable | Cohesive Nashville-pop; cluttered percussion |
| bluegrass | 120 | **WRONG → fixed** | Latin tresillo kick + snares ahead of the backbeat; replaced with 2-beat boom-chick (bd 1/9/15, sd 5/13) |
| alternative_rock | 130 | acceptable | Has the real backbeat; core identical to indie/indiedance |
| classic_rock | 125 | **WRONG → fixed** | 8th-resolution bug = double-time polka at effective 250 BPM; replaced (backbeat 5/13, 8th hats, kick 1/7/9/15, cym→cr, dead rim row dropped) |
| hard_rock | 140 | **WRONG → fixed** | Same bug — hyper-speed skank, no backbeat; replaced (backbeat 5/13, driving kick, 8th hats, cym→cr) |
| punk_rock | 160 | acceptable | The same artifact lands here — it IS the punk polka/d-beat |
| cloud_rock | 120 | acceptable | Modern dreamy indie-pop groove fitting the concept |
| thrash_metal | 180 | acceptable | The skank is genuinely idiomatic at 180; 16th hats machine-gun |
| death_metal | 190 | acceptable | Reads extreme metal (gallop/bomb-blast hybrid) |
| black_metal | 170 | acceptable | Plays as first-wave punk-blast; byte-identical to thrash_metal except bpm |
| power_metal | 160 | **WRONG → fixed** | Was a third copy of the thrash skank; replaced with the genre signature: 16th double-kick + clean 5/13 backbeat, cym→cr |
| metalcore | 175 | acceptable | Legit At-The-Gates fast section; near-identical to death_metal |

### 2b. Inspiration sequences (inspiration-sequences.js) — 114 items

**Hip-Hop (10)**

| id | Verdict | One-line issue |
|---|---|---|
| hiphop_1 Boom-Bap Bounce | acceptable | Textbook golden-era core with real ghost dynamics; over-orchestrated tail |
| hiphop_2 Trap Snap | **WRONG → fixed** | Authored in 1–16 beat format: 71 of 95 hits clamped onto the last 16th (every voice detonating at once); full sequence replaced (30 hits, all on the 1–4.75 grid) |
| hiphop_3 Melodic Flow | **WRONG → fixed** | Identical defect (and a near-clone of hiphop_2); replaced with a softer 27-hit melodic profile so the two now actually differ |
| hiphop_4 Southern Trap | acceptable | Good half-time skeleton with dynamics; crash on 1 AND 3 every bar |
| hiphop_5 Drill Edge | acceptable | Proper drill kick/snare drag; 130 is below the 138–145 drill pocket |
| hiphop_6 Melodic Rap | acceptable | Displaced first snare gives a lazy lean that works at 91 |
| hiphop_7 Old-School Revival | acceptable | Tidy generic skeleton; nothing specifically old-school about it |
| hiphop_8 Cloud Rap Drift | acceptable | Sparseness suits cloud rap; near-duplicate of hiphop_7 |
| hiphop_9 Funk Bounce | acceptable | Best ghost-note writing in the family; usual perc clutter |
| hiphop_10 East Coast Grit | acceptable | Proper 90s pocket at the right tempo |

**EDM (11, incl. beat_2)**

| id | Verdict | One-line issue |
|---|---|---|
| edm_1 Progressive Build | authentic | Minimal build seed, sensible velocity tiers |
| edm_2 Festival Drop | acceptable | Works; 16-voice percussion confetti, double crash per bar |
| edm_3 House Groove | acceptable | Grooves; same kitchen-sink gripe |
| edm_4 Tech House Roll | acceptable | Reads tech house; scattered ch instead of steady offbeats |
| edm_5 Future Bass Drop | acceptable | Idiomatic dotted-8th kick chain, well-shaped velocities; cluttered drop |
| edm_6 Big Room Anthem | authentic | Textbook minimal big-room bones |
| edm_7 Bass House Wobble | acceptable | Fine; confetti/double-crash gripes |
| edm_8 Melodic Techno | authentic | Actually evokes melodic-techno restraint |
| edm_9 Drum & Bass Break | acceptable | Credible break at 170; hats authored on fictional 32nd offsets that silently round |
| edm_10 Hardstyle Surge | acceptable | All four quarter kicks present; conga/cowbell clutter is un-hardstyle |
| beat_2 Treq Example | **WRONG → fixed** | Was 100% silent (unmapped BD_BAS/SD_SNA/CP_CLAP… names) + 1–16 beat numbers + missing from the UI dropdown; fully rewritten in canonical names on the 1–4.75 grid — its cp claps are now the first live use of the handclap voice in the inspiration library |

**Trance (10)**

| id | Verdict | One-line issue |
|---|---|---|
| trance_1 Uplifting Build | acceptable | Sound; percussion confetti not very trance |
| trance_2 Progressive Pulse | acceptable | Works as a build seed; "e"-position hats limp |
| trance_3 Vocal Trance | **WRONG → fixed** | No backbeat at all (kick 1/3, snares 2.5/4.5); fixed to 4-on-the-floor kick + snare on 2/4 |
| trance_4 Psy-Trance Fusion | **WRONG → fixed** | 118 BPM psy (floor is ~138) + tresillo kick scatter; replaced, bpm 118→140 |
| trance_5 Euphoric Rise | authentic | No snare = a rise section; exactly right |
| trance_6 Dreamy Layers | acceptable | Coherent breakdown skeleton |
| trance_7 High-Energy Peak | **WRONG → fixed** | Gallop kick with nothing on beats 2/4 at 142; now relentless 4-on-the-floor @120, offbeat hats |
| trance_8 Melodic Break | acceptable | Offbeat snare defensible inside a named Break |
| trance_9 Psy Fusion | **WRONG → fixed** | Three scattered kicks, no quarter pulse; now 4-on-the-floor @115 |
| trance_10 Vocal Harmony | acceptable | The one minimal trance entry with hats in the right place |

**Psytrance (10)**

| id | Verdict | One-line issue |
|---|---|---|
| psy_1 Rolling Bass | **WRONG → fixed** | Kick scatter missing beats 2/4 (rolling is the bassline's job, not the kick's); bd → 4 quarter kicks, all other rows kept |
| psy_2 Psy Roll | **WRONG → fixed** | Dotted-8th kick polyrhythm, no floor pulse; → quarters + authored 4.75 pickup kept |
| psy_3 Full-On Peak | **WRONG → fixed** | Same scatter template; → strict 4-on-the-floor |
| psy_4 Goa Trance | **WRONG → fixed** | 115 BPM goa (norm 135–148) + off-grid triplet kicks; → quarters, bpm 115→138 |
| psy_5 Hi-Tech Edge | **WRONG → fixed** | Off-grid kicks (2.8/3.2/4.6) rounding randomly; → quarters |
| psy_6 Dark Psy | authentic | The one scatter-free psy entry — correct minimal skeleton |
| psy_7 Progressive Psy | **WRONG → fixed** | Pop backbeat (kick 1/3), not psy; → unbroken 4-on-the-floor + offbeat hats |
| psy_8 Full-On Drive | **WRONG → fixed** | Same scatter as psy_1; → quarters |
| psy_9 Goa Wave (Shpongle) | acceptable | Downtempo psybient loping triplets match the named reference; triplet beats silently round |
| psy_10 Hi-Energy Psy | **WRONG → fixed** | Kick misses beats 2 and 3; → quarters |

**Pop (13)**

| id | Verdict | One-line issue |
|---|---|---|
| pop_1 Catchy Hook | authentic | Model pop programming for this engine |
| pop_2 Upbeat Anthem | acceptable | Solid; snare 4.75+4.85 both round to step 16 (flam collapses, last-write-wins) |
| pop_3 Emotional Ballad | authentic | Correct ballad language at the correct tempo |
| pop_4 Dancefloor Pop | acceptable | Near-full-velocity kick at 1.25 makes beat 1 stumble |
| pop_5 Viral Hit Groove | authentic | Very current pop/afro-pop-lite feel |
| pop_6 Synth-Pop Fusion | authentic | Nods |
| pop_7 Empowering Chorus | acceptable | Anthem drowns in 95–110-velocity percussion |
| pop_8 Retro Vibes | acceptable | Thin hat language; oh doubling the snare on 2/4 is odd |
| pop_9 Heartbreak Pulse | authentic | Correct mood-pop language |
| pop_10 Summer Jam | authentic | Nods |
| pop_11 Summer Jam Variation | **WRONG → fixed** | Flam ghosts at 1.95/3.95 rounded onto steps 4/12 and OVERWROTE the backbeat (played at vel 60/65 instead of 110/115); flams moved to 1.75/3.75 |
| pop_12 Catchy Hook Variation | acceptable | End-bar snare double collapses on step 16; otherwise a good variation |
| pop_13 Upbeat Anthem Variation | acceptable | 3-hit accelerating end-bar roll becomes 2 hits (step-16 collision) |

**R&B (10)**

| id | Verdict | One-line issue |
|---|---|---|
| rnb_1 Smooth Groove | acceptable | Sparse minimal seed; kick buries the lone snare |
| rnb_2 Soulful Build | acceptable | 2.5/4.5 displacement is idiomatic for the cited sexy-drill groove |
| rnb_3 Neo-Soul | acceptable | Near-clone of rnb_1 |
| rnb_4 Trap R&B | acceptable | Zero closed hats — the defining trap signifier is absent; still usable |
| rnb_5 Vocal Layers | acceptable | Floaty neo-soul displacement; rim-on-2 anchors it |
| rnb_6 Alternative R&B | acceptable | Half-time-feel displacement idiomatic for the rage aesthetic |
| rnb_7 Funk Revival | **WRONG → fixed** | Funk with every snare on the off-8th after the backbeat; snares moved 2.5→2 and 4.5→4 (cowbell on 2 now reinforces, as a funk cowbell does) |
| rnb_8 Emotional Soul | acceptable | Hit-for-hit duplicate of rnb_1 (only bpm differs) |
| rnb_9 Retro Smooth | acceptable (borderline) | No downbeat anywhere, lone snare masked by the kick |
| rnb_10 Vulnerable Flow | acceptable | Sparse, moody, coherent |

**K-Pop (10)**

| id | Verdict | One-line issue |
|---|---|---|
| kpop_1 Syncopated Beat | authentic | Best of the set — genuinely BTS-ish syncopation with true ghosts |
| kpop_2 High-Energy Drop | authentic | Right 4th-gen drop language at 130 |
| kpop_3 Melodic Sync | authentic | Correct mid-energy verse groove |
| kpop_4 Bubblegum Pop | authentic | Convincing NewJeans-adjacent bounce |
| kpop_5 Boy Band Sync | acceptable | Displaced snares mostly read as a missing backbeat |
| kpop_6 Girl Group Power | acceptable | Correct skeleton, zero dynamics — "Power" it is not |
| kpop_7 Retro K-Pop | acceptable | Coherent sparse half-time seed |
| kpop_8 Dynamic Shift | acceptable | Displacement matches the concept |
| kpop_9 Choreo Beat | authentic | Punchy choreography-count feel |
| kpop_10 Youthful Pop | authentic | Convincing bright-light groove |

**Rock (10)**

| id | Verdict | One-line issue |
|---|---|---|
| rock_1 Classic Riff | authentic | Textbook rock backbeat with real dynamics |
| rock_2 Alt Anthem | acceptable | Good syncopated groove; kitchen-sink top, crash on 1 AND 3 |
| rock_3 Punk Drive | acceptable | Grooves hard but isn't punk language (no straight-8th hats) |
| rock_4 Grunge Revival | authentic | Subdued velocities read properly grungy |
| rock_5 Indie Rock Steady | acceptable | Near-identical clone of rock_1/rock_4 |
| rock_6 Hard Rock Riff | acceptable | Correct (gets right what style:hard_rock got wrong); Skeleton-A clone |
| rock_7 Post-Punk | acceptable | Fine, but nothing post-punk about it |
| rock_8 Garage Revival | acceptable | Correct, unremarkable; duplicate title with indie_10 |
| rock_9 Emo Revival | acceptable | Correct midtempo rock; clone |
| rock_10 Stadium Rock | acceptable | Most generic of the ten |

**Country (10)**

| id | Verdict | One-line issue |
|---|---|---|
| country_1 Honky-Tonk Stomp | authentic | Clean modern-country stomp |
| country_2 Barroom Ballad | **WRONG → fixed** | Both main snares displaced (2.5/4.25) — the bar stumbled every loop; moved to dead-center 2/4 (velocities 82/88 kept) |
| country_3 Twangy Upbeat | acceptable | Grooves; busy kitchen-sink tail |
| country_4 Southern Rock | authentic | Laid-back southern backbeat, appropriately sparse |
| country_5 Acoustic Folk | authentic | Gentle folk-pop brush groove |
| country_6 Party Country | acceptable | Near-exact clone of country_1 |
| country_7 Heartland Ballad | acceptable | Correct half-time; opens on a vel-50 hat with no downbeat kick |
| country_8 Outlaw Twang | **WRONG → fixed** | Entire backbeat shifted onto the "ands" (2.5/4.5); moved to square 2/4 |
| country_9 Neon Nights | acceptable | First backbeat a 16th late; cowbell-forward novelty fits the reference |
| country_10 Traditional Stomp | acceptable | Sound groove; "traditional" it is not (percussion parade) |

**Indie (10)**

| id | Verdict | One-line issue |
|---|---|---|
| indie_1 Chill Strum | acceptable | ~30 events across 13 voices is the opposite of chill, but hangs together |
| indie_2 Dreamy Wave | **WRONG → fixed** | Snares at 2.75/4.25 read as a timing error at 86 BPM; moved to soft on-backbeat 2/4 (velocities 72/78 kept) |
| indie_3 Alt Edge | authentic | Tight, dry, Arctic-Monkeys-appropriate |
| indie_4 Folk-Indie | acceptable | Same kitchen-sink as indie_1; low velocities keep it plausible |
| indie_5 Shoegaze Haze | acceptable | Offbeat snare defensible as psych wooze |
| indie_6 Garage Rock | acceptable | Clone of indie_3 at -5 velocity |
| indie_7 Indie Folk | authentic | Sparse, hushed, Bon-Iver-appropriate |
| indie_8 Psychedelic Indie | acceptable | Literal clone of indie_5 |
| indie_9 Lo-Fi Chill | authentic | Characterful rim/snare split — idiomatic bedroom groove |
| indie_10 Garage Revival | acceptable | Grooves; conga/tom/double-crash payload fights the garage brief |

**Treq (10)**

| id | Verdict | One-line issue |
|---|---|---|
| treq_1 Raging Tom Tornado | authentic | Delivers exactly what it says — 16th tom cascades on every beat |
| treq_2 Snare Slash Frenzy | acceptable | Good swung groove; 4 snare events is not a frenzy |
| treq_3 Hi-Hat Helix Rush | acceptable | Hemiola authored on .33/.67 beats silently quantizes to 16ths — survives only approximately |
| treq_4 Tom Tumult Surge | acceptable | Same rounding; 3 toms is not a tumult |
| treq_5 Rimshot Rebellion | authentic | Six rimshots genuinely lead the pattern |
| treq_6 Cymbal Clash Craze | authentic | Unapologetic cymbal wash, exactly as advertised |
| treq_7 Hi-Hat Hysteria | **WRONG → fixed** | Multi-bar authoring: 10 hits at beats 5–12 all detonated on the last 16th, plus velocities 137/140/130/135 above the 127 max; full 17-hit replacement — now actually hat-led, all velocities legal |
| treq_8 Tom Terror Twist | acceptable | Quintuplet-ish .2/.4/.6/.8 grid rounds to ordinary syncopation |
| treq_9 Crash Cascade Chaos | authentic | Cascading crashes deliver the concept; rounding stacks only add to the chaos brief |
| treq_10 Tom and Crash Frenzy | acceptable | Good groove; "the mildest-mannered frenzy in the library" |

**Verdict tally by family** (judge confirmed every "wrong", rejected none):

| Family | Graded | Wrong (all fixed) |
|---|---|---|
| trap-drill-hiphop | 18 | 2 |
| house-techno-electronic | 41 | 18 |
| dubstep-bass-dnb | 13 | 4 |
| afro-latin-caribbean | 3 | 2 |
| pop-kpop-rnb-funk | 38 | 2 |
| rock-breaks-other | 59 | 8 |
| **Total** | **172** | **36 (21%)** |

---

## 3. What was fixed and why

Every fix used the auditor's exact replacement, confirmed by an independent judge pass, and changed only the rows/hits identified as wrong — texture rows and authored character were preserved verbatim wherever possible.

**Style presets (presets.js), 16 fixed:**

1. **jerseyclub** — bd row replaced with the signature tresillo+backbeat kick (steps 1, 4, 7, 11, 13). Jersey club *is* its kick figure; straight 8ths erased the genre.
2. **ukgarage** — sd row replaced: backbeat on 5/13 with skippy ghosts on 11/16. The old data had no backbeat anywhere.
3. **trance / psytrance / hardstyle** — the 8th-note kick rows became strict quarter-note four-on-the-floor; trance's open hat also moved to the genre-signature offbeat 8ths (3/7/11/15).
4. **dubstep / dubstep_modern / dubstep_riddim / dubstep_melodic** — converted to true halftime: snare (and clap where present) on step 9 only, sparser kicks, and the crash-intent `cym` (ride) hit retargeted to the `cr` (crash) voice. Each variant got a slightly different kick bounce so the four presets now differ.
5. **afrobeats / afro_house** — the old-label instrument trap: the dense hat line authored on `hc` (high conga) moved to `ch` (yielding steps 8/16 to the open hat, since the engine has no hat choke group); the clap-intent `ch` backbeat line moved to the `cp` handclap voice; the `hc` row removed. afrobeats bpm corrected 90→100, which also resolves the one UI-label/data mismatch in the app.
6. **bluegrass** — bd/sd replaced with the flat 2-beat boom-chick (bd 1/9 + pickup 15, chop strictly on 5/13); the old data was a Latin tresillo with snares ahead of the backbeat.
7. **classic_rock / hard_rock** — the 8th-resolution authoring bug fixed: real 2&4 backbeat, 8th-note hats, idiomatic kicks, crash moved from cym to cr; classic_rock's dead all-zero rim row dropped.
8. **power_metal** — replaced with the actual genre signature: relentless 16th double-kick under a clean 5/13 backbeat (it was a third literal copy of the thrash skank).
9. **Dead-row cleanup** — 9 all-zero pattern rows removed: phonk (cb, hc, mc, lc + orphan congas header comment), melodicfuturebass (hc, mc), kpopballad (hc, mc). 601 → 592 rows, verified.

**Inspiration sequences (inspiration-sequences.js), 20 fixed:**

1. **hiphop_2 / hiphop_3** — full sequence replacements. Both were authored in a 1–16 beat format the loader doesn't support: 71 of 95 hits clamped onto the final 16th of the bar. hiphop_2 is now a 30-hit half-time trap groove; hiphop_3 a 27-hit softer melodic profile, so the two (previously near-identical clones) now differ.
2. **beat_2 "Treq Example"** — full rewrite. It played *nothing*: every instrument name (BD_BAS, SD_SNA, RS_RIM, CH_CL, CR_CRA, CP_CLAP) was unmapped, and 12 hits also used 1–16 beat numbers. The rewrite uses canonical names on the legal grid, preserves its quoted-key style and `bars: 1`, and makes its offbeat `cp` claps the first working use of the handclap voice in the inspiration library.
3. **trance_3 / trance_4 / trance_7 / trance_9** — kicks restored to four-on-the-floor (the non-negotiable trance pulse); trance_4 also re-tempoed 118→140 (a psy fusion cannot sit at 118); hats moved off the limping "e" positions to real offbeats where specified.
4. **psy_1 / psy_2 / psy_3 / psy_4 / psy_5 / psy_7 / psy_8 / psy_10** — only the bass_drum hits replaced with strict quarter-note kicks (psytrance's "rolling" element is the bassline, not the kick); every other authored row kept verbatim. psy_2 keeps its authored 4.75 pickup; psy_4 re-tempoed 115→138 (goa norm).
5. **pop_11** — the two flam ghosts moved 1.95→1.75 and 3.95→3.75. As authored they rounded onto the same steps as the main backbeat snares and, being later in the sequence, overwrote them — the groove audibly had no backbeat.
6. **rnb_7 / country_2 / country_8 / indie_2** — displaced main snares squared to beats 2/4 (velocities preserved). In each, the backbeat displacement read as a timing error, not a style choice — funk and country ballads live dead-center on 2 and 4.
7. **treq_7 "Hi-Hat Hysteria"** — full replacement: 10 hits at beats 5–12 were clamping onto the last step, and four velocities (137, 140, 130, 135) exceeded the 127 format maximum. Now 17 hits, genuinely hat-led (it had only 3 hat events despite the title), all velocities legal.
8. **File header** — the stale "POP CATEGORY (10 sequences)" comment corrected to 13.

**preset-meta.js** — BPMs synced (afrobeats 90→100, trance_4 118→140, psy_4 115→138) and the stale header comment about afrobeats-at-90 rewritten. All 171 meta BPMs now match the data.

**Post-fix verification:** `node --check` passes on all three files; programmatic reload confirms 58 presets / 592 rows, every instrument key canonical, no all-zero rows, all cells strictly 0/1, every inspiration instrument name maps, all velocities 1–127, no fixed entry uses beats > 4.75.

---

## 4. What was deliberately left alone (and the judges' reasoning)

- **index.html** — outside this pass's allowed files (owned by other agents). Two items touch it:
  - The afrobeats "100 BPM" label mismatch was resolved data-side (presets.js now stores 100, matching the existing label) — **no HTML edit needed**.
  - **beat_2 is still missing from the Select Inspiration dropdown.** It now plays correctly via Random Inspiration, but adding the `<option>` needs an index.html edit. Recommended follow-up.
- **Off-grid triplet/quintuplet beats** in psy_9, treq_3, treq_4, treq_8, treq_9, edm_9, and psy_5's remaining oh@4.8 — the loader silently rounds these to the 16th grid, so the authored hemiola/shuffle feel survives only approximately. The auditors graded all of these **acceptable/authored-intent** (e.g. psy_9's loping triplets match its Shpongle reference; treq_8's rounding still lands as usable syncopation), and no exact replacement was specified — left as-is.
- **End-of-bar snare-roll collisions** in pop_2, pop_12, pop_13 (hits at 4.85/4.8/4.65 rounding onto step 16, last-write-wins) — graded acceptable in the family notes ("harmless but sloppy"); moving them to 4.5/4.75 was suggested but not confirmed as a fix.
- **The 205 commented-out `// Removed accent:` hits** — zero live accent data parses in the inspiration library even though app.js supports the accent flag. No spec existed to restore them; left commented.
- **Duplicate/clone presets** — gangsta_rap≡boom_bap, black_metal≡thrash_metal, metalcore≈death_metal, indie/indiedance/alternative_rock shared cores, rnb_8≡rnb_1, indie_5≡indie_8, indie_3≡indie_6, country_1≈country_6, the Skeleton-A rock/country clone flood, hiphop_7≈hiphop_8. All play *correctly*; differentiation is curation, not correctness — flagged, not changed.
- **cym-commented-as-crash** across futurebass ×4, bass_music, dnb, breakbeat, pop_country, bro_country, punk/thrash/death/metalcore, phonk — the ride firing where a comment says "crash" is musically harmless; only retargeted in presets that were already being fixed for other reasons.
- **Taste-level gripes** (over-orchestrated percussion beds, on-beat vs offbeat hat placement, oh-on-the-"a" habits, breakbeat's 170 BPM jungle stretch, bass_music's misleading "half-time" comment) — all graded acceptable; the presets read as their genres.
- **Mid-file indentation inconsistency** (2-space entries pop_1..trance_4 vs 4-space trance_5..beat_2; beat_2's quoted keys) — cosmetic; each entry's existing style was preserved per instructions.

---

## 5. Remaining opportunities

1. **Add beat_2 to the Select Inspiration dropdown** in index.html (one `<option>`; the data side is fixed and audible).
2. **Handclap (cp) adoption pass** — cp now has exactly two working uses (style:treq_synthpop and the rewritten beat_2). Layering cp with the snare on backbeats in kpop/kpopdance and the pop_/kpop_ inspirations is a cheap, genre-authentic win the auditors flagged repeatedly.
3. **Accent restoration pass** — decide whether the 205 commented-out accent hits should return (app.js already supports the flag) or be deleted outright as dead weight.
4. **Velocity-dynamics pass on the flat seeds** — the rnb_* and kpop_5–8 sequences are deliberate 8–9-hit seeds with flat velocities; ghost notes and hat accenting in the style of pop_1/kpop_1 would raise several "acceptable" items to "authentic".
5. **De-clone the library** — differentiate gangsta_rap from boom_bap, black_metal from thrash_metal, rnb_8 from rnb_1, indie_5 from indie_8, and thin the Skeleton-A rock/country clone flood; also resolve the duplicate "Garage Revival" title (rock_8 vs indie_10).
6. **Clean the fictional micro-timing** — re-author edm_9's 32nd-offset hats and the treq_3/treq_4/treq_8/treq_9 triplet/quintuplet beats onto real .0/.25/.5/.75 values (or add engine support for finer grids) so the stored data matches what actually plays.
7. **Afro family depth** — afrobeats and afro_house still share 12 of 13 rows; a real conga tumbao on afro_house's hc/mc/lc would separate the siblings. The afro-latin-caribbean family also has **zero inspiration sequences** — the only family with none.
8. **Percussion diet** — the recurring "kitchen-sink" gripe (rim+cb+cl+congas+maracas all at once) across trap, futurebass, country, and the flagship inspirations; thinning these beds is the single most repeated auditor note.

---

## Addendum (2026-07-29): Treq signature set re-authored

The 14 Treq-branded items were rewritten as an artist-catalog set (keys unchanged):

- **Style presets** (presets.js): `treq` → "Eyes Adjusting Slowly" (92 BPM downtempo folktronica), `treq_empire` → "We Are Still Here" (100 BPM cinematic tom build), `treq_synthpop` → "Say It Slow" (104 BPM warm synthpop), `treq_electronic` → "Fracture (Up Is Down)" (134 BPM melodic trance, quarter-note kick).
- **Inspiration sequences** (inspiration-sequences.js): `treq_1`–`treq_10` renamed to Treq catalog titles (Eyes Adjusting Slowly, What We Didn't Say, The Long Way Home, Fracture (Up Is Down), We Are Still Here, Walk With Her, Bass When It Drop, Black Velvet, Tribal Circuit, Misty Coastline), 25–31 hits each with real ghost-note/accent dynamics, all beats on the .25 grid (resolves item 6's treq_3/treq_4/treq_8/treq_9 off-grid values).
- Labels/BPMs synced in index.html and js/data/preset-meta.js. Note: the inspiration loader has no clap mapping, so the sequences use rimshot/ghost-snare color instead of cp.

**Addendum 2 (2026-07-29):** Five new style-named Treq presets added to presets.js (keys `treq_coastal` 84, `treq_forest` 96, `treq_glacial` 108, `treq_stormfront` 138, `treq_tribal` 122) — Coastal Downtempo, Forest Folktronica, Glacial Synthwave, Stormfront Trance, Tribal Circuitry — synced into index.html and preset-meta.js (style count now 63). Existing 14 Treq entries untouched.

**Addendum 3 (2026-07-29):** All 14 Treq entries renamed to style-only display names (keys/BPMs/patterns unchanged): styles — Misty Folktronica (treq), Cinematic Tribal (treq_empire), Warm Synthpop (treq_synthpop), Melodic Trance (treq_electronic); grooves treq_1–treq_10 — Misty Downtempo, Ghost-Note Indie, Walking Folk-Pop, Peak Trance, Tribal Heartbeat, Indie Dance Lilt, Bass Drop Energy, Slow Swagger Shuffle, Conga Circuit, Coastal Ambient. Synced across inspiration-sequences.js, index.html, and preset-meta.js; no duplicate display names against the rest of either dropdown.

**Addendum 4 (2026-07-29):** Twenty more Treq style presets added from the owner's own directions (stored verbatim in docs/TREQ-PRESET-DIRECTIONS.md, which doubles as Suno style-prompt material): Night River 808 (132), Chrome Slide 808 (92), Velvet Knock (108), Swamp Pressure (72), Broken Neon (150), Ghost Machine (78), Funk Circuit (116), Basement Siren (124), Glass Snare 808 (130), Afterhours Cowbell (112), Static Hat Grid (138), Ritual Clap (122), Warehouse Core 808 (136), Liquid Sub Runner (174), Jersey Bounce 808 (145), Dub Chamber 808 (124), Latin Pressure 808 (96), Footwork Needle 808 (160), Boom Room 808 (88), Trance Gate 808 (128). Triplet directions approximated as tresillo/broken-16th placements per the 16-step grid; FX/texture descriptors intentionally not encoded. Treq style total now 29; overall style count 83. Synced in index.html and preset-meta.js.
