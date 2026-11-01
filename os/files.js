// My Potato: a file browser. Mostly fake files full of jokes, plus a Source Code
// folder that opens the site's real files (read-only) in Notepad.
import { apps, h, iconEl, openApp, dialog, isMobile } from './shell.js';
import * as wm from './wm.js';
import { trash } from './fx.js';

const REPO = 'https://github.com/CWayneS/gotater';

// The OS files, listed by hand because static hosting can't list a directory.
// Add new os/ files here. Apps come from apps.js, so they're always current.
const OS_FILES = ['boot.js', 'desktop.js', 'files.js', 'fx.js', 'main.js', 'shell.js', 'store.js', 'taskbar.js', 'wm.js', 'os.css'];

// ---------- fake file contents ----------
const TXT = {
  grocery: `GROCERY LIST
------------
- potatoes (russet)
- potatoes (red)
- potatoes (yukon gold, for company)
- sour cream
- chives
- butter (a worrying amount)
- something green, so the doctor stops asking
- potatoes (backup)`,

  diary: `DEAR DIARY

Mon: Was dug up today. Very bright up here. Everyone is so tall.

Tue: Got washed. Did not consent to this.

Wed: Overheard the word "gratin." Looked it up. Wish I hadn't.

Thu: Started sprouting out of stress. Grew three new eyes. Now I can
     see the peeler coming from every angle.

Fri: Rolled under the fridge. Safe at last. It's dark and there is a
     single grape here who says he's been here since 2019.`,

  resume: `RESUME OF: A. POTATO

OBJECTIVE
  To become a side dish at a nice restaurant, or failing that, chips.

EXPERIENCE
  1998-2003   Couch Potato         Living room
              - Watched an estimated 9,000 hours of television
              - Never once changed the channel
  2003-2010   Hot Potato           Various parties
              - Passed around a lot. Did not take it personally
  2010-now    Spud                 Self-employed

SKILLS
  Mashing, frying, baking, roasting, being a battery (1.1 V, see Clock)

REFERENCES
  Mr. Potato Head (declined to comment; he was busy rearranging his face)`,

  passwords: `PASSWORDS.TXT

  email ........ hunter2
  bank ......... hunter2
  TaterOS ...... ************

Hey. Why are you reading this? Close this file.
Nobody keeps their passwords in a text file on the desktop.
(Please change all of these. They are all hunter2.)`,

  novel: `THE LONG MASH
a novel, draft 47

CHAPTER ONE

It was a dark and starchy night.

CHAPTER TWO

[TODO: write chapter two]

CHAPTER THREE

Everyone was mashed. The end.

---
Notes to self: maybe less mashing? Editor says "too much mashing."
Editor is a carrot. What does he know.`,

  todo: `TODO.TXT

[x] boot up
[x] make a desktop full of potatoes
[ ] finish the novel (see novel_draft_v47.txt)
[ ] empty the trash  (it refuses)
[ ] find out what potato.sys does
[ ] stop sprouting`,

  latkes: `LATKES (makes ~16)

  4 potatoes, grated and squeezed dry (squeeze harder than that)
  1 onion, grated
  2 eggs
  1/4 cup flour or matzo meal
  salt, pepper, and a lot of oil

Mix. Make little flat piles in hot oil. Fry until deep golden,
about 3-4 min a side. Drain on paper. Eat with applesauce AND sour
cream, because you don't have to choose.

For a nicer version, open Recipe Studio (Program Files).`,

  fries: `FRIES, THE GOOD KIND

1. Cut potatoes into sticks. Soak in cold water 30 min.
2. Dry them. Really dry them. Water + hot oil = regret.
3. Fry at 325°F for 5 min. Rest.
4. Fry again at 375°F until golden and crisp.
5. Salt immediately, while they can still feel it.`,

  autoexec: `@ECHO OFF
REM AUTOEXEC.BAT for TaterOS

PROMPT $P$G
PATH C:\\TATEROS;C:\\PROGRA~1;C:\\PANTRY
SET SPUD=RUSSET
SET BLASTER=A220 I5 D1 T4

LH C:\\TATEROS\\MOUSE.COM
LH C:\\TATEROS\\POTATO.SYS /PEEL=NEVER

ECHO Warming up the oven...
WIN`,

  config: `DEVICE=C:\\TATEROS\\HIMEM.SYS
DEVICE=C:\\TATEROS\\STARCH.SYS /MASH
DOS=HIGH,UMB
FILES=40
BUFFERS=20
STACKS=9,256
POTATOES=640   ; 640 potatoes ought to be enough for anybody`,

  winini: `[TaterOS]
wallpaper=spuds
theme=russet
crispiness=medium

[Fonts]
Comic Sans=no

[Sound]
SystemStart=crunch.wav
SystemExit=sizzle.wav
Error=sad_trombone.wav

[Kitchen]
Oven=375
Fryer=on
Microwave=only in emergencies`,

  readme: `HELLO.TXT

This is TaterOS, a pretend retro OS full of small apps.

Most files on this computer are made up. The Source Code folder is not:
those are the real files this site runs on. Double-click one to read it.

Everything is also on GitHub:
${REPO}`,
};

const PICS = {
  vacation: { art: '🌋🏖️🥔🌴🌊', caption: 'Me at the beach, 1997. Got a little too toasty.' },
  selfie: { art: '🥔', caption: 'Selfie. No filter. All eyes.' },
  family: { art: '🥔🍟🍠🥔🥔', caption: 'Family reunion. Cousin Fry came. Sweet Potato says she\'s "not technically family."' },
  sunset: { art: '🌅', caption: 'sunset.jpg, the default wallpaper nobody ever changes. Also the only picture without a potato in it.' },
};

// ---------- the tree ----------
// kinds: dir, txt (Notepad), pic (picture viewer), app (opens an app), say (just a dialog), src (real file), action
const dir = (name, icon, kids, extra = {}) => ({ kind: 'dir', name, icon, kids, ...extra });
const txt = (name, text, icon = '📄') => ({ kind: 'txt', name, icon, text });
const pic = (name, p) => ({ kind: 'pic', name, icon: '🖼️', ...PICS[p] });
const say = (name, icon, title, text, big = icon) => ({ kind: 'say', name, icon, title, text, big });
const src = path => ({ kind: 'src', name: path.split('/').pop(), icon: path.endsWith('.js') ? '📜' : path.endsWith('.css') ? '🎨' : path.endsWith('.md') ? '📘' : '📄', path });

function buildTree() {
  const appDirs = apps.map(a => dir(a.id, '📁', [
    { kind: 'app', name: a.title + '.exe', icon: a.icon, app: a.id },
    src(`apps/${a.id}/index.html`),
  ]));
  return dir('My Potato', '🖥️', [
    dir('My Documents', '📁', [
      txt('hello.txt', TXT.readme, '📝'),
      txt('grocery_list.txt', TXT.grocery),
      txt('diary.txt', TXT.diary),
      txt('resume.doc', TXT.resume, '📘'),
      txt('passwords.txt', TXT.passwords, '🔒'),
      txt('novel_draft_v47.txt', TXT.novel),
      txt('todo.txt', TXT.todo),
      say('taxes_1997.xls', '📊', 'Tater Excel', 'Tater Excel has stopped working. It saw the numbers.', '💸'),
      dir('Recipes', '📁', [txt('latkes.txt', TXT.latkes), txt('fries.txt', TXT.fries)]),
      dir('Secret Folder', '📁', [], { empty: 'Nothing to see here. Move along. It\'s just an empty folder. Stop looking.' }),
    ]),
    dir('My Pictures', '📁', [pic('vacation.jpg', 'vacation'), pic('selfie.bmp', 'selfie'), pic('family_reunion.jpg', 'family'), pic('sunset.jpg', 'sunset'),
      say('cat.gif', '🐈', 'cat.gif', 'The cat has walked across the keyboard and left the file.', '🐈')]),
    dir('Program Files', '📁', apps.map(a => ({ kind: 'app', name: a.title + '.exe', icon: a.icon, app: a.id, blurb: a.blurb }))),
    dir('TaterOS', '📁', [
      txt('AUTOEXEC.BAT', TXT.autoexec, '⚙️'),
      txt('CONFIG.SYS', TXT.config, '⚙️'),
      txt('WIN.INI', TXT.winini, '⚙️'),
      say('potato.sys', '🥔', 'potato.sys', 'This file is required for TaterOS to run. Nobody knows why. Please do not touch it.', '⚠️'),
      say('starch.dll', '🧩', 'starch.dll', 'STARCH.DLL is holding everything together. Literally.', '🧩'),
      dir('Source Code', '📂', [
        txt('README_FIRST.txt', `These are the real files that run this site, loaded live.\nThey open read-only. To change them, see the repo:\n${REPO}`, '📝'),
        src('index.html'), src('apps.js'), src('README.md'), src('CLAUDE.md'),
        dir('os', '📁', OS_FILES.map(f => src('os/' + f))),
        dir('apps', '📁', appDirs),
      ], { blurbRight: 'Real files' }),
    ]),
    { kind: 'action', name: 'Trash', icon: '🗑️', run: from => trash(from) },
  ]);
}

// ---------- viewers ----------
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const linkify = s => esc(s).replace(/https:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);

function openNotepad(id, name, text, { status, menu = [] } = {}) {
  return wm.open({
    id: 'note:' + id, title: name + ' - Notepad', icon: '📝', w: 620, h: 460,
    body: h('pre', { class: 'notepad', html: linkify(text) }),
    menu: [...menu, { label: 'Help', action: () => dialog({ title: 'Help', icon: '❓', text: 'There is no help. Only potatoes.' }) }],
    status: status || `${text.split('\n').length} lines`, statusRight: 'Read-only',
  });
}

async function openSource(f) {
  const w = openNotepad(f.path, f.name, 'Loading ' + f.path + '…', { menu: [{ label: 'View on GitHub', action: () => window.open(`${REPO}/blob/main/${f.path}`, '_blank', 'noopener') }] });
  try {
    const res = await fetch('/' + f.path);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const pre = w.el.querySelector('.notepad');
    pre.innerHTML = linkify(text);
    w.status.firstChild.textContent = `${text.split('\n').length.toLocaleString()} lines · ${(text.length / 1024).toFixed(1)} KB`;
  } catch (err) {
    w.el.querySelector('.notepad').textContent = `Could not open ${f.path} (${err.message}).\n\nIt might be on GitHub instead:\n${REPO}/blob/main/${f.path}`;
  }
}

function openPicture(f) {
  return wm.open({
    id: 'pic:' + f.name, title: f.name + ' - Tater Picture Viewer', icon: '🖼️', w: 460, h: 360,
    body: h('div', { class: 'picview' }, h('div', { class: 'art' }, f.art), h('p', {}, f.caption)),
    status: '640 × 480 · 256 colors', statusRight: '100%',
  });
}

// ---------- explorer ----------
export function openFiles(from) {
  if (wm.get('files')) return wm.open({ id: 'files' });
  const root = buildTree();
  let path = [root];
  const history = [];
  const view = h('div', { class: 'explorer files', role: 'listbox' });
  const here = () => path[path.length - 1];
  const addr = () => 'C:\\' + path.slice(1).map(d => d.name.toUpperCase().replace(/ /g, '_')).join('\\');

  const go = (newPath, push = true) => {
    if (push) history.push(path);
    path = newPath;
    render();
  };
  const open = (f, rect) => {
    if (f.kind === 'dir') return go([...path, f]);
    if (f.kind === 'app') return openApp(f.app, rect);
    if (f.kind === 'txt') return openNotepad(addr() + '\\' + f.name, f.name, f.text);
    if (f.kind === 'src') return openSource(f);
    if (f.kind === 'pic') return openPicture(f);
    if (f.kind === 'say') return dialog({ title: f.title, icon: f.big, text: f.text });
    if (f.kind === 'action') return f.run(rect);
  };

  let w;
  function render() {
    const d = here();
    view.replaceChildren();
    for (const f of d.kids) {
      const ic = iconEl({ title: f.name, icon: f.icon, blurb: f.blurb }, { tile: false });
      const fire = () => open(f, ic.getBoundingClientRect());
      ic.addEventListener('click', () => {
        view.querySelectorAll('.selected').forEach(n => n.classList.remove('selected'));
        ic.classList.add('selected');
        if (isMobile() || matchMedia('(pointer: coarse)').matches) fire();
      });
      ic.addEventListener('dblclick', fire);
      ic.addEventListener('keydown', e => { if (e.key === 'Enter') fire(); });
      view.append(ic);
    }
    if (!d.kids.length) view.append(h('div', { class: 'empty' }, d.empty || 'This folder is empty. Like a potato skin.'));
    if (!w) return;
    w.el.querySelector('.t-text').textContent = d.name;
    w.el.querySelector('.t-icon').textContent = d.icon;
    w.el.querySelector('.addr').textContent = addr();
    w.status.firstChild.textContent = `${d.kids.length} object(s)`;
    w.status.lastChild.textContent = d.blurbRight || 'My Potato';
    view.scrollTop = 0;
  }

  render();
  w = wm.open({
    id: 'files', title: root.name, icon: root.icon, body: view, w: 600, h: 420, from,
    menu: [
      { label: '← Back', action: () => history.length && go(history.pop(), false) },
      { label: '↑ Up', action: () => path.length > 1 && go(path.slice(0, -1)) },
      { label: 'Home', action: () => path.length > 1 && go([root]) },
      '|', { addr: 'C:\\' },
    ],
    status: '0 object(s)', statusRight: 'My Potato',
  });
  render();
  return w;
}
