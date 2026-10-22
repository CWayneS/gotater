// Start menu, clock, hotkeys.
import { apps, categories, newest, openApp, openFolder, openAbout, openRun, openDisplay, h } from './shell.js';
import { shutdown, previewSaver } from './fx.js';
import { resetIcons } from './desktop.js';

const btn = document.getElementById('start-btn');
const menu = document.getElementById('start-menu');
const clock = document.getElementById('clock');

export function init(applyPrefs) {
  buildMenu(applyPrefs);
  btn.addEventListener('click', () => toggle());
  document.addEventListener('pointerdown', e => {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
  window.addEventListener('blur', () => toggle(false));
  document.getElementById('tray-run').addEventListener('click', openRun);

  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (e.key === 'Escape' && !menu.hidden) { toggle(false); btn.focus(); }
    else if ((e.key === '/' && !typing) || (e.key === ' ' && e.ctrlKey)) { e.preventDefault(); toggle(false); openRun(); }
    else if (e.key === 'Meta' || (e.key === 'Escape' && e.ctrlKey)) toggle();
  });

  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    clock.title = d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  tick();
  setInterval(tick, 10_000);
}

function toggle(force) {
  const show = force ?? menu.hidden;
  menu.hidden = !show;
  btn.classList.toggle('pressed', show);
  btn.setAttribute('aria-expanded', show);
  menu.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
  if (show && window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(menu, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.18, ease: 'steps(6)', clearProps: 'clipPath' });
  }
}

function item(e, label, action) {
  return h('li', {}, h('button', { role: 'menuitem', onclick: () => { toggle(false); action(); } }, h('span', { class: 'e' }, e), label));
}

function sub(e, label, list, folder) {
  const li = h('li', { class: 'sub' });
  const ul = h('ul', { class: 'submenu bevel' });
  for (const a of list) ul.append(item(a.icon, a.title, () => openApp(a.id)));
  if (folder) ul.append(h('hr'), item('📂', 'Open folder', () => openFolder(folder)));
  const open = () => {
    li.parentElement.querySelectorAll(':scope > li.open').forEach(o => o !== li && o.classList.remove('open'));
    li.classList.add('open');
  };
  li.append(h('button', { role: 'menuitem', 'aria-haspopup': 'menu', onclick: open, onpointerenter: e => e.pointerType === 'mouse' && open() },
    h('span', { class: 'e' }, e), label), ul);
  return li;
}

function buildMenu(applyPrefs) {
  const ul = h('ul');
  for (const [k, c] of Object.entries(categories)) ul.append(sub(c.icon, c.title, apps.filter(a => a.category === k), k));
  ul.append(sub('✨', 'New!', newest(), 'new'));
  ul.append(h('hr'));
  ul.append(item('📝', 'about.txt', () => openAbout()));
  ul.append(item('🖥️', 'Display Properties', () => openDisplay(applyPrefs, previewSaver)));
  ul.append(item('🧹', 'Tidy Desktop Icons', resetIcons));
  ul.append(item('🔎', 'Run…', openRun));
  ul.append(h('hr'));
  ul.append(item('⏻', 'Shut Down…', shutdown));
  for (const li of ul.children) {
    if (li.tagName === 'LI' && !li.classList.contains('sub')) {
      li.addEventListener('pointerenter', () => ul.querySelectorAll(':scope > li.open').forEach(o => o.classList.remove('open')));
    }
  }
  menu.replaceChildren(h('div', { class: 'side' }, h('b', {}, 'Tater', h('i', {}, 'OS 95'))), ul);
}
