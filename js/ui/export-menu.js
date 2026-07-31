/**
 * GrooveCore — js/ui/export-menu.js  (WS-B)
 *
 * The visible export menu. Kills the legacy Shift+click prompt() flow:
 * a CAPTURE-PHASE click listener on document intercepts every click on the
 * existing #exportMidi button before the legacy handler can run
 * (stopImmediatePropagation), and opens a GCToast/ui-kit menu instead:
 *
 *   MIDI (pattern) / MIDI (chain) / MIDI multi-track /
 *   WAV mix / WAV stems + MIDI zip / Copy share link / Export options…
 *
 * Also opens on GC.events 'export:open' (Ctrl+E, wired by js/ui/keys.js).
 * No prompt()/alert() anywhere. ES module; exports init(GC); every entry
 * point feature-detects its target module and degrades to a no-op + toast.
 */

let GCRef = null;
let installed = false;

function gc() { return GCRef || (typeof window !== 'undefined' ? window.GC : null); }

function uiKit() {
    return (typeof window !== 'undefined' && window.GCToast && typeof window.GCToast.menu === 'function')
        ? window.GCToast : null;
}

function toast(msg, type) {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
        window.GCToast.show(msg, { type: type || 'info' });
    } else {
        console.log('[gc-export-menu] ' + msg);
    }
}

function missing(what) {
    return () => toast(what + ' export is unavailable (module failed to load)', 'error');
}

// ---------------------------------------------------------------------------
// Menu actions (all feature-detected at click time, never at load time)
// ---------------------------------------------------------------------------

function midiApi() { return window.GCExportMIDI || null; }
function audioApi() { return window.GCExportAudio || null; }

function actionMidiPattern() {
    const m = midiApi();
    (m && m.exportPattern) ? m.exportPattern() : missing('MIDI')();
}

function actionMidiChain() {
    const m = midiApi();
    (m && m.exportChain) ? m.exportChain() : missing('Chain MIDI')();
}

function actionMidiMulti() {
    const m = midiApi();
    (m && m.exportMultiTrack) ? m.exportMultiTrack() : missing('Multi-track MIDI')();
}

function actionWavMix() {
    // Default: tile to ~24s for AI music generators (Suno/Udio).
    const a = audioApi();
    (a && a.renderMix) ? a.renderMix() : missing('WAV')();
}

function actionWavMixAsHeard() {
    // Single pattern/chain cycle only — what you hear in one pass.
    const a = audioApi();
    (a && a.renderMix) ? a.renderMix(undefined, { asHeard: true }) : missing('WAV')();
}

function actionWavMixDry() {
    // Dry mix also tiles to ~24s (usable AI reference without send FX).
    const a = audioApi();
    (a && a.renderMix) ? a.renderMix(undefined, { dry: true }) : missing('WAV')();
}

function actionStems() {
    const a = audioApi();
    (a && a.renderStems) ? a.renderStems() : missing('Stems')();
}

function actionAIPrompt() {
    const p = window.GCAIPrompt;
    const built = (p && typeof p.buildStylePrompt === 'function') ? p.buildStylePrompt() : null;
    if (!built) { toast('Nothing to describe: the pattern is empty', 'error'); return; }

    const kit = uiKit();
    const copy = (text) => {
        const done = () => toast('Style prompt copied — paste it into your AI tool’s style box (e.g. Suno)', 'success');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, () => toast('Copy failed — select the text manually', 'error'));
        } else {
            toast('Clipboard unavailable — select the text manually', 'error');
        }
    };

    if (!kit || typeof kit.overlay !== 'function') { copy(built.prompt); return; }

    const root = document.createElement('div');
    root.innerHTML = '<div style="font:700 13px/1.3 Roboto,sans-serif;color:#eee;margin-bottom:8px;">AI style prompt</div>' +
        '<div style="font:400 11px/1.4 Roboto,sans-serif;color:#999;margin-bottom:10px;">' +
        (built.preset
            ? ('Based on <b>' + built.preset.label + '</b> (' + built.preset.genre + ') · ')
            : 'Inferred from the current grid (no preset selected) · ') +
        built.hits + ' hits, ' + built.bpm + ' BPM. Edit freely, then paste into your AI music tool’s style box (Suno, Udio, …) alongside your exported WAV.</div>';
    const ta = document.createElement('textarea');
    ta.value = built.prompt;
    ta.rows = 5;
    ta.style.cssText = 'width:100%;min-width:340px;background:#1a1a1a;border:1px solid #555;border-radius:5px;color:#ddd;padding:8px;font:400 12px/1.5 Roboto,sans-serif;resize:vertical;box-sizing:border-box;';
    root.appendChild(ta);
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;';
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'COPY';
    copyBtn.style.cssText = 'background:#ff6b35;color:#111;border:none;border-radius:5px;padding:6px 18px;font:700 12px Roboto,sans-serif;cursor:pointer;';
    copyBtn.addEventListener('click', () => copy(ta.value));
    btnRow.appendChild(copyBtn);
    root.appendChild(btnRow);
    kit.overlay(root);
}

function actionShare() {
    const g = gc();
    if (g && g.events && typeof g.events.emit === 'function') {
        g.events.emit('share:copy');
    } else {
        toast('Share is unavailable', 'error');
    }
}

// ---------------------------------------------------------------------------
// Options panel (replaces the legacy prompt() chooser entirely)
// ---------------------------------------------------------------------------

function actionOptions() {
    const kit = uiKit();
    const m = midiApi();
    if (!kit || typeof kit.overlay !== 'function' || !m || !m.getOptions) {
        toast('Export options are unavailable', 'error');
        return;
    }
    const opts = m.getOptions();

    const root = document.createElement('div');
    root.id = 'gc-exportOptions';
    root.innerHTML =
        '<h3 style="margin:0 0 10px;font:700 14px/1.3 Roboto,sans-serif;color:#ff6b35;">EXPORT OPTIONS</h3>' +
        '<p style="margin:0 0 12px;font:400 11px/1.5 Roboto,sans-serif;color:#999;">' +
        'Exports are deterministic by default: the same pattern always produces a byte-identical file.</p>';

    function row(id, label, hint, checked) {
        const wrap = document.createElement('label');
        wrap.style.cssText = 'display:flex;gap:8px;align-items:flex-start;margin:0 0 10px;cursor:pointer;font:400 12px/1.4 Roboto,sans-serif;color:#ddd;';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.checked = !!checked;
        cb.style.cssText = 'margin-top:2px;accent-color:#ff6b35;';
        const text = document.createElement('span');
        text.innerHTML = label + '<br><span style="color:#888;font-size:10px;">' + hint + '</span>';
        wrap.appendChild(cb);
        wrap.appendChild(text);
        root.appendChild(wrap);
        return cb;
    }

    const cbSwing = row('gc-exportOptSwing', 'Bake swing into MIDI ticks',
        'Writes the swing/shuffle knob feel into exported note positions', opts.bakeSwing);
    const cbHuman = row('gc-exportOptHumanize', 'Seeded humanize',
        'Adds subtle timing/velocity variation from a fixed seed (re-exports stay reproducible)', opts.humanize);
    const cbMix = row('gc-exportOptMix', 'Include mix data in multi-track MIDI',
        'Writes CC7 volume + CC10 pan per track from the level/pan knobs', opts.includeMixData);

    const seedWrap = document.createElement('label');
    seedWrap.style.cssText = 'display:flex;gap:8px;align-items:center;margin:0 0 14px;font:400 12px/1.4 Roboto,sans-serif;color:#ddd;';
    seedWrap.innerHTML = '<span>Humanize seed</span>';
    const seedInput = document.createElement('input');
    seedInput.type = 'number';
    seedInput.id = 'gc-exportOptSeed';
    seedInput.value = String(opts.seed);
    seedInput.step = '1';
    seedInput.style.cssText = 'width:80px;background:#1a1a1a;border:1px solid #555;border-radius:4px;color:#ddd;padding:3px 6px;font:400 12px Roboto,sans-serif;';
    seedWrap.appendChild(seedInput);
    root.appendChild(seedWrap);

    const done = document.createElement('button');
    done.type = 'button';
    done.textContent = 'DONE';
    done.style.cssText = 'background:#ff6b35;color:#111;border:none;border-radius:5px;padding:6px 18px;font:700 12px Roboto,sans-serif;cursor:pointer;';
    root.appendChild(done);

    const ov = kit.overlay(root);

    function apply() {
        const seed = parseInt(seedInput.value, 10);
        m.setOptions({
            bakeSwing: cbSwing.checked,
            humanize: cbHuman.checked,
            includeMixData: cbMix.checked,
            seed: isFinite(seed) ? seed : opts.seed
        });
    }
    cbSwing.addEventListener('change', apply);
    cbHuman.addEventListener('change', apply);
    cbMix.addEventListener('change', apply);
    seedInput.addEventListener('change', apply);
    done.addEventListener('click', () => { apply(); ov.close(); });
}

// ---------------------------------------------------------------------------
// The menu
// ---------------------------------------------------------------------------

function openMenu(anchor) {
    const kit = uiKit();
    if (!kit) {
        // ui-kit missing: still no prompt()/alert() — go straight to the
        // most common action so the button is never dead.
        actionMidiPattern();
        return;
    }
    kit.menu(anchor || document.getElementById('exportMidi'), [
        { label: 'MIDI (pattern)', onClick: actionMidiPattern },
        { label: 'MIDI (chain)', onClick: actionMidiChain },
        { label: 'MIDI multi-track', onClick: actionMidiMulti },
        '-',
        { label: 'WAV mix (AI-ready ~24s)', onClick: actionWavMix },
        { label: 'WAV mix (dry, AI-ready ~24s)', onClick: actionWavMixDry },
        { label: 'WAV one bar (as heard)', onClick: actionWavMixAsHeard },
        { label: 'WAV stems + MIDI (zip)', onClick: actionStems },
        '-',
        { label: 'AI style prompt…', onClick: actionAIPrompt },
        '-',
        { label: 'Copy share link', onClick: actionShare },
        { label: 'Export options…', onClick: actionOptions }
    ]);
}

// ---------------------------------------------------------------------------
// Capture-phase interception of the legacy #exportMidi button
// ---------------------------------------------------------------------------

function onDocumentClick(e) {
    const btn = e.target && e.target.closest ? e.target.closest('#exportMidi') : null;
    if (!btn) return;
    // Pre-empt the legacy listener on the button (prompt()-based chooser).
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    openMenu(btn);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

export function init(GC) {
    GCRef = GC || (typeof window !== 'undefined' ? window.GC : null) || null;
    if (installed) return { openMenu };
    installed = true;

    // Capture on document: fires in the capture phase at the ancestor level,
    // strictly before any listener registered on the button itself.
    document.addEventListener('click', onDocumentClick, true);

    // Ctrl+E (or anything else) can open the menu through the event bus.
    const g = gc();
    if (g && g.events && typeof g.events.on === 'function') {
        g.events.on('export:open', () => openMenu(document.getElementById('exportMidi')));
    }

    window.GCExportMenu = { openMenu };
    return { openMenu };
}

export { openMenu };
