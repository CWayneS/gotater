// Things you can open: apps, folders, about.txt, Run…, Display Properties, dialogs.
import apps, { categories } from '../apps.js';
import * as wm from './wm.js';
import { prefs, setPref } from './store.js';

export { apps, categories };
export const appById = id => apps.find(a => a.id === id);
export const isMobile = () => document.body.classList.contains('mobile');
export const appUrl = a => `/apps/${a.id}/`;
export const newest = (n = 3) => [...apps].sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, n);

const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, v);
  }
  e.append(...kids.flat().filter(k => k != null));
  return e;
};
export { h };

export function iconEl(item, { tag = 'button', tile = true } = {}) {
  const glyph = h('span', { class: 'glyph' + (tile && item.color ? ' tile' : '') }, item.icon);
  if (tile && item.color) glyph.style.background = item.color;
  return h(tag, { class: 'icon', title: item.blurb || item.title },
    glyph, h('span', { class: 'label' }, item.title), item.blurb ? h('span', { class: 'blurb' }, item.blurb) : null);
}

export function openApp(id, from) {
  const a = appById(id);
  if (!a) return dialog({ title: 'TaterOS', icon: '⚠️', text: `Cannot find '${id}'. Make sure you typed the name correctly, and then try again.` });
  if (isMobile()) { location.href = appUrl(a); return; }
  return wm.open({
    id: 'app:' + a.id, appId: a.id, title: a.title, icon: a.icon, url: appUrl(a),
    w: a.w || 960, h: a.h || 680, max: a.max, from,
    menu: [
      { label: '↻ Reload', action: w => { w.frame.src = appUrl(a); } },
      { label: '↗ Pop out', action: w => { window.open(appUrl(a), '_blank', 'noopener'); wm.close(w.id); } },
      ...(document.fullscreenEnabled ? [{ label: '⛶ Fullscreen', action: w => wm.fullscreen(w) }] : []),
      { label: '▢ Maximize', action: w => wm.toggleMax(w) },
      '|',
      { addr: location.host + appUrl(a) },
    ],
  });
}

export function openFolder(cat, from) {
  const isNew = cat === 'new';
  const meta = isNew ? { title: 'New!', icon: '✨' } : categories[cat];
  const list = isNew ? newest() : apps.filter(a => a.category === cat);
  const view = h('div', { class: 'explorer' + (prefs.folderView === 'list' ? ' list' : ''), role: 'listbox' });
  let status;
  for (const a of list) {
    const ic = iconEl(a);
    ic.addEventListener('click', () => {
      view.querySelectorAll('.selected').forEach(n => n.classList.remove('selected'));
      ic.classList.add('selected');
      status.firstChild.textContent = a.blurb;
      if (isMobile() || matchMedia('(pointer: coarse)').matches) openApp(a.id, ic.getBoundingClientRect());
    });
    ic.addEventListener('dblclick', () => openApp(a.id, ic.getBoundingClientRect()));
    ic.addEventListener('keydown', e => { if (e.key === 'Enter') openApp(a.id, ic.getBoundingClientRect()); });
    view.append(ic);
  }
  if (!list.length) view.append(h('div', { class: 'empty' }, 'This folder is empty. Like a potato skin.'));
  const setView = mode => () => { view.classList.toggle('list', mode === 'list'); setPref('folderView', mode); };
  const w = wm.open({
    id: 'folder:' + cat, title: meta.title, icon: meta.icon, body: view, w: 560, h: 400, from,
    menu: [{ label: 'Icons', action: setView('icons') }, { label: 'List', action: setView('list') }, '|', { addr: 'C:\\TATER\\' + meta.title.toUpperCase().replace('!', '') }],
    status: `${list.length} object(s)`, statusRight: 'My Potato',
  });
  status = w.status;
  return w;
}

const ABOUT = `ABOUT.TXT
=========

GoTater — some simple apps. Have fun.

Everything here is a little single-page thing:
games, things to learn, tools, and toys.

  double-click   open things
  /              Run… (search every app)
  ⛶ / ▢          fullscreen or maximize a window
  drag title     move, drag to top edge = maximize
  ↗ Pop out      open an app in its own tab

Built with passion and potatoes.
© 2026 GoTater Games

source:  <a href="https://github.com/CWayneS/gotater" target="_blank" rel="noopener">github.com/CWayneS/gotater</a>
`;

export function openAbout(from) {
  return wm.open({
    id: 'about', title: 'about.txt - Notepad', icon: '📝', w: 520, h: 420, from,
    body: h('pre', { class: 'notepad', html: ABOUT }),
    menu: [{ label: 'File', action: () => {} }, { label: 'Edit', action: () => {} }, { label: 'Help', action: () => dialog({ title: 'Help', icon: '❓', text: 'There is no help. Only potatoes.' }) }],
  });
}

export function dialog({ title, icon = 'ℹ️', text, buttons = ['OK'], onButton }) {
  const id = 'dialog:' + Math.random().toString(36).slice(2);
  const actions = h('div', { class: 'dialog-actions' });
  const body = h('div', { style: 'display:flex;flex-direction:column;flex:1' },
    h('div', { class: 'dialog-body' }, h('span', { class: 'big' }, icon), h('div', {}, text)), actions);
  for (const label of buttons) {
    actions.append(h('button', { class: 'bevel', onclick: () => { wm.close(id); onButton?.(label); } }, label));
  }
  const w = wm.open({ id, title, icon: '', body, w: 380, h: 190, kind: 'dialog', center: true, resizable: false });
  actions.firstChild.focus();
  return w;
}

// ---------- Run… ----------
function score(a, q) {
  if (!q) return 1;
  const hay = (a.title + ' ' + a.blurb + ' ' + a.category + ' ' + a.id).toLowerCase();
  if (a.title.toLowerCase().startsWith(q)) return 100;
  if (hay.includes(q)) return 50;
  let i = 0; // subsequence match
  for (const c of hay) if (c === q[i]) i++;
  return i === q.length ? 10 : 0;
}

export function openRun() {
  const input = h('input', { type: 'text', placeholder: 'Type the name of a program…', 'aria-label': 'Search apps', class: 'bevel-in' });
  const ul = h('ul', { class: 'bevel-in', role: 'listbox' });
  let sel = 0, results = [];
  const render = () => {
    const q = input.value.trim().toLowerCase();
    results = apps.map(a => [a, score(a, q)]).filter(([, s]) => s).sort((x, y) => y[1] - x[1]).map(([a]) => a);
    if ('about.txt'.includes(q) && q) results.push({ id: '@about', title: 'about.txt', icon: '📝', blurb: 'Notepad' });
    sel = Math.min(sel, Math.max(0, results.length - 1));
    ul.replaceChildren(...results.map((a, i) => h('li', { class: i === sel ? 'on' : '', onclick: () => go(a), onpointermove: () => { sel = i; mark(); } },
      h('span', {}, a.icon), h('span', {}, a.title), h('small', {}, a.blurb))));
  };
  const mark = () => [...ul.children].forEach((li, i) => li.classList.toggle('on', i === sel));
  const go = a => {
    if (!a) return;
    wm.close('run');
    a.id === '@about' ? openAbout() : openApp(a.id);
  };
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, results.length - 1); mark(); ul.children[sel]?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); mark(); ul.children[sel]?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    else if (e.key === 'Enter') go(results[sel]);
    else if (e.key === 'Escape') wm.close('run');
  });
  render();
  const w = wm.open({ id: 'run', title: 'Run', icon: '🔎', body: h('div', { class: 'run' }, input, ul), w: 440, h: 380, center: true });
  input.focus();
  return w;
}

// ---------- Display Properties ----------
export const WALLPAPERS = [
  { id: 'spuds', title: 'Spud Drift', preview: '#2f7d78' },
  { id: 'vapor', title: 'Vapor Field', preview: 'linear-gradient(#1a0b2e 50%, #ff3d9a 50%, #1a0b2e 54%)' },
  { id: 'classic', title: 'Classic', preview: '#2f7d78' },
  { id: 'dirt', title: 'Root Cellar', preview: '#3a2414' },
];

export const SCREENSAVERS = [
  { id: 'potato', title: 'Bouncing Potato' },
  { id: 'pipes', title: '3D Pipes' },
  { id: 'starfield', title: 'Starfield' },
  { id: 'random', title: '(Random)' },
];

export function openDisplay(applyPrefs, previewSaver) {
  const wp = h('div', { class: 'swatches' });
  const theme = h('div', { class: 'swatches' });
  const build = () => {
    wp.replaceChildren(...WALLPAPERS.map(p => {
      const b = h('button', { class: 'bevel-in' + (prefs.wallpaper === p.id ? ' on' : ''), onclick: () => { setPref('wallpaper', p.id); applyPrefs(); build(); } }, h('span', {}, p.title));
      b.style.background = p.preview;
      return b;
    }));
    theme.replaceChildren(...[['classic', 'Tater Gray', '#c3bdb2'], ['dark', 'Midnight Yam', '#2c2a33']].map(([id, title, bg]) => {
      const b = h('button', { class: 'bevel-in' + (prefs.theme === id ? ' on' : ''), onclick: () => { setPref('theme', id); applyPrefs(); build(); } }, h('span', {}, title));
      b.style.background = bg;
      return b;
    }));
  };
  build();
  const ss = h('input', { type: 'checkbox' });
  ss.checked = prefs.screensaver !== false;
  ss.addEventListener('change', () => setPref('screensaver', ss.checked));
  const pick = h('select', { onchange: () => setPref('saver', pick.value) },
    ...SCREENSAVERS.map(s => h('option', { value: s.id }, s.title)));
  pick.value = prefs.saver;
  const saverRow = h('div', { class: 'saver-row' }, pick, h('button', { class: 'bevel', onclick: previewSaver }, 'Preview'));
  const body = h('div', { class: 'props' },
    h('fieldset', {}, h('legend', {}, 'Wallpaper'), wp),
    h('fieldset', {}, h('legend', {}, 'Appearance'), theme),
    h('fieldset', {}, h('legend', {}, 'Screen Saver'), saverRow, h('label', {}, ss, 'Start after 90 seconds idle')));
  return wm.open({ id: 'display', title: 'Display Properties', icon: '🖥️', body, w: 470, h: 520, center: true });
}

// ---------- Potato Clock (click the tray time) ----------
const POTATO_ART = `
<svg viewBox="0 0 360 200" aria-hidden="true">
  <rect x="0" y="160" width="360" height="40" fill="#8a6440"/><rect x="0" y="160" width="360" height="3" fill="#a87c52"/>
  <path d="M0 176h120M150 186h140M40 194h90M250 172h110" stroke="#76542f" stroke-width="1.5"/>
  <ellipse cx="90" cy="164" rx="60" ry="8" fill="rgba(0,0,0,.18)"/><ellipse cx="270" cy="164" rx="60" ry="8" fill="rgba(0,0,0,.18)"/>
  <path d="M34 140c-4-26 26-42 58-40s60 14 56 40-30 28-58 26-52-4-56-26z" fill="#b98a4e" stroke="#6e4a22" stroke-width="2"/>
  <path d="M214 136c2-24 30-38 62-34s52 18 50 40-32 26-60 24-54-6-52-30z" fill="#c09252" stroke="#6e4a22" stroke-width="2"/>
  <path d="M50 124c10-12 30-16 46-14" stroke="#dcb47a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M232 120c12-10 30-14 44-12" stroke="#e2bc82" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g fill="#7a5428"><circle cx="58" cy="146" r="2.2"/><circle cx="96" cy="152" r="1.8"/><circle cx="128" cy="134" r="2"/>
    <circle cx="244" cy="144" r="2"/><circle cx="292" cy="150" r="2.2"/><circle cx="270" cy="128" r="1.6"/></g>
  <rect x="66" y="94" width="8" height="30" fill="#c8753a" stroke="#7a3e16"/>
  <rect x="246" y="94" width="8" height="30" fill="#c8753a" stroke="#7a3e16"/>
  <rect x="108" y="92" width="4" height="32" fill="#a4aab0" stroke="#5a6066"/><rect x="104" y="89" width="12" height="4" fill="#a4aab0" stroke="#5a6066"/>
  <rect x="288" y="92" width="4" height="32" fill="#a4aab0" stroke="#5a6066"/><rect x="284" y="89" width="12" height="4" fill="#a4aab0" stroke="#5a6066"/>
  <g fill="none" stroke-width="3" stroke-linecap="round">
    <path d="M70 94C68 52 150 100 160 76" stroke="#c0281e"/>
    <path d="M110 89C150 74 214 74 250 94" stroke="#3a8a3a"/>
    <path d="M290 89C292 52 210 100 200 76" stroke="#26221e"/>
  </g>
  <g fill="#e8c860" stroke="#7a6420"><circle cx="70" cy="94" r="3"/><circle cx="110" cy="89" r="3"/><circle cx="250" cy="94" r="3"/><circle cx="290" cy="89" r="3"/></g>
  <rect x="126" y="12" width="108" height="64" rx="6" fill="#3a3632" stroke="#16130f" stroke-width="2"/>
  <rect x="136" y="20" width="88" height="40" rx="3" fill="#a8b890" stroke="#16130f"/>
  <text class="lcd-time" x="180" y="49" text-anchor="middle">--:--</text>
  <text class="lcd-ampm" x="219" y="31" text-anchor="end"></text>
  <text class="lcd-sec" x="219" y="56" text-anchor="end"></text>
  <circle cx="160" cy="76" r="4" fill="#c0281e" stroke="#16130f"/><circle cx="200" cy="76" r="4" fill="#26221e" stroke="#16130f"/>
  <text x="150" y="70" class="lcd-tag">+</text><text x="206" y="70" class="lcd-tag">−</text>
</svg>`;

export function openClock(from) {
  if (wm.get('clock')) return wm.open({ id: 'clock' });
  const art = h('div', { class: 'potclock-art bevel-in', html: POTATO_ART });
  const date = h('div', { class: 'potclock-date' });
  const meter = h('div', { class: 'potclock-meter' });
  const cal = h('div', { class: 'potclock-cal' });
  const opened = Date.now();
  const timeFmt = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  let calDay = '';

  const tick = () => {
    if (!wm.get('clock')) return clearInterval(timer);
    const d = new Date(), parts = Object.fromEntries(timeFmt.formatToParts(d).map(p => [p.type, p.value]));
    art.querySelector('.lcd-time').textContent = `${parts.hour}:${parts.minute}`;
    art.querySelector('.lcd-sec').textContent = parts.second;
    art.querySelector('.lcd-ampm').textContent = parts.dayPeriod || '';
    date.textContent = d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // the potatoes slowly give it their all
    const fresh = Math.max(0, 100 - (Date.now() - opened) / 60000 * .5);
    const volts = (1.46 * fresh / 100 + Math.sin(d / 900) * .01 + Math.random() * .006).toFixed(2);
    meter.textContent = `⚡ ${volts} V  ·  potato freshness ${Math.round(fresh)}%`;
    const today = d.toDateString();
    if (today !== calDay) { calDay = today; buildCal(d); }
  };
  const buildCal = d => {
    const first = new Date(d.getFullYear(), d.getMonth(), 1), days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(n => h('b', {}, n));
    for (let i = 0; i < first.getDay(); i++) cells.push(h('span', {}));
    for (let n = 1; n <= days; n++) cells.push(h('span', { class: n === d.getDate() ? 'on' : '' }, String(n)));
    cal.replaceChildren(h('div', { class: 'potclock-month' }, d.toLocaleDateString([], { month: 'long', year: 'numeric' })), h('div', { class: 'potclock-grid' }, ...cells));
  };

  const body = h('div', { class: 'potclock' }, art, date, meter, h('fieldset', {}, h('legend', {}, 'Calendar'), cal));
  const w = wm.open({
    id: 'clock', title: 'Potato Clock', icon: '🥔', body, w: 400, h: 560, from, anchor: from,
    status: 'Powered by 2 potatoes', statusRight: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  });
  const timer = setInterval(tick, 1000);
  tick();
  return w;
}
