// Wallpapers, screensaver, trash, shutdown, and the Tater Panic.
import * as wm from './wm.js';
import { dialog, iconEl, h, isMobile } from './shell.js';
import { prefs, sessionSet } from './store.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- wallpaper ----------
const cv = document.getElementById('wallpaper');
const ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1, raf = 0, scene = null;

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  scene?.init?.();
  if (scene && (reduced || !scene.frame)) scene.draw(0);
}

const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
const rand = (a, b) => a + Math.random() * (b - a);

const scenes = {
  classic: {
    draw() {
      ctx.fillStyle = '#2f7d78';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(0,0,0,.06)';
      for (let y = 0; y < H; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < W; x += 4) ctx.fillRect(x, y, 2, 2);
      ctx.font = '700 15px "Pixelify Sans", monospace';
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      ctx.textAlign = 'right';
      ctx.fillText('TaterOS 95 · build 0xSPUD', W - 14, H - 54);
    },
  },

  spuds: {
    init() {
      const n = Math.round(Math.min(26, (W * H) / 60000) + 6);
      this.p = Array.from({ length: n }, () => {
        const depth = Math.random();
        return { x: rand(0, W), y: rand(0, H), s: 18 + depth * 46, depth, vx: rand(-6, 6) * (0.3 + depth), vy: (6 + depth * 18), r: rand(0, 6.28), vr: rand(-0.4, 0.4) };
      }).sort((a, b) => a.depth - b.depth);
      this.stars = Array.from({ length: 70 }, () => ({ x: rand(0, W), y: rand(0, H), t: rand(0, 6.28) }));
    },
    frame: true,
    draw(t) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1f5f5c'); g.addColorStop(1, '#2f7d78');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const s of this.stars) {
        ctx.fillStyle = `rgba(255,240,200,${0.15 + 0.15 * Math.sin(t / 900 + s.t)})`;
        ctx.fillRect(s.x, s.y, 2, 2);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0;
      this.last = t;
      for (const p of this.p) {
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y - p.s > H) { p.y = -p.s; p.x = rand(0, W); }
        if (p.x < -p.s) p.x = W + p.s; else if (p.x > W + p.s) p.x = -p.s;
        ctx.save();
        ctx.globalAlpha = 0.35 + p.depth * 0.6;
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.font = `${p.s}px ${EMOJI}`;
        ctx.fillText('🥔', 0, 0);
        ctx.restore();
      }
    },
  },

  vapor: {
    frame: true,
    draw(t) {
      const hz = H * 0.55;
      const sky = ctx.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, '#0d0221'); sky.addColorStop(1, '#5a1a6e');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hz);
      // striped sun (a potato-shaped sun, obviously)
      const r = Math.min(W, H) * 0.2, cx = W / 2, cy = hz - r * 0.35;
      ctx.save();
      ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.12, r, 0, 0, Math.PI * 2); ctx.clip();
      const sun = ctx.createLinearGradient(0, cy - r, 0, cy + r);
      sun.addColorStop(0, '#ffd36b'); sun.addColorStop(1, '#ff3d9a');
      ctx.fillStyle = sun; ctx.fillRect(cx - r * 1.2, cy - r, r * 2.4, r * 2);
      ctx.fillStyle = '#5a1a6e';
      for (let i = 0; i < 7; i++) {
        const y = cy + r * 0.1 + i * r * 0.14;
        ctx.fillRect(cx - r * 1.2, y, r * 2.4, 2 + i * 1.6);
      }
      ctx.restore();
      ctx.fillStyle = '#12051f'; ctx.fillRect(0, hz, W, H - hz);
      ctx.strokeStyle = 'rgba(255,61,154,.75)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = -20; i <= 20; i++) {
        ctx.moveTo(W / 2 + i * 12, hz);
        ctx.lineTo(W / 2 + i * W * 0.14, H);
      }
      const off = (t / 1600) % 1;
      for (let i = 0; i < 18; i++) {
        const k = (i + off) / 18;
        const y = hz + (H - hz) * k * k;
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,61,154,.25)'; ctx.fillRect(0, hz - 1, W, 2);
    },
  },

  dirt: {
    init() {
      this.layers = [['#4a2e18', 0], ['#3a2414', 0.3], ['#2c1b0f', 0.6], ['#1d120a', 0.85]];
      this.specks = Array.from({ length: 260 }, () => ({ x: rand(0, W), y: rand(0, H), c: Math.random() < 0.5 ? '#5c3c22' : '#22160c', s: rand(1, 4) }));
      this.buried = Array.from({ length: 9 }, () => ({ x: rand(0, W), y: rand(H * 0.2, H), s: rand(20, 42), r: rand(0, 6.28) }));
      this.worm = { x: -60, y: rand(H * 0.3, H * 0.8) };
    },
    frame: true,
    draw(t) {
      for (const [c, y] of this.layers) {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.moveTo(0, H * y);
        for (let x = 0; x <= W; x += 40) ctx.lineTo(x, H * y + Math.sin(x / 90 + y * 10) * 12);
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      }
      for (const s of this.specks) { ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, s.s, s.s); }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const b of this.buried) {
        ctx.save(); ctx.globalAlpha = 0.55; ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.font = `${b.s}px ${EMOJI}`; ctx.fillText('🥔', 0, 0); ctx.restore();
      }
      // a worm takes the long way across
      const w = this.worm;
      w.x = ((t / 40) % (W + 200)) - 100;
      ctx.strokeStyle = '#d98b8b'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) ctx.lineTo(w.x - i * 6, w.y + Math.sin(t / 200 - i * 0.8) * 4);
      ctx.stroke();
    },
  },
};

export function setWallpaper(id) {
  cancelAnimationFrame(raf);
  scene = scenes[id] || scenes.spuds;
  scene.last = 0;
  resize();
  if (!scene.frame || reduced) return;
  const loop = t => {
    raf = requestAnimationFrame(loop);
    // skip work when nothing can see the wallpaper
    if (document.hidden || document.querySelector('.win.max:not(.min)') || !document.getElementById('screensaver').hidden) return;
    scene.draw(t);
  };
  raf = requestAnimationFrame(loop);
}
addEventListener('resize', resize);

// ---------- screensaver ----------
const saver = document.getElementById('screensaver');
let idleTimer = 0, saverRaf = 0, saverAt = 0;
const IDLE_MS = 90_000;

function poke() {
  if (!saver.hidden) {
    if (performance.now() - saverAt < 800) return; // let a Preview click settle before mouse jiggle ends it
    stopSaver();
  }
  clearTimeout(idleTimer);
  idleTimer = setTimeout(startSaver, IDLE_MS);
}

// a full-screen canvas for the savers that draw
function saverCanvas() {
  const c = h('canvas', {});
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  c.style.cssText = 'width:100%;height:100%;display:block';
  saver.replaceChildren(c);
  const g = c.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return g;
}

// each saver sets itself up and returns a per-frame step(dt, t)
const savers = {
  potato() {
    const d = h('div', { class: 'dvd' }, '🥔', h('small', {}, 'TaterOS'));
    saver.replaceChildren(d);
    const colors = ['#ffd36b', '#ff3d9a', '#6bffb8', '#6bc8ff', '#c86bff', '#ff8a3d'];
    let x = rand(0, innerWidth - 120), y = rand(0, innerHeight - 120), vx = 140, vy = 110, ci = 0;
    d.style.color = colors[0];
    return dt => {
      const bw = d.offsetWidth, bh = d.offsetHeight;
      x += vx * dt; y += vy * dt;
      let hit = false;
      if (x <= 0 || x + bw >= innerWidth) { vx = -vx; x = Math.max(0, Math.min(x, innerWidth - bw)); hit = true; }
      if (y <= 0 || y + bh >= innerHeight) { vy = -vy; y = Math.max(0, Math.min(y, innerHeight - bh)); hit = true; }
      if (hit) { ci = (ci + 1) % colors.length; d.style.color = colors[ci]; d.style.filter = `hue-rotate(${ci * 60}deg)`; }
      d.style.transform = `translate(${x}px, ${y}px)`;
    };
  },

  pipes() {
    const g = saverCanvas(), W = innerWidth, H = innerHeight;
    const N = 14, CELL = 1 / N, CAM = 2.4, F = Math.min(W, H) * 1.5;
    const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const COLORS = ['#d23c3c', '#3cb44b', '#3c64d2', '#e6c832', '#c84bc8', '#3cc8c8', '#e6823c', '#c8c8c8'];
    let used, pipes, filled, fade;
    // grid cell -> screen, with a little perspective so near pipes look fatter
    const proj = (x, y, z) => {
      const s = F / (CAM + (z - N / 2) * CELL);
      return [W / 2 + (x - N / 2) * CELL * s, H / 2 + (y - N / 2) * CELL * s, s * CELL * .28];
    };
    const free = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < N && y < N && z < N && !used.has(`${x},${y},${z}`);
    const take = (x, y, z) => used.add(`${x},${y},${z}`);
    function shade(c, a) { // lighten (a > 0) or darken (a < 0) a hex color
      const n = parseInt(c.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(a > 0 ? v + (255 - v) * a : v * (1 + a))));
      return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
    }
    function ball(p, color) {
      const [sx, sy, r] = proj(...p);
      if (Math.random() < .02) { // the occasional teapot, but it's a potato
        g.font = `${r * 4}px ${EMOJI}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🥔', sx, sy); return;
      }
      const grad = g.createRadialGradient(sx - r * .4, sy - r * .4, r * .1, sx, sy, r * 1.35);
      grad.addColorStop(0, shade(color, .7)); grad.addColorStop(.5, color); grad.addColorStop(1, shade(color, -.6));
      g.fillStyle = grad; g.beginPath(); g.arc(sx, sy, r * 1.35, 0, Math.PI * 2); g.fill();
    }
    function tube(a, b, color) {
      const [x0, y0, r0] = proj(...a), [x1, y1, r1] = proj(...b);
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, r = (r0 + r1) / 2;
      const grad = g.createLinearGradient(x0 + nx * r, y0 + ny * r, x0 - nx * r, y0 - ny * r);
      grad.addColorStop(0, shade(color, -.55)); grad.addColorStop(.3, shade(color, .55)); grad.addColorStop(.55, color); grad.addColorStop(1, shade(color, -.7));
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(x0 + nx * r0, y0 + ny * r0); g.lineTo(x1 + nx * r1, y1 + ny * r1);
      g.lineTo(x1 - nx * r1, y1 - ny * r1); g.lineTo(x0 - nx * r0, y0 - ny * r0);
      g.fill();
    }
    function newPipe() {
      for (let tries = 0; tries < 60; tries++) {
        const p = [0, 0, 0].map(() => Math.floor(rand(0, N)));
        if (!free(...p)) continue;
        take(...p);
        const color = COLORS[Math.floor(rand(0, COLORS.length))];
        ball(p, color);
        return { p, dir: DIRS[Math.floor(rand(0, 6))], color, prog: 0, dead: false };
      }
      return null;
    }
    function reset() {
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      used = new Set(); filled = 0; fade = 0;
      pipes = [newPipe(), newPipe()].filter(Boolean);
    }
    reset();
    return dt => {
      if (fade) { // wipe the screen once it's full of plumbing
        g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, 0, W, H);
        if ((fade -= dt) <= 0) reset();
        return;
      }
      for (const pipe of pipes) {
        if (pipe.dead) continue;
        if (pipe.prog === 0) { // pick where this segment goes
          let d = pipe.dir;
          const opts = DIRS.filter(o => free(pipe.p[0] + o[0], pipe.p[1] + o[1], pipe.p[2] + o[2]));
          if (!opts.length) { pipe.dead = true; continue; }
          const straight = opts.includes(d);
          if (!straight || Math.random() < .22) {
            d = opts[Math.floor(rand(0, opts.length))];
            if (d !== pipe.dir) ball(pipe.p, pipe.color);
          }
          pipe.dir = d;
          take(pipe.p[0] + d[0], pipe.p[1] + d[1], pipe.p[2] + d[2]);
          filled++;
        }
        // grow the current segment a few steps per frame
        const from = pipe.prog, to = Math.min(1, pipe.prog + dt * 5);
        const at = k => pipe.p.map((v, i) => v + pipe.dir[i] * k);
        tube(at(from), at(to), pipe.color);
        pipe.prog = to;
        if (to >= 1) { pipe.p = at(1); pipe.prog = 0; }
      }
      for (let i = 0; i < pipes.length; i++) if (pipes[i].dead) pipes[i] = filled < 260 ? newPipe() || pipes[i] : pipes[i];
      if (filled >= 260 || pipes.every(p => p.dead)) fade = 2.5;
    };
  },

  starfield() {
    const g = saverCanvas(), W = innerWidth, H = innerHeight, F = Math.min(W, H) * .6;
    const star = () => ({ x: rand(-1, 1) * W, y: rand(-1, 1) * H, z: rand(.1, 1) * 4, spud: Math.random() < .004 });
    const stars = Array.from({ length: 420 }, star);
    return dt => {
      g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, W, H);
      for (const s of stars) {
        s.z -= dt * 1.1;
        const k = F / (s.z * 600), x = W / 2 + s.x * k, y = H / 2 + s.y * k;
        if (s.z <= .05 || x < -40 || x > W + 40 || y < -40 || y > H + 40) { Object.assign(s, star(), { z: 4 }); continue; }
        const b = Math.min(1, (4 - s.z) / 3);
        if (s.spud) { // it's a potato. it's always been a potato
          g.globalAlpha = b; g.font = `${Math.max(8, 30 / s.z)}px ${EMOJI}`;
          g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🥔', x, y); g.globalAlpha = 1;
          continue;
        }
        const r = Math.max(.6, 2.2 / s.z);
        g.fillStyle = `rgba(255,255,255,${b})`;
        g.fillRect(x - r / 2, y - r / 2, r, r);
      }
    };
  },
};

function startSaver(force) {
  if (!force) {
    if (prefs.screensaver === false || isMobile() || reduced) return;
    if (document.activeElement?.tagName === 'IFRAME' || document.fullscreenElement) { poke(); return; } // someone is playing
  }
  cancelAnimationFrame(saverRaf);
  saver.hidden = false;
  saverAt = performance.now();
  let id = prefs.saver in savers ? prefs.saver : 'potato';
  if (prefs.saver === 'random') { const ids = Object.keys(savers); id = ids[Math.floor(rand(0, ids.length))]; }
  const frame = savers[id]();
  let last = 0;
  const step = t => {
    saverRaf = requestAnimationFrame(step);
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
    frame(dt, t);
  };
  saverRaf = requestAnimationFrame(step);
}
export const previewSaver = () => startSaver(true);

function stopSaver() {
  cancelAnimationFrame(saverRaf);
  saver.hidden = true;
  saver.replaceChildren();
}

export function initIdle() {
  for (const ev of ['pointermove', 'pointerdown', 'keydown', 'wheel']) addEventListener(ev, poke, { passive: true });
  saver.addEventListener('pointerdown', stopSaver);
  poke();
}

// ---------- trash ----------
const junk = [
  { title: 'GoTaterV1.exe', icon: '🥔', msg: 'GoTaterV1.exe has performed an illegal operation and will be mashed.', big: '💥' },
  { title: 'GoTaterV2.exe', icon: '🍟', msg: 'GoTaterV2.exe was deep fried. This cannot be undone.', big: '🔥' },
  { title: 'homework_FINAL_final2.doc', icon: '📄', msg: 'This file is corrupt. Much like the homework.', big: '📄' },
  { title: 'sweet_potato.lnk', icon: '🍠', msg: 'The target of this shortcut is a different vegetable entirely.', big: '🍠' },
  { title: 'eyes.zip', icon: '👀', msg: 'Potatoes have eyes. They have seen everything.', big: '👀' },
];

export function trash(from) {
  const view = h('div', { class: 'explorer' });
  for (const j of junk) {
    const ic = iconEl({ title: j.title, icon: j.icon }, { tile: false });
    const go = () => dialog({ title: j.title, icon: j.big, text: j.msg, buttons: ['OK', 'Restore'], onButton: b => b === 'Restore' && dialog({ title: 'Trash', icon: '🙅', text: 'No.' }) });
    ic.addEventListener('dblclick', go);
    ic.addEventListener('keydown', e => e.key === 'Enter' && go());
    if (isMobile() || matchMedia('(pointer: coarse)').matches) ic.addEventListener('click', go);
    view.append(ic);
  }
  return wm.open({
    id: 'trash', title: 'Trash', icon: '🗑️', body: view, w: 520, h: 340, from,
    menu: [{ label: 'Empty Trash', action: () => dialog({ title: 'Empty Trash', icon: '🗑️', text: 'The trash refuses to be emptied. It has grown attached.' }) }],
    status: `${junk.length} object(s)`, statusRight: 'Unrecoverable',
  });
}

// ---------- shut down ----------
export function shutdown() {
  dialog({
    title: 'Shut Down TaterOS', icon: '⏻', text: 'Are you sure you want to shut down your potato?', buttons: ['Yes', 'No'],
    onButton(b) {
      if (b !== 'Yes') return;
      const s = h('div', { class: 'fullscreen-msg shutdown' }, "It's now safe to turn off your potato.");
      document.body.append(s);
      window.gsap && gsap.from(s, { opacity: 0, duration: 1.2 });
      s.addEventListener('click', () => { sessionSet('booted', false); location.hash = ''; location.reload(); });
    },
  });
}

// ---------- tater panic (konami code) ----------
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let ki = 0;
addEventListener('keydown', e => {
  ki = e.key === KONAMI[ki] ? ki + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (ki < KONAMI.length) return;
  ki = 0;
  const panic = h('div', { class: 'fullscreen-msg bsod' }, h('div', { class: 'inner', html:
    `<div class="tag">TaterOS</div><br>A fatal exception 0xSPUD has occurred at 0028:C0FFEE in VXD MASH(01).<br>
     The current potato will be baked.<br><br>
     *  Press any key to return to TaterOS.<br>
     *  Press CTRL+ALT+DEL to start a vegetable garden.<br><br>
     <center>Press any key to continue <span style="animation:blink 1s steps(2) infinite">_</span></center>` }));
  document.body.append(panic);
  const done = () => { panic.remove(); removeEventListener('keydown', done, true); };
  setTimeout(() => addEventListener('keydown', done, true), 50);
  panic.addEventListener('click', done);
});
