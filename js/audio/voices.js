/**
 * GrooveCore — js/audio/voices.js  (WS-A)
 *
 * Circuit-accurate per-hit voice factories for the 17 canonical voices.
 *
 * Every hit builds a small disposable node graph, schedules it against the
 * caller's `time`, and tears itself down afterwards. Nothing envelope-driven
 * is ever mutated on a live node — Tune (and every other knob) is read from
 * the stored param table at trigger time and baked into the fresh graph, so
 * ten rapid hits pitch identically (the dead / compounding Tune bug class is
 * structurally impossible here).
 *
 * `GrooveAudio.buildVoices(destination)` builds a complete kit bound to the
 * CURRENT Tone context — call it inside a `Tone.Offline` callback and the
 * whole engine renders offline for WAV / stem export with zero changes.
 *
 * Attaches onto window.GrooveAudio (created here if absent; js/audio/bus.js
 * adds init/trigger/setParam/master on the same object). Fails soft when
 * Tone.js is missing. See docs/UPGRADE-PLAN.md §5.3.
 */

const METALLIC_FREQS = [205.3, 304.4, 369.6, 522.7, 540, 800]; // 6-osc square bank (hats / cymbal / crash)

function hasTone() {
    return typeof window !== 'undefined' && typeof window.Tone !== 'undefined';
}

function getParams() {
    return (typeof window !== 'undefined' && window.GrooveParams) ? window.GrooveParams : null;
}

/** Velocity 1–127 → envelope-peak multiplier (100 = 1.0, ghost 45 ≈ 0.30, accent 127 ≈ 1.43). */
function velocityGain(velocity) {
    const v = Math.min(127, Math.max(1, Number(velocity) || 100));
    return Math.pow(v / 100, 1.5);
}

/**
 * Build a complete kit in the current Tone context.
 *
 * @param {AudioNode|Tone.ToneAudioNode|null} destination
 *        Where each voice output connects. Pass null to leave outputs
 *        unconnected (js/audio/bus.js wires them through channel strips).
 * @returns kit — {
 *   outputs:  { inst: Tone.Gain }        per-voice output (gain = Level knob),
 *   trigger(inst, { time, velocity, accent, accentAmount }),
 *   setParam(inst, param, v0to10),       stored, applied at next trigger,
 *   getParam(inst, param),
 *   dispose()
 * }
 */
function buildVoices(destination) {
    if (!hasTone()) return null;
    const Tone = window.Tone;
    const P = getParams();
    if (!P) return null;

    const context = Tone.getContext();
    const offline = !!(context && context.isOffline);

    // ---- per-voice outputs (Level × Gain live here) --------------------------
    const outputs = {};
    const paramStore = {};   // inst -> knob space (see GrooveParams.PARAM_NAMES)
    for (const inst of P.INSTRUMENTS) {
        paramStore[inst] = P.defaultKnobs(inst);
        const levelGain = P.mapKnob(inst, 'level', paramStore[inst].level);
        const gainMult = P.mapKnob(inst, 'gain', paramStore[inst].gain);
        const out = new Tone.Gain(levelGain * gainMult);
        if (destination) out.connect(destination);
        outputs[inst] = out;
    }

    // ---- persistent 6-osc square metallic bank ------------------------------
    // Always running, summed into a gain that is NOT connected anywhere until
    // a hat / cymbal / crash hit patches a filter chain onto it.
    const bankOut = new Tone.Gain(1);
    const bankOscs = METALLIC_FREQS.map(f => {
        const osc = new Tone.Oscillator({ frequency: f, type: 'square', volume: -8 });
        osc.connect(bankOut);
        osc.start(offline ? 0 : undefined);
        return osc;
    });

    // ---- CH-chokes-OH registry ---------------------------------------------
    // Live OH envelopes register here; a CH hit ramps them to silence at its time.
    const openHats = new Set();  // entries: { vca, endTime }

    // ---- helpers ------------------------------------------------------------

    function disposeLater(nodes, atTime, tailSec) {
        if (offline) return; // offline context is discarded wholesale after render
        const now = Tone.now();
        const ms = Math.max(0, (atTime - now)) * 1000 + tailSec * 1000 + 400;
        setTimeout(() => {
            for (const n of nodes) {
                try { n.dispose(); } catch (e) { /* already gone */ }
            }
        }, ms);
    }

    function tanhShaper(k) {
        const norm = Math.tanh(k);
        return new Tone.WaveShaper(x => Math.tanh(x * k) / norm, 1024);
    }

    /**
     * Per-hit output chain: optional drive saturation → voice output.
     * Returns { node, extras } — connect the hit graph to `node`.
     */
    function outChain(inst, real, nodes) {
        const out = outputs[inst];
        if (real.drive > 0.05) {
            const shaper = tanhShaper(1 + real.drive * 6);
            shaper.connect(out);
            nodes.push(shaper);
            return shaper;
        }
        return out;
    }

    /**
     * Scheduled VCA: attack → peak, then either classic AD (decay to silence)
     * or one-shot ADSR (decay to sustain level, then release to silence).
     * `env` may supply { sustain 0–1, release seconds }.
     */
    function scheduledVCA(t, peak, attack, decay, nodes, env) {
        const vca = new Tone.Gain(0);
        const g = vca.gain;
        const atk = Math.max(0.0003, attack || 0.001);
        const dec = Math.max(0.005, decay || 0.05);
        const sustain = env && env.sustain != null ? env.sustain : 0;
        const release = env && env.release != null ? env.release : 0;
        g.setValueAtTime(0, t);
        g.linearRampToValueAtTime(peak, t + atk);
        if (sustain > 0.02 && release > 0.005) {
            const susLevel = Math.max(0.0004, peak * Math.min(1, sustain));
            g.exponentialRampToValueAtTime(susLevel, t + atk + dec);
            g.exponentialRampToValueAtTime(0.0004, t + atk + dec + release);
            g.setValueAtTime(0, t + atk + dec + release + 0.01);
        } else {
            g.exponentialRampToValueAtTime(0.0004, t + atk + dec);
            g.setValueAtTime(0, t + atk + dec + 0.01);
        }
        nodes.push(vca);
        return vca;
    }

    /** Voice filter Q = base characteristic × resonance multiplier (1.0 at knob 5). */
    function filtQ(baseQ, real) {
        const mult = (real && real.resonance != null) ? real.resonance : 1;
        return Math.max(0.1, baseQ * mult);
    }

    /** Envelope opts from mapped sustain/release knobs. */
    function envOpts(real) {
        return { sustain: real.sustain || 0, release: real.release || 0 };
    }

    /** Total envelope length used for osc stop / dispose scheduling. */
    function envLen(attack, decay, real) {
        const atk = Math.max(0.0003, attack || 0.001);
        const dec = Math.max(0.005, decay || 0.05);
        if ((real.sustain || 0) > 0.02 && (real.release || 0) > 0.005) {
            return atk + dec + real.release;
        }
        return atk + dec;
    }

    /** Resolve every knob for a voice into real units at trigger time. */
    function realParams(inst) {
        const store = paramStore[inst];
        const real = {};
        for (const param of P.PARAM_NAMES) {
            const knob = (store[param] != null) ? store[param] : 5;
            real[param] = P.mapKnob(inst, param, knob);
        }
        return real;
    }

    // ---- voice implementations ---------------------------------------------
    // Each: (t, inst, real, peak, nodes) — connect final graph via outChain.

    function playBD(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.bd;
        const f = d.freq * P.tuneRatio(real.tune);
        const decay = real.decay; // 0.15–2.5 s
        const atk = real.attack;
        const env = envOpts(real);
        const len = envLen(atk, decay, real);

        const sat = tanhShaper(d.satAmount + real.drive * 4);
        sat.connect(outputs[inst]);
        nodes.push(sat);

        // body: sine with 2-octave, 45 ms pitch envelope
        const bodyVCA = scheduledVCA(t, peak, atk, decay, nodes, env);
        bodyVCA.connect(sat);
        const osc = new Tone.Oscillator({ frequency: f, type: 'sine' });
        osc.frequency.setValueAtTime(f * Math.pow(2, d.pitchEnvOctaves), t);
        osc.frequency.exponentialRampToValueAtTime(f, t + d.pitchEnvTime);
        osc.connect(bodyVCA);
        osc.start(t);
        osc.stop(t + len + 0.1);
        nodes.push(osc);

        // click: damped pulse through the Tone-knob band-pass (200 Hz – 4 kHz)
        const clickVCA = scheduledVCA(t, peak * 0.7, Math.min(atk, 0.001), 0.008, nodes);
        clickVCA.connect(sat);
        const clickBPF = new Tone.Filter({ frequency: real.tone, type: 'bandpass', Q: filtQ(1.5, real) });
        clickBPF.connect(clickVCA);
        const click = new Tone.Oscillator({ frequency: Math.max(80, real.tone * 0.5), type: 'square' });
        click.connect(clickBPF);
        click.start(t);
        click.stop(t + 0.03);
        nodes.push(clickBPF, click);

        return len + 0.15;
    }

    function playSD(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.sd;
        const ratio = P.tuneRatio(real.tune);
        const decay = real.decay;
        const atk = real.attack;
        const env = envOpts(real);
        const len = envLen(atk, decay, real);

        const dest = outChain(inst, real, nodes);

        // tonal body: dual sines 185 / 330 Hz
        const bodyVCA = scheduledVCA(t, peak * 0.85, atk, Math.min(decay, 0.18), nodes, env);
        bodyVCA.connect(dest);
        for (const bf of [d.freq, d.freq2]) {
            const osc = new Tone.Oscillator({ frequency: bf * ratio, type: 'sine' });
            osc.connect(bodyVCA);
            osc.start(t);
            osc.stop(t + len + 0.1);
            nodes.push(osc);
        }

        // snappy: independently-enveloped noise
        const noisePeak = peak * real.snappy;
        if (noisePeak > 0.001) {
            const noiseVCA = scheduledVCA(t, noisePeak, Math.min(atk, 0.002), decay, nodes, env);
            noiseVCA.connect(dest);
            const hpf = new Tone.Filter({ frequency: real.tone, type: 'highpass', Q: filtQ(0.7, real) });
            hpf.connect(noiseVCA);
            const noise = new Tone.Noise('white');
            noise.connect(hpf);
            noise.start(t);
            noise.stop(t + len + 0.05);
            nodes.push(hpf, noise);
        }
        return len + 0.15;
    }

    function playTom(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS[inst];
        const f = d.freq * P.tuneRatio(real.tune);
        const decay = real.decay;
        const atk = real.attack;
        const env = envOpts(real);
        const len = envLen(atk, decay, real);

        const sat = tanhShaper(d.satAmount + real.drive * 4);
        sat.connect(outputs[inst]);
        nodes.push(sat);

        const vca = scheduledVCA(t, peak, atk, decay, nodes, env);
        vca.connect(sat);
        const lpf = new Tone.Filter({ frequency: real.tone, type: 'lowpass', Q: filtQ(1, real) });
        lpf.connect(vca);
        const osc = new Tone.Oscillator({ frequency: f, type: 'triangle' });
        osc.frequency.setValueAtTime(f * d.pitchEnvRatio, t);
        osc.frequency.exponentialRampToValueAtTime(f, t + d.pitchEnvTime);
        osc.connect(lpf);
        osc.start(t);
        osc.stop(t + len + 0.1);
        nodes.push(lpf, osc);
        return len + 0.15;
    }

    function playRim(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.rim;
        const ratio = P.tuneRatio(real.tune);
        const decay = real.decay;
        const atk = Math.min(real.attack, 0.002);
        const env = envOpts(real);
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);

        // ringing filter ping
        const ringVCA = scheduledVCA(t, peak * 0.8, atk, decay, nodes, env);
        ringVCA.connect(dest);
        const bpf = new Tone.Filter({ frequency: real.tone, type: 'bandpass', Q: filtQ(8, real) });
        bpf.connect(ringVCA);
        const buzz = new Tone.Oscillator({ frequency: 1750 * ratio, type: 'square' });
        buzz.connect(bpf);
        buzz.start(t);
        buzz.stop(t + len + 0.05);
        nodes.push(bpf, buzz);

        // short sine body knock
        const bodyVCA = scheduledVCA(t, peak * 0.6, atk, Math.min(decay, 0.03), nodes);
        bodyVCA.connect(dest);
        const body = new Tone.Oscillator({ frequency: d.freq * ratio, type: 'sine' });
        body.connect(bodyVCA);
        body.start(t);
        body.stop(t + 0.06);
        nodes.push(body);
        return len + 0.1;
    }

    function playCP(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.cp;
        const decay = real.decay; // tail length, default ≈ 0.18 s
        const release = (real.sustain > 0.02 && real.release > 0.005) ? real.release : 0;
        const tailLen = decay + release;
        const dest = outChain(inst, real, nodes);

        // BPF-1100 noise (Tone knob sweeps the band centre)
        const bpf = new Tone.Filter({ frequency: real.tone * P.tuneRatio(real.tune), type: 'bandpass', Q: filtQ(1.8, real) });
        const vca = new Tone.Gain(0);
        bpf.connect(vca);
        vca.connect(dest);
        const noise = new Tone.Noise('white');
        noise.connect(bpf);
        nodes.push(bpf, vca, noise);

        // flam VCA: retriggered spikes at 0 / 10 / 20 ms, then the 0.18 s tail
        const g = vca.gain;
        g.setValueAtTime(0, t);
        d.flamOffsets.forEach((off, i) => {
            const spike = peak * (1 - i * 0.12);
            g.setValueAtTime(spike, t + off);
            g.exponentialRampToValueAtTime(spike * 0.08, t + off + 0.009);
        });
        const tailAt = t + d.tailStart;
        const susPeak = peak * (0.5 + 0.4 * (1 - (real.sustain || 0)));
        g.setValueAtTime(Math.max(0.0004, susPeak), tailAt);
        if (release > 0) {
            const susLevel = Math.max(0.0004, peak * real.sustain);
            g.exponentialRampToValueAtTime(susLevel, tailAt + decay);
            g.exponentialRampToValueAtTime(0.0004, tailAt + decay + release);
            g.setValueAtTime(0, tailAt + decay + release + 0.01);
        } else {
            g.exponentialRampToValueAtTime(0.0004, tailAt + decay);
            g.setValueAtTime(0, tailAt + decay + 0.01);
        }

        noise.start(t);
        noise.stop(tailAt + tailLen + 0.05);
        return d.tailStart + tailLen + 0.1;
    }

    function playConga(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS[inst];
        const f = d.freq * P.tuneRatio(real.tune); // 370 / 250 / 165 Hz; noise burst deleted
        const decay = real.decay;
        const atk = real.attack;
        const env = envOpts(real);
        const len = envLen(atk, decay, real);

        const sat = tanhShaper(d.satAmount + real.drive * 4);
        sat.connect(outputs[inst]);
        nodes.push(sat);

        const vca = scheduledVCA(t, peak, atk, decay, nodes, env);
        vca.connect(sat);
        const osc = new Tone.Oscillator({ frequency: f, type: 'triangle' });
        osc.frequency.setValueAtTime(f * d.pitchEnvRatio, t);
        osc.frequency.exponentialRampToValueAtTime(f, t + d.pitchEnvTime);
        osc.connect(vca);
        osc.start(t);
        osc.stop(t + len + 0.1);
        nodes.push(osc);
        return len + 0.15;
    }

    function playCB(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.cb;
        const ratio = P.tuneRatio(real.tune);
        const decay = real.decay;
        const atk = Math.max(0.0005, real.attack);
        const env = envOpts(real);
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);

        // classic two-square cowbell through a band-pass; fast clank then ring
        const vca = new Tone.Gain(0);
        vca.connect(dest);
        const g = vca.gain;
        g.setValueAtTime(0, t);
        g.linearRampToValueAtTime(peak, t + atk);
        if (env.sustain > 0.02 && env.release > 0.005) {
            const susLevel = Math.max(0.0004, peak * env.sustain);
            g.exponentialRampToValueAtTime(Math.max(susLevel, peak * 0.3), t + atk + 0.03);
            g.exponentialRampToValueAtTime(susLevel, t + atk + decay);
            g.exponentialRampToValueAtTime(0.0004, t + atk + decay + env.release);
            g.setValueAtTime(0, t + atk + decay + env.release + 0.01);
        } else {
            g.exponentialRampToValueAtTime(peak * 0.3, t + atk + 0.03);
            g.exponentialRampToValueAtTime(0.0004, t + decay);
            g.setValueAtTime(0, t + decay + 0.01);
        }
        nodes.push(vca);

        const bpf = new Tone.Filter({ frequency: real.tone, type: 'bandpass', Q: filtQ(2, real) });
        bpf.connect(vca);
        nodes.push(bpf);
        for (const bf of [d.freq, d.freq2]) {
            const osc = new Tone.Oscillator({ frequency: bf * ratio, type: 'square' });
            osc.connect(bpf);
            osc.start(t);
            osc.stop(t + len + 0.05);
            nodes.push(osc);
        }
        return len + 0.1;
    }

    function playCL(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.cl;
        const f = d.freq * P.tuneRatio(real.tune);
        const decay = real.decay;
        const atk = Math.min(real.attack, 0.003);
        const env = envOpts(real);
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);

        const vca = scheduledVCA(t, peak, atk, decay, nodes, env);
        vca.connect(dest);
        const osc = new Tone.Oscillator({ frequency: f, type: 'sine' });
        osc.connect(vca);
        osc.start(t);
        osc.stop(t + len + 0.05);
        nodes.push(osc);
        return len + 0.1;
    }

    function playMA(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.ma;
        const decay = real.decay;
        const atk = Math.max(real.attack, d.attack * 0.5);
        const env = envOpts(real);
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);

        // white noise, soft attack shake (brown noise + LFO deleted)
        const vca = scheduledVCA(t, peak, atk, decay, nodes, env);
        vca.connect(dest);
        const hpf = new Tone.Filter({ frequency: real.tone, type: 'highpass', Q: filtQ(0.8, real) });
        hpf.connect(vca);
        const noise = new Tone.Noise('white');
        noise.connect(hpf);
        noise.start(t);
        noise.stop(t + len + 0.05);
        nodes.push(hpf, noise);
        return len + 0.1;
    }

    /** Patch a filtered tap of the metallic bank through a fresh VCA. */
    function bankTap(t, real, peak, attack, decay, bpfQ, nodes) {
        const vca = scheduledVCA(t, peak, attack, decay, nodes, envOpts(real));
        const bpf = new Tone.Filter({ frequency: Math.min(real.tone * 1.4, 11000), type: 'bandpass', Q: filtQ(bpfQ, real) });
        const hpf = new Tone.Filter({ frequency: real.tone, type: 'highpass', Q: filtQ(0.7, real), rolloff: -24 });
        bankOut.connect(hpf);
        hpf.connect(bpf);
        bpf.connect(vca);
        nodes.push(hpf, bpf);
        return vca;
    }

    function chokeOpenHats(t) {
        for (const entry of Array.from(openHats)) {
            if (t >= entry.endTime) { openHats.delete(entry); continue; }
            const g = entry.vca.gain;
            try {
                const current = (typeof g.getValueAtTime === 'function') ? g.getValueAtTime(t) : g.value;
                g.cancelScheduledValues(t);
                g.setValueAtTime(Math.max(current, 0.0001), t);
                g.linearRampToValueAtTime(0, t + 0.012);
            } catch (e) { /* node already disposed */ }
            openHats.delete(entry);
        }
    }

    function playCH(t, inst, real, peak, nodes) {
        chokeOpenHats(t); // CH chokes OH
        const decay = real.decay; // 0.025–0.12 s
        const atk = Math.min(real.attack, 0.003);
        const len = envLen(atk, decay, real);
        const vca = bankTap(t, real, peak, atk, decay, 1.2, nodes);
        vca.connect(outChain(inst, real, nodes));
        return len + 0.1;
    }

    function playOH(t, inst, real, peak, nodes) {
        const decay = real.decay; // OH Decay knob: 0.15–0.9 s
        const atk = Math.min(real.attack, 0.003);
        const len = envLen(atk, decay, real);
        const vca = bankTap(t, real, peak, atk, decay, 1.2, nodes);
        vca.connect(outChain(inst, real, nodes));
        const entry = { vca, endTime: t + len + 0.05 };
        openHats.add(entry);
        if (!offline) setTimeout(() => openHats.delete(entry), Math.max(0, (entry.endTime - Tone.now())) * 1000 + 500);
        return len + 0.1;
    }

    function playCYM(t, inst, real, peak, nodes) {
        const d = P.DEFAULTS.cym;
        const decay = real.decay; // 0.5–3.5 s
        const atk = real.attack;
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);
        // long wash + brighter attack ping, both fed by the metallic bank
        const wash = bankTap(t, real, peak * 0.8, atk, decay, 0.9, nodes);
        wash.connect(dest);
        const pingReal = Object.assign({}, real, { tone: Math.min(real.tone * 1.8, 10000) });
        const ping = bankTap(t, pingReal, peak, Math.min(atk, 0.002), d.pingDecay, 2, nodes);
        ping.connect(dest);
        return len + 0.15;
    }

    function playCR(t, inst, real, peak, nodes) {
        const decay = real.decay; // 0.8–3 s
        const atk = real.attack;
        const env = envOpts(real);
        const len = envLen(atk, decay, real);
        const dest = outChain(inst, real, nodes);
        // metallic bank wash + white-noise splash for the crash explosion
        const wash = bankTap(t, real, peak * 0.7, atk, decay, 0.8, nodes);
        wash.connect(dest);

        const splashVCA = scheduledVCA(t, peak * 0.9, Math.min(atk, 0.002), decay * 0.7, nodes, env);
        splashVCA.connect(dest);
        const hpf = new Tone.Filter({ frequency: real.tone, type: 'highpass', Q: filtQ(0.7, real) });
        hpf.connect(splashVCA);
        const noise = new Tone.Noise('white');
        noise.connect(hpf);
        noise.start(t);
        noise.stop(t + len * 0.7 + 0.05);
        nodes.push(hpf, noise);
        return len + 0.15;
    }

    const VOICES = {
        bd: playBD, sd: playSD, lt: playTom, mt: playTom, ht: playTom,
        rim: playRim, cp: playCP, hc: playConga, mc: playConga, lc: playConga,
        cb: playCB, cl: playCL, ma: playMA, ch: playCH, oh: playOH,
        cym: playCYM, cr: playCR
    };

    // ---- kit API ------------------------------------------------------------

    let disposed = false;

    function trigger(inst, opts) {
        if (disposed || !VOICES[inst]) return;
        opts = opts || {};
        const t = (typeof opts.time === 'number') ? opts.time : Tone.now();
        const velocity = (opts.velocity == null) ? 100 : opts.velocity;
        const accent = !!opts.accent;
        const accentAmount = (opts.accentAmount == null) ? 5 : opts.accentAmount;

        const real = realParams(inst);
        // Pattern pitch-bend (and any other per-hit detune) in semitones
        if (typeof opts.tuneOffset === 'number' && isFinite(opts.tuneOffset)) {
            real.tune += opts.tuneOffset;
        }
        let peak = velocityGain(velocity);
        if (accent) {
            peak *= 1 + (accentAmount / 10) * 0.8;           // accent gain pre-bus
            if (inst === 'ch' || inst === 'oh' || inst === 'cym' || inst === 'cr') {
                real.decay *= 1.15;                          // accent extends hat/cym decay
            }
        }

        const nodes = [];
        try {
            const tail = VOICES[inst](t, inst, real, peak, nodes);
            disposeLater(nodes, t, tail || 1);
        } catch (e) {
            for (const n of nodes) { try { n.dispose(); } catch (e2) { /* noop */ } }
            if (typeof console !== 'undefined') console.warn('[GrooveAudio] trigger failed', inst, e);
        }
    }

    function applyOutputGain(inst) {
        const store = paramStore[inst];
        if (!store || !outputs[inst]) return;
        const levelGain = P.mapKnob(inst, 'level', store.level != null ? store.level : 8);
        const gainMult = P.mapKnob(inst, 'gain', store.gain != null ? store.gain : 5);
        const g = levelGain * gainMult;
        try { outputs[inst].gain.rampTo(g, 0.02); }
        catch (e) { outputs[inst].gain.value = g; }
    }

    function setParam(inst, param, v0to10) {
        const store = paramStore[inst];
        if (!store || P.PARAM_NAMES.indexOf(param) === -1) return;
        store[param] = Math.min(10, Math.max(0, Number(v0to10) || 0));
        if (param === 'level' || param === 'gain') {
            // Level × Gain apply immediately to the voice's output gain
            applyOutputGain(inst);
        }
        // Everything else is applied at the next trigger — never mutate
        // envelope-driven signals on live nodes (the dead-Tune fix).
    }

    function getParam(inst, param) {
        const store = paramStore[inst];
        return store ? store[param] : undefined;
    }

    function dispose() {
        if (disposed) return;
        disposed = true;
        openHats.clear();
        for (const osc of bankOscs) { try { osc.stop(); osc.dispose(); } catch (e) { /* noop */ } }
        try { bankOut.dispose(); } catch (e) { /* noop */ }
        for (const inst of Object.keys(outputs)) {
            try { outputs[inst].dispose(); } catch (e) { /* noop */ }
        }
    }

    return { outputs, trigger, setParam, getParam, dispose, get isOffline() { return offline; } };
}

if (typeof window !== 'undefined') {
    window.GrooveAudio = Object.assign(window.GrooveAudio || {}, { buildVoices });
}

export { buildVoices, METALLIC_FREQS, velocityGain };
