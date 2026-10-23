// Window manager: open/focus/drag/resize/min/max/fullscreen/close + taskbar buttons.
const layer = document.getElementById('windows');
const tasks = document.getElementById('tasks');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wins = new Map();
let z = 10;
let cascade = 0;
let onFocusChange = () => {};

export const setFocusListener = fn => { onFocusChange = fn; };
export const get = id => wins.get(id);
export const all = () => [...wins.values()];
export const active = () => all().find(w => w.el.classList.contains('active'));

const desk = () => layer.getBoundingClientRect();
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

/**
 * open({ id, title, icon, w, h, max, from, anchor, kind, url, body, menu, status, resizable })
 *  - url: loads an iframe (app window)
 *  - body: an element to place in the window body
 *  - menu: [{ label, action }] items for the menubar ('|' = spacer)
 *  - from: a DOMRect to zoom open from
 *  - anchor: a DOMRect to open just above, right-aligned to it
 */
export function open(o) {
  const existing = wins.get(o.id);
  if (existing) { restore(existing); focus(existing); return existing; }

  const w = { id: o.id, opts: o, el: el('section', 'win bevel ' + (o.kind || '')) };
  w.el.setAttribute('role', 'dialog');
  w.el.setAttribute('aria-label', o.title);
  w.el.tabIndex = -1;

  const bar = el('header', 'titlebar');
  bar.append(el('span', 't-icon', o.icon || ''), el('span', 't-text', o.title));
  const ctl = (label, title, fn, extra = '') => {
    const b = el('button', 'ctl bevel ' + extra, label);
    b.title = title; b.setAttribute('aria-label', title);
    b.addEventListener('pointerdown', e => e.stopPropagation());
    b.addEventListener('click', e => { e.stopPropagation(); fn(); });
    bar.append(b);
    return b;
  };
  const resizable = o.resizable !== false;
  if (o.url && document.fullscreenEnabled) ctl('⤢', 'Fullscreen', () => fullscreen(w));
  if (o.kind !== 'dialog') ctl('_', 'Minimize', () => minimize(w));
  if (resizable) w.maxBtn = ctl('▢', 'Maximize', () => toggleMax(w));
  ctl('✕', 'Close', () => close(w.id), 'close');
  w.el.append(bar);

  if (o.menu) {
    const mb = el('div', 'menubar');
    for (const m of o.menu) {
      if (m === '|') { mb.append(el('span', 'spacer')); continue; }
      if (m.addr) { mb.append(el('span', 'addr', m.addr)); continue; }
      const b = el('button', '', m.label);
      b.addEventListener('click', () => m.action(w));
      mb.append(b);
    }
    w.el.append(mb);
  }

  const body = el('div', 'win-body bevel-in');
  if (o.url) {
    const frame = el('iframe');
    frame.src = o.url;
    frame.title = o.title;
    frame.allow = 'autoplay; fullscreen; microphone; camera; clipboard-read; clipboard-write; pointer-lock; gamepad';
    frame.setAttribute('allowfullscreen', '');
    const loading = el('div', 'loading', 'loading ' + o.title + '<span>_</span>');
    frame.addEventListener('load', () => {
      loading.remove();
      try { // keep the title bar in sync with the app's own <title>
        const t = frame.contentDocument?.title;
        if (t && o.syncTitle) bar.querySelector('.t-text').textContent = t;
      } catch {}
    });
    body.append(frame, loading);
    w.frame = frame;
  } else if (o.body) {
    body.append(o.body);
  }
  w.el.append(body);

  if (o.status) {
    w.status = el('footer', 'status');
    w.status.append(el('div', 'bevel-in', o.status), el('div', 'bevel-in', o.statusRight || ''));
    w.el.append(w.status);
  }

  if (resizable) for (const d of ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']) {
    const h = el('div', 'rz ' + d);
    h.addEventListener('pointerdown', e => startResize(w, d, e));
    w.el.append(h);
  }

  place(w, o);
  layer.append(w.el);
  wins.set(w.id, w);

  bar.addEventListener('pointerdown', e => startMove(w, e));
  bar.addEventListener('dblclick', () => resizable && toggleMax(w));
  w.el.addEventListener('pointerdown', () => focus(w), true);

  if (o.kind !== 'dialog') addTask(w);
  if (o.max && resizable) setMax(w, true);
  focus(w);
  animateIn(w, o.from);
  return w;
}

function place(w, o) {
  const d = desk();
  const ww = Math.min(o.w || 760, d.width - 16);
  const hh = Math.min(o.h || 540, d.height - 16);
  let x, y;
  if (o.center) {
    x = (d.width - ww) / 2; y = (d.height - hh) / 2.4;
  } else if (o.anchor) {
    // sit just above a rect (e.g. the tray clock), right edges lined up
    x = clamp(o.anchor.right - d.left - ww, 8, d.width - ww - 8);
    y = clamp(o.anchor.top - d.top - hh - 4, 8, d.height - hh - 8);
  } else {
    const step = 28;
    x = 120 + (cascade % 8) * step;
    y = 24 + (cascade % 8) * step;
    cascade++;
    if (x + ww > d.width) x = Math.max(8, d.width - ww - 8);
    if (y + hh > d.height) y = Math.max(8, d.height - hh - 8);
  }
  Object.assign(w.el.style, { left: x + 'px', top: y + 'px', width: ww + 'px', height: hh + 'px' });
}

function animateIn(w, from) {
  if (reduced || !window.gsap) return;
  const r = w.el.getBoundingClientRect();
  let vars = { opacity: 0, scale: 0.85 };
  if (from) {
    vars = {
      opacity: 0,
      x: from.left + from.width / 2 - (r.left + r.width / 2),
      y: from.top + from.height / 2 - (r.top + r.height / 2),
      scale: 0.15,
    };
  }
  gsap.fromTo(w.el, vars, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.3)', clearProps: 'transform,opacity' });
}

export function focus(w) {
  if (typeof w === 'string') w = wins.get(w);
  if (!w) return;
  const wasActive = w.el.classList.contains('active');
  for (const o of wins.values()) {
    const on = o === w;
    o.el.classList.toggle('active', on);
    o.task?.classList.toggle('pressed', on && !o.el.classList.contains('min'));
  }
  if (!wasActive) w.el.style.zIndex = ++z;
  if (!w.el.contains(document.activeElement)) {
    // give keyboard focus to the app so games get key input
    (w.frame || w.el).focus({ preventScroll: true });
  }
  onFocusChange(w);
}

function blurAll() {
  for (const o of wins.values()) {
    o.el.classList.remove('active');
    o.task?.classList.remove('pressed');
  }
  onFocusChange(null);
}

export function close(id) {
  const w = wins.get(id);
  if (!w) return;
  if (document.fullscreenElement === w.el) document.exitFullscreen().catch(() => {});
  wins.delete(id);
  w.task?.remove();
  const done = () => {
    w.el.remove();
    const next = all().filter(o => !o.el.classList.contains('min')).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
    next ? focus(next) : blurAll();
  };
  if (reduced || !window.gsap) return done();
  if (w.frame) w.frame.style.visibility = 'hidden';
  gsap.to(w.el, { opacity: 0, scale: 0.9, duration: 0.18, ease: 'power2.in', onComplete: done });
}

export function minimize(w) {
  if (w.el.classList.contains('min')) return;
  const finish = () => {
    w.el.classList.add('min');
    gsap?.set(w.el, { clearProps: 'transform,opacity' });
    const next = all().filter(o => o !== w && !o.el.classList.contains('min')).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
    next ? focus(next) : blurAll();
  };
  if (reduced || !window.gsap || !w.task) return finish();
  const r = w.el.getBoundingClientRect(), t = w.task.getBoundingClientRect();
  gsap.to(w.el, {
    x: t.left + t.width / 2 - (r.left + r.width / 2), y: t.top - (r.top + r.height / 2),
    scale: 0.1, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: finish,
  });
}

export function restore(w) {
  if (!w.el.classList.contains('min')) return;
  w.el.classList.remove('min');
  if (reduced || !window.gsap || !w.task) return;
  const r = w.el.getBoundingClientRect(), t = w.task.getBoundingClientRect();
  gsap.fromTo(w.el,
    { x: t.left + t.width / 2 - (r.left + r.width / 2), y: t.top - (r.top + r.height / 2), scale: 0.1, opacity: 0 },
    { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });
}

function setMax(w, on) {
  w.el.classList.toggle('max', on);
  if (w.maxBtn) {
    w.maxBtn.textContent = on ? '❐' : '▢';
    w.maxBtn.title = on ? 'Restore' : 'Maximize';
    w.maxBtn.setAttribute('aria-label', w.maxBtn.title);
  }
}
export function toggleMax(w) { setMax(w, !w.el.classList.contains('max')); }

export function fullscreen(w) {
  if (document.fullscreenElement) return document.exitFullscreen().catch(() => {});
  focus(w);
  w.el.requestFullscreen?.().then(() => w.frame?.focus()).catch(() => setMax(w, true));
}

function addTask(w) {
  const b = el('button', 'bevel');
  b.append(el('span', '', w.opts.icon || ''), el('span', '', w.opts.title));
  b.title = w.opts.title;
  b.addEventListener('click', () => {
    if (w.el.classList.contains('min')) { restore(w); focus(w); }
    else if (w.el.classList.contains('active')) minimize(w);
    else focus(w);
  });
  tasks.append(b);
  w.task = b;
}

// ---------- drag / resize ----------
function track(e, move, end) {
  e.preventDefault();
  document.body.classList.add('dragging');
  const target = e.currentTarget;
  target.setPointerCapture?.(e.pointerId);
  const mv = ev => move(ev);
  const up = ev => {
    document.body.classList.remove('dragging');
    target.removeEventListener('pointermove', mv);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', up);
    end?.(ev);
  };
  target.addEventListener('pointermove', mv);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);
}

function startMove(w, e) {
  if (e.button !== 0 || document.body.classList.contains('mobile')) return;
  const d = desk();
  let r = w.el.getBoundingClientRect();
  let ox = e.clientX - r.left, oy = e.clientY - r.top;
  let unmaxOnMove = w.el.classList.contains('max');
  track(e, ev => {
    if (unmaxOnMove) {
      // pull a maximized window off the top edge, keeping the grab point proportional
      if (Math.abs(ev.clientY - e.clientY) < 6 && Math.abs(ev.clientX - e.clientX) < 6) return;
      const ratio = ox / r.width;
      setMax(w, false);
      r = w.el.getBoundingClientRect();
      ox = r.width * ratio;
      unmaxOnMove = false;
    }
    let x = ev.clientX - d.left - ox;
    let y = ev.clientY - d.top - oy;
    x = Math.min(Math.max(x, -r.width + 80), d.width - 80);
    y = Math.min(Math.max(y, 0), d.height - 30);
    w.el.style.left = x + 'px';
    w.el.style.top = y + 'px';
  }, ev => {
    // drag to the top edge to maximize
    if (w.opts.resizable !== false && ev.clientY - d.top <= 2) setMax(w, true);
  });
}

function startResize(w, dir, e) {
  if (e.button !== 0) return;
  e.stopPropagation();
  focus(w);
  const d = desk();
  const r = w.el.getBoundingClientRect();
  const start = { x: e.clientX, y: e.clientY, l: r.left - d.left, t: r.top - d.top, w: r.width, h: r.height };
  const minW = 240, minH = 140;
  track(e, ev => {
    const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
    let { l, t, w: ww, h } = start;
    if (dir.includes('e')) ww = Math.max(minW, start.w + dx);
    if (dir.includes('s')) h = Math.max(minH, start.h + dy);
    if (dir.includes('w')) { ww = Math.max(minW, start.w - dx); l = start.l + start.w - ww; }
    if (dir.includes('n')) { h = Math.max(minH, start.h - dy); t = Math.max(0, start.t + start.h - h); h = start.t + start.h - t; }
    Object.assign(w.el.style, { left: l + 'px', top: t + 'px', width: ww + 'px', height: h + 'px' });
  });
}

// clicking into an iframe doesn't bubble to us, but the parent window blurs:
// use that to bring the clicked window to the front.
window.addEventListener('blur', () => {
  setTimeout(() => {
    const f = document.activeElement;
    if (f?.tagName === 'IFRAME') {
      const w = all().find(o => o.frame === f);
      if (w && !w.el.classList.contains('active')) focus(w);
    }
  });
});
