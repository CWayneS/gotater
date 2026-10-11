// localStorage/sessionStorage wrappers that never throw (private windows, blocked storage).
const KEY = 'taterOS.prefs';

const read = (store, key, fallback) => {
  try { const v = window[store].getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
};
const write = (store, key, value) => {
  try { window[store].setItem(key, JSON.stringify(value)); } catch {}
};

export const prefs = Object.assign({ wallpaper: 'spuds', theme: 'classic', folderView: 'icons', screensaver: true }, read('localStorage', KEY, {}));
export const setPref = (k, v) => { prefs[k] = v; write('localStorage', KEY, prefs); };

export const load = (key, fallback) => read('localStorage', 'taterOS.' + key, fallback);
export const save = (key, value) => write('localStorage', 'taterOS.' + key, value);
export const sessionGet = key => read('sessionStorage', 'taterOS.' + key, null);
export const sessionSet = (key, value) => write('sessionStorage', 'taterOS.' + key, value);
