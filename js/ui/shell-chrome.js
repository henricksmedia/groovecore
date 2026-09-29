// Compact, responsive application chrome for project actions and transport.
// Existing controls are moved—not cloned—so legacy listeners and IDs remain intact.

let GCRef = null;
let saveTimer = null;

function iconButton(id, icon, label, title) {
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = 'gc-shell-icon-btn';
  button.title = title;
  button.setAttribute('aria-label', title);
  button.innerHTML = `<span class="material-icons" aria-hidden="true">${icon}</span><span>${label}</span>`;
  return button;
}

function setProjectStatus(text, state = 'saved') {
  const status = document.getElementById('gc-project-status');
  if (!status) return;
  status.textContent = text;
  status.dataset.state = state;
}

function setProjectName(name) {
  const label = document.getElementById('gc-project-name');
  if (label && name) label.textContent = name;
}

function buildProjectChrome() {
  const topbar = document.querySelector('.gc-topbar');
  const brand = topbar?.querySelector('.gc-brand');
  const controls = topbar?.querySelector('.project-controls');
  if (!topbar || !brand || !controls || document.getElementById('gc-project-context')) return;

  const context = document.createElement('div');
  context.id = 'gc-project-context';
  context.className = 'gc-project-context';
  context.innerHTML = `
    <div class="gc-project-copy">
      <span id="gc-project-name">Untitled groove</span>
      <small id="gc-project-status" data-state="saved">Saved locally</small>
    </div>`;
  brand.insertAdjacentElement('afterend', context);
  brand.insertAdjacentHTML('beforeend', '<small class="gc-brand-kicker">Rhythm engine</small>');

  const viewSwitch = document.getElementById('gc-view-switch');
  if (viewSwitch) context.insertBefore(viewSwitch, context.firstChild);

  const undo = iconButton('gc-header-undo', 'undo', 'Undo', 'Undo (Ctrl+Z)');
  const redo = iconButton('gc-header-redo', 'redo', 'Redo', 'Redo (Ctrl+Y)');
  undo.addEventListener('click', () => GCRef?.events?.emit('undo'));
  redo.addEventListener('click', () => GCRef?.events?.emit('redo'));
  controls.insertBefore(redo, controls.firstChild);
  controls.insertBefore(undo, redo);

  const more = iconButton('gc-project-more-toggle', 'more_horiz', 'More', 'More project actions');
  more.setAttribute('aria-expanded', 'false');
  more.setAttribute('aria-controls', 'gc-project-more-menu');
  const menu = document.createElement('div');
  menu.id = 'gc-project-more-menu';
  menu.className = 'gc-project-more-menu';

  ['load', 'gc-share-btn', 'exportMidi', 'reset'].forEach((id) => {
    const control = document.getElementById(id);
    if (control) menu.appendChild(control);
  });
  const mobileUndo = iconButton('gc-mobile-undo', 'undo', 'Undo', 'Undo last change');
  const mobileRedo = iconButton('gc-mobile-redo', 'redo', 'Redo last change');
  mobileUndo.classList.add('gc-mobile-history');
  mobileRedo.classList.add('gc-mobile-history');
  mobileUndo.addEventListener('click', () => GCRef?.events?.emit('undo'));
  mobileRedo.addEventListener('click', () => GCRef?.events?.emit('redo'));
  menu.prepend(mobileRedo);
  menu.prepend(mobileUndo);
  controls.append(more, menu);

  const setOpen = (open) => {
    menu.classList.toggle('gc-open', open);
    more.setAttribute('aria-expanded', String(open));
  };
  more.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!menu.classList.contains('gc-open'));
  });
  menu.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  document.getElementById('save')?.addEventListener('click', () => {
    setProjectStatus('Project downloaded', 'saved');
  });
  GCRef?.events?.on('preset:loaded', (detail) => {
    if (detail?.label) setProjectName(detail.label);
  });
  GCRef?.events?.on('gc:change', () => {
    setProjectStatus('Saving…', 'saving');
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => setProjectStatus('Saved locally', 'saved'), 650);
  });
  document.querySelector('#gc-playground')?.addEventListener('click', (event) => {
    const intent = event.target.closest('.gc-pg-intent');
    if (!intent) return;
    setTimeout(() => {
      setProjectName(intent.querySelector('strong')?.textContent || 'Untitled groove');
    }, 0);
  });
}

function armConfirmation(button, word) {
  if (!button) return;
  let armed = false;
  let timer = null;
  const text = button.querySelector('.button-text, .clear-text');
  const original = text?.textContent || word;
  const reset = () => {
    armed = false;
    button.classList.remove('gc-confirming');
    if (text) text.textContent = original;
  };
  button.addEventListener('click', (event) => {
    if (armed) {
      reset();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    armed = true;
    button.classList.add('gc-confirming');
    if (text) text.textContent = `CONFIRM ${word}`;
    window.GCToast?.show?.(`Press again to ${word.toLowerCase()}`, { type: 'warning', duration: 2200 });
    clearTimeout(timer);
    timer = setTimeout(reset, 2600);
  }, true);
}

function buildDeckMenu() {
  const dock = document.querySelector('.sticky-bottom-section');
  const transport = dock?.querySelector('.gc-transport');
  const master = dock?.querySelector('.master-controls');
  if (!dock || !transport || !master || document.getElementById('gc-deck-more-toggle')) return;

  const more = iconButton('gc-deck-more-toggle', 'tune', 'More', 'More performance controls');
  more.setAttribute('aria-expanded', 'false');
  more.setAttribute('aria-controls', 'gc-deck-more-menu');
  const menu = document.createElement('div');
  menu.id = 'gc-deck-more-menu';
  menu.className = 'gc-deck-more-menu';
  menu.setAttribute('aria-label', 'Additional performance controls');

  ['midiInBtn', 'helpButton'].forEach((id) => {
    const control = document.getElementById(id);
    if (control) menu.appendChild(control);
  });
  const clear = document.getElementById('clearButton');
  if (clear) menu.appendChild(clear);

  ['masterDrive', 'masterGlue', 'accentAmount'].forEach((id) => {
    const knob = document.getElementById(id);
    const container = knob?.closest('.knob-container');
    if (container) menu.appendChild(container);
  });
  const groove = document.getElementById('gc-groove-toggle');
  if (groove) menu.appendChild(groove);

  const panel = dock.querySelector('.bottom-panel');
  const masterSection = master.closest('.master-controls-section');
  const bpm = document.getElementById('bpmDisplay')?.closest('.bpm-display-container');
  const tempo = document.getElementById('tempo')?.closest('.knob-container');
  const tempoTools = document.getElementById('gc-tempoTools');
  const volume = document.getElementById('masterVolume')?.closest('.knob-container');

  const tempoZone = document.createElement('div');
  tempoZone.className = 'gc-deck-tempo';
  tempoZone.setAttribute('aria-label', 'Tempo controls');
  [bpm, tempoTools, tempo].forEach((control) => {
    if (control) tempoZone.appendChild(control);
  });

  const outputZone = document.createElement('div');
  outputZone.className = 'gc-deck-output';
  outputZone.setAttribute('aria-label', 'Output controls');
  if (volume) outputZone.appendChild(volume);
  outputZone.append(more);

  if (panel) {
    panel.insertBefore(tempoZone, masterSection);
    panel.insertBefore(outputZone, masterSection);
  }
  if (masterSection) masterSection.hidden = true;
  dock.append(menu);
  const setOpen = (open) => {
    menu.classList.toggle('gc-open', open);
    more.setAttribute('aria-expanded', String(open));
  };
  more.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!menu.classList.contains('gc-open'));
  });
  menu.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  armConfirmation(clear, 'CLEAR');
  armConfirmation(document.getElementById('reset'), 'RESET');
}

export function init(GC) {
  GCRef = GC || window.GC || null;
  buildProjectChrome();
  buildDeckMenu();
}

export default { init };
