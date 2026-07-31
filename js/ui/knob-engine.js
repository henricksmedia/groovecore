/**
 * GrooveCore — js/ui/knob-engine.js  (WS-F)
 *
 * window.GCKnobs — the one pointer-driven control engine for every rotary
 * knob and horizontal slider in the app (plan §5.5).
 *
 *   GCKnobs.bind(el, { min, max, default, value, getValue, onChange })
 *   GCKnobs.set(id, value, { silent })
 *   GCKnobs.get(id)
 *   GCKnobs.on('gesture:start' | 'gesture:end', cb)
 *
 * Pointer Events + setPointerCapture ONLY — mouse, touch and pen share one
 * code path and there are zero permanent document-level listeners (each
 * element listens on itself; capture routes the move/up stream to it).
 *
 *   drag        vertical for rotary knobs, horizontal for sliders, ×0.05/px
 *   Shift       fine ×0.1        Ctrl  coarse ×3
 *   wheel       ±0.3 per notch (passive: false), Shift fine ×0.1
 *   dbl-click / dbl-tap   reset to the bound default (tempo default = 3.0
 *                         ⇒ 120 BPM — fixes the legacy 160-BPM dblclick bug)
 *
 * ONE rotation formula writes --rotation (rotary), ONE slider formula writes
 * --slider-width (sliders). A value bubble follows the control while
 * dragging. aria-valuenow is kept in sync on every change.
 *
 * Classic script, no dependencies. Loaded before app.js; app.js
 * feature-detects window.GCKnobs and falls back to its legacy handlers.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  // ---------------------------------------------------------------------------
  // Registry + emitter
  // ---------------------------------------------------------------------------

  var registry = new Map();   // id -> entry
  var anonSeq = 0;            // fallback ids for elements without one

  var listeners = { 'gesture:start': [], 'gesture:end': [] };

  function emit(event, payload) {
    var list = listeners[event];
    if (!list) return;
    for (var i = 0; i < list.length; i++) {
      try { list[i](payload); } catch (e) {
        console.warn('[GCKnobs] "' + event + '" listener threw:', e);
      }
    }
  }

  function clamp(entry, v) {
    v = Number(v);
    if (!isFinite(v)) v = entry.def;
    return Math.min(entry.max, Math.max(entry.min, v));
  }

  // ---------------------------------------------------------------------------
  // Visual formulas — THE one rotation formula and THE one slider formula
  // ---------------------------------------------------------------------------

  // The Google icon inside each knob naturally points to ~11 o'clock (330°);
  // knobs sweep 7 o'clock (210°, min) clockwise to 5 o'clock (510°, max).
  var ICON_OFFSET = 330;
  var MIN_ANGLE = 210;
  var MAX_ANGLE = 510;

  function applyVisual(entry, value) {
    var norm = (value - entry.min) / (entry.max - entry.min || 1);
    if (entry.rotary) {
      var angle = MIN_ANGLE + norm * (MAX_ANGLE - MIN_ANGLE);
      entry.el.style.setProperty('--rotation', (angle - ICON_OFFSET) + 'deg');
    } else {
      entry.el.style.setProperty('--slider-width', (norm * 100) + '%');
    }
    entry.el.setAttribute('aria-valuenow', String(Math.round(value * 10) / 10));
  }

  // ---------------------------------------------------------------------------
  // Value bubble (shown while dragging)
  // ---------------------------------------------------------------------------

  var bubble = null;

  function injectStyles() {
    if (document.getElementById('gc-knob-engine-styles')) return;
    var style = document.createElement('style');
    style.id = 'gc-knob-engine-styles';
    style.textContent =
      '.gc-knob-bubble{position:fixed;z-index:9999;pointer-events:none;' +
      'transform:translate(-50%,-130%);background:rgba(10,10,10,.92);' +
      'color:#ff8c00;border:1px solid rgba(255,140,0,.5);border-radius:4px;' +
      'padding:2px 7px;font:600 11px/1.5 "Roboto",monospace,sans-serif;' +
      'letter-spacing:.05em;white-space:nowrap;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.6);}' +
      '@media (prefers-reduced-motion: no-preference){' +
      '.gc-knob-bubble{transition:opacity .1s linear;}}';
    document.head.appendChild(style);
  }

  function showBubble(entry) {
    injectStyles();
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.className = 'gc-knob-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bubble);
    }
    updateBubble(entry);
  }

  function updateBubble(entry) {
    if (!bubble) return;
    var rect = entry.el.getBoundingClientRect();
    bubble.style.left = (rect.left + rect.width / 2) + 'px';
    bubble.style.top = rect.top + 'px';
    bubble.textContent = entry.format(entry.value);
  }

  function hideBubble() {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
    bubble = null;
  }

  // ---------------------------------------------------------------------------
  // Core change path
  // ---------------------------------------------------------------------------

  function commit(entry, value, silent) {
    value = clamp(entry, value);
    entry.value = value;
    applyVisual(entry, value);
    if (entry.dragging) updateBubble(entry);
    if (!silent && typeof entry.onChange === 'function') {
      try { entry.onChange(value, entry.el); } catch (e) {
        console.warn('[GCKnobs] onChange for "' + entry.id + '" threw:', e);
      }
    }
  }

  /** Authoritative current value: external getter wins over internal store. */
  function currentValue(entry) {
    if (typeof entry.getValue === 'function') {
      var v = Number(entry.getValue());
      if (isFinite(v)) entry.value = clamp(entry, v);
    }
    return entry.value;
  }

  function defaultFormat(v) {
    return (Math.round(v * 10) / 10).toFixed(1);
  }

  // ---------------------------------------------------------------------------
  // bind()
  // ---------------------------------------------------------------------------

  function bind(el, opts) {
    if (!el || el.nodeType !== 1) return null;
    opts = opts || {};

    // Re-binding the same element just refreshes its options.
    var existing = el._gcKnobEntry;
    if (existing) {
      if (typeof opts.onChange === 'function') existing.onChange = opts.onChange;
      if (typeof opts.getValue === 'function') existing.getValue = opts.getValue;
      if (opts.default !== undefined) existing.def = Number(opts.default);
      if (opts.value !== undefined) commit(existing, opts.value, true);
      return existing.id;
    }

    var id = el.id || ('gc-knob-' + (++anonSeq));
    var entry = {
      id: id,
      el: el,
      min: (opts.min !== undefined) ? Number(opts.min) : 0,
      max: (opts.max !== undefined) ? Number(opts.max) : 10,
      def: (opts.default !== undefined) ? Number(opts.default) : 5,
      rotary: el.classList.contains('knob'),
      onChange: (typeof opts.onChange === 'function') ? opts.onChange : null,
      getValue: (typeof opts.getValue === 'function') ? opts.getValue : null,
      format: (typeof opts.format === 'function') ? opts.format : defaultFormat,
      value: 0,
      dragging: false,
      // dbl-tap detection (touch/pen have no native dblclick on many devices)
      lastTapTime: 0,
      lastTapX: 0,
      lastTapY: 0,
      // wheel gesture debouncing
      wheelTimer: null
    };
    if (!(entry.max > entry.min)) { entry.min = 0; entry.max = 10; }
    entry.def = clamp(entry, entry.def);
    entry.value = clamp(entry, (opts.value !== undefined) ? Number(opts.value) : entry.def);

    el._gcKnobEntry = entry;
    registry.set(id, entry);

    // ARIA — role/range at bind, valuenow on every change
    if (!el.hasAttribute('role')) el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', String(entry.min));
    el.setAttribute('aria-valuemax', String(entry.max));

    // No native touch scrolling/zooming while manipulating the control
    try { el.style.touchAction = 'none'; } catch (e) { /* older engine */ }

    // ---- drag: pointerdown → capture → pointermove on the element ----------
    var startPos = { x: 0, y: 0 };
    var startValue = 0;
    var moved = false;
    var activePointer = null;

    el.addEventListener('pointerdown', function (e) {
      if (!e.isPrimary || (e.button !== undefined && e.button !== 0)) return;
      activePointer = e.pointerId;
      startPos.x = e.clientX;
      startPos.y = e.clientY;
      startValue = currentValue(entry);
      moved = false;
      entry.dragging = true;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* detached */ }
      document.body.style.cursor = entry.rotary ? 'grabbing' : 'ew-resize';
      document.body.style.userSelect = 'none';
      showBubble(entry);
      emit('gesture:start', { id: entry.id, el: el });
      e.preventDefault();
    });

    el.addEventListener('pointermove', function (e) {
      if (!entry.dragging || e.pointerId !== activePointer) return;
      var sensitivity = 0.05 * ((entry.max - entry.min) / 10);
      if (e.shiftKey) sensitivity *= 0.1;   // fine
      if (e.ctrlKey) sensitivity *= 3;      // coarse
      var deltaPx = entry.rotary
        ? (startPos.y - e.clientY)          // rotary: drag up = increase
        : (e.clientX - startPos.x);         // slider: drag right = increase
      if (Math.abs(entry.rotary ? (e.clientY - startPos.y) : (e.clientX - startPos.x)) > 3) {
        moved = true;
      }
      commit(entry, startValue + deltaPx * sensitivity, false);
    });

    function endDrag(e) {
      if (!entry.dragging || (e && e.pointerId !== activePointer)) return;
      entry.dragging = false;
      activePointer = null;
      try { el.releasePointerCapture(e.pointerId); } catch (err) { /* released */ }
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      hideBubble();
      emit('gesture:end', { id: entry.id, el: el });

      // Double-tap reset (covers touch/pen; mouse also has native dblclick).
      if (e && !moved) {
        var now = Date.now();
        var isDoubleTap = (now - entry.lastTapTime) < 350
          && Math.abs(e.clientX - entry.lastTapX) < 12
          && Math.abs(e.clientY - entry.lastTapY) < 12;
        if (isDoubleTap) {
          entry.lastTapTime = 0;
          resetToDefault(entry);
        } else {
          entry.lastTapTime = now;
          entry.lastTapX = e.clientX;
          entry.lastTapY = e.clientY;
        }
      }
    }
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    // ---- native double-click (mouse path; harmless overlap with dbl-tap) ---
    el.addEventListener('dblclick', function (e) {
      e.preventDefault();
      resetToDefault(entry);
    });

    // ---- wheel ±0.3 (passive: false so preventDefault stops page scroll) ---
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      var step = 0.3 * ((entry.max - entry.min) / 10);
      if (e.shiftKey) step *= 0.1;
      var delta = (e.deltaY > 0) ? -step : step;
      if (!entry.wheelTimer) emit('gesture:start', { id: entry.id, el: el });
      else clearTimeout(entry.wheelTimer);
      entry.wheelTimer = setTimeout(function () {
        entry.wheelTimer = null;
        emit('gesture:end', { id: entry.id, el: el });
      }, 400);
      commit(entry, currentValue(entry) + delta, false);
    }, { passive: false });

    // ---- initial paint ------------------------------------------------------
    applyVisual(entry, entry.value);

    return id;
  }

  function resetToDefault(entry) {
    emit('gesture:start', { id: entry.id, el: entry.el });
    commit(entry, entry.def, false);
    emit('gesture:end', { id: entry.id, el: entry.el });
  }

  // ---------------------------------------------------------------------------
  // Public surface
  // ---------------------------------------------------------------------------

  window.GCKnobs = {
    bind: bind,

    /** Programmatic set. { silent: true } updates visuals without onChange. */
    set: function (id, value, opts) {
      var entry = registry.get(id);
      if (!entry) return;
      commit(entry, value, !!(opts && opts.silent));
    },

    get: function (id) {
      var entry = registry.get(id);
      return entry ? currentValue(entry) : undefined;
    },

    on: function (event, cb) {
      if (listeners[event] && typeof cb === 'function') listeners[event].push(cb);
    },

    off: function (event, cb) {
      var list = listeners[event];
      if (!list) return;
      var idx = list.indexOf(cb);
      if (idx !== -1) list.splice(idx, 1);
    },

    /** True if the element (or id) is already bound. */
    isBound: function (elOrId) {
      if (typeof elOrId === 'string') return registry.has(elOrId);
      return !!(elOrId && elOrId._gcKnobEntry);
    }
  };
})();
