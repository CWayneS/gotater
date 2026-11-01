// Desktop icons (draggable, positions remembered) and the phone launcher.
import { apps, categories, appUrl, iconEl, openApp, openFolder, openAbout, newest, h } from './shell.js';
import { load, save } from './store.js';
import { trash } from './fx.js';
import { openFiles } from './files.js';

const desktop = document.getElementById('desktop');
const COL = 96, ROW = 100, PAD = 12;

const items = () => [
  ...Object.entries(categories).map(([k, c]) => ({ key: 'folder:' + k, title: c.title, icon: '📁', sub: c.icon, open: from => openFolder(k, from) })),
  { key: 'folder:new', title: 'New!', icon: '📁', sub: '✨', badge: newest().length, open: from => openFolder('new', from) },
  { key: 'files', title: 'My Potato', icon: '🖥️', open: from => openFiles(from) },
  { key: 'app:gotater', title: 'Go Tater.exe', icon: '🥔', open: from => openApp('gotater', from) },
  { key: 'about', title: 'about.txt', icon: '📝', open: from => openAbout(from) },
  { key: 'trash', title: 'Trash', icon: '🗑️', open: from => trash(from) },
];

export function render() {
  desktop.replaceChildren();
  document.body.classList.contains('mobile') ? renderLauncher() : renderDesktop();
}

function renderDesktop() {
  const saved = load('icons', {});
  const rows = Math.max(1, Math.floor((desktop.clientHeight - PAD) / ROW));

  items().forEach((it, i) => {
    const b = iconEl({ title: it.title, icon: it.icon }, { tile: false });
    if (it.sub) b.querySelector('.glyph').append(h('span', { class: 'sub' }, it.sub));
    if (it.badge) b.append(h('span', { class: 'badge' }, 'new'));
    const def = { x: PAD + Math.floor(i / rows) * COL, y: PAD + (i % rows) * ROW };
    const pos = clamp(saved[it.key] || def);
    b.style.left = pos.x + 'px';
    b.style.top = pos.y + 'px';
    b.dataset.key = it.key;
    const fire = () => it.open(b.getBoundingClientRect());
    b.addEventListener('keydown', e => { if (e.key === 'Enter') fire(); });
    desktop.append(b);

    const select = () => {
      desktop.querySelectorAll('.icon.selected').forEach(n => n.classList.remove('selected'));
      b.classList.add('selected');
    };
    if (window.Draggable) {
      Draggable.create(b, {
        type: 'left,top', bounds: desktop, dragClickables: true, minimumMovement: 4, zIndexBoost: false,
        onPress: select,
        // single tap opens on touch; mouse uses the native dblclick below
        onClick() { if (matchMedia('(pointer: coarse)').matches) fire(); },
        onDragEnd() {
          const x = Math.round(parseFloat(b.style.left) / 8) * 8;
          const y = Math.round(parseFloat(b.style.top) / 8) * 8;
          gsap.to(b, { left: x, top: y, duration: 0.15 });
          const s = load('icons', {});
          s[it.key] = { x, y };
          save('icons', s);
        },
      });
    } else {
      b.addEventListener('click', select);
    }
    b.addEventListener('dblclick', fire);
  });

  desktop.addEventListener('pointerdown', e => {
    if (e.target === desktop) desktop.querySelectorAll('.icon.selected').forEach(n => n.classList.remove('selected'));
  });
}

function clamp(p) {
  return {
    x: Math.min(Math.max(0, p.x), Math.max(0, desktop.clientWidth - COL)),
    y: Math.min(Math.max(0, p.y), Math.max(0, desktop.clientHeight - ROW)),
  };
}

export function resetIcons() {
  save('icons', {});
  render();
}

function renderLauncher() {
  desktop.append(h('h1', { class: 'm-head' }, '🥔 TaterOS', h('small', {}, 'pocket edition')));
  const section = (title, list) => {
    desktop.append(h('h2', { class: 'm-cat' }, title));
    const grid = h('div', { class: 'm-grid' });
    for (const a of list) {
      const link = iconEl(a, { tag: 'a' });
      link.href = appUrl(a);
      grid.append(link);
    }
    desktop.append(grid);
  };
  section('✨ New!', newest());
  for (const [k, c] of Object.entries(categories)) section(`${c.icon} ${c.title}`, apps.filter(a => a.category === k));
  const extras = h('div', { class: 'm-grid' });
  const about = iconEl({ title: 'about.txt', icon: '📝' }, { tile: false });
  about.addEventListener('click', () => openAbout());
  const bin = iconEl({ title: 'Trash', icon: '🗑️' }, { tile: false });
  bin.addEventListener('click', () => trash());
  const files = iconEl({ title: 'My Potato', icon: '🖥️' }, { tile: false });
  files.addEventListener('click', () => openFiles());
  extras.append(files, about, bin);
  desktop.append(h('h2', { class: 'm-cat' }, '🥔 System'), extras);
}
