import * as wm from './wm.js';
import { appById, openApp, openAbout, isMobile, appUrl } from './shell.js';
import { prefs } from './store.js';
import { setWallpaper, initIdle } from './fx.js';
import * as desktop from './desktop.js';
import * as taskbar from './taskbar.js';
import { boot } from './boot.js';

const mobileQuery = matchMedia('(max-width: 720px), (pointer: coarse) and (max-width: 1024px)');

function applyPrefs() {
  document.documentElement.dataset.theme = prefs.theme === 'dark' ? 'dark' : 'classic';
  setWallpaper(prefs.wallpaper);
}

function applyMobile() {
  document.body.classList.toggle('mobile', mobileQuery.matches);
  desktop.render();
}

// #open=<id> deep links; the hash follows whichever app window is focused
function openFromHash() {
  const id = new URLSearchParams(location.hash.slice(1)).get('open');
  if (!id) return;
  if (id === 'about') return openAbout();
  const a = appById(id);
  if (a && isMobile()) return location.replace(appUrl(a));
  openApp(id);
}

wm.setFocusListener(w => {
  const id = w?.opts.appId || (w?.id === 'about' ? 'about' : null);
  const hash = id ? '#open=' + id : '';
  if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);
});

applyPrefs();
applyMobile();
mobileQuery.addEventListener('change', applyMobile);
let resizeT;
const relayout = () => { clearTimeout(resizeT); resizeT = setTimeout(() => !isMobile() && !document.fullscreenElement && desktop.render(), 250); };
addEventListener('resize', relayout);
document.addEventListener('fullscreenchange', relayout);
taskbar.init(applyPrefs);
addEventListener('hashchange', openFromHash);

boot().then(() => {
  initIdle();
  openFromHash();
});
