// BIOS text, then a splash with a scrambling logo. Runs once per session; any key/click skips.
import { sessionGet, sessionSet } from './store.js';
import { apps } from './shell.js';

const LINES = [
  'TaterBIOS (C) 1995 Spud Megatrends Inc.',
  'Main Processor : Russet 486 @ 66 MHz',
  'Memory Test    : 640K OK ... that ought to be enough',
  '',
  'Detecting starch controller ......... <span class="ok">OK</span>',
  'Detecting eyes ...................... <span class="ok">8 found</span>',
  'Peeling cache ....................... <span class="ok">OK</span>',
  `Mounting C:\\TATER ................... <span class="ok">${apps.length} programs</span>`,
  'Loading MASH.SYS',
  'Loading GRAVY.DRV',
  '',
  'Starting TaterOS...',
];

const scramble = (el, text, dur = 900) => new Promise(res => {
  const glyphs = '▓▒░#@%&$01<>/\\';
  const start = performance.now();
  const step = t => {
    const k = Math.min(1, (t - start) / dur);
    const n = Math.floor(text.length * k);
    el.textContent = text.slice(0, n) + [...text.slice(n)].map(c => c === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0]).join('');
    k < 1 ? requestAnimationFrame(step) : res();
  };
  requestAnimationFrame(step);
});

export function boot() {
  const el = document.getElementById('boot');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sessionGet('booted') || reduced || !window.gsap) return Promise.resolve();
  sessionSet('booted', true);

  return new Promise(resolve => {
    el.hidden = false;
    const bios = document.createElement('div');
    bios.className = 'bios';
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.innerHTML = '<div class="spud">🥔</div><div class="logo"></div><div class="bar"><i></i></div>';
    const skip = document.createElement('div');
    skip.className = 'skip';
    skip.textContent = 'press any key to skip';
    el.append(bios, splash, skip);

    const tl = gsap.timeline({ onComplete: finish });
    LINES.forEach((line, i) => tl.call(() => { bios.innerHTML += line + '\n'; }, null, i * 0.11 + (i > 3 ? 0.25 : 0)));
    tl.to(splash, { opacity: 1, duration: 0.4 }, '+=0.35');
    tl.call(() => scramble(splash.querySelector('.logo'), 'TaterOS').then(() => { splash.querySelector('.logo').innerHTML = 'TaterOS<small>95</small>'; }));
    tl.from(splash.querySelector('.spud'), { y: 60, rotate: -200, scale: 0, duration: 0.8, ease: 'back.out(2)' }, '<');
    tl.to(splash.querySelector('.bar i'), { width: '100%', duration: 1.4, ease: 'steps(14)' }, '<0.2');
    tl.to(el, { opacity: 0, duration: 0.35 }, '+=0.2');

    function finish() {
      tl.kill();
      removeEventListener('keydown', finish);
      el.hidden = true;
      el.replaceChildren();
      el.style.opacity = '';
      resolve();
    }
    addEventListener('keydown', finish);
    el.addEventListener('click', finish);
  });
}
