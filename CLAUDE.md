# GoTater / TaterOS

A silly project made for fun. It's a pretend retro desktop OS (TaterOS) full of
small single-page apps: games, toys, things to learn, and a few tools that are
genuinely useful (recipe and menu layout, woodworking calculators, git guides).
Nobody is shipping a product here. The point is enjoying the build, so lean into
the whimsy: potato puns, Win95/98 nostalgia, fake system dialogs, jokes in empty
states ("This folder is empty. Like a potato skin."). Keep the useful apps
actually useful, and keep the fun apps fun.

Live at https://gotater.pages.dev (Cloudflare Pages, deploys from `main`); source
at github.com/CWayneS/gotater.

## Layout

- `index.html` + `os/` — the TaterOS shell (vanilla ES modules, GSAP from cdnjs).
  - `main.js` boot + `#open=<id>` deep links, `wm.js` window manager (apps load in
    iframes), `shell.js` folders/Run…/about.txt/dialogs, `desktop.js`, `taskbar.js`,
    `fx.js` wallpapers + screensavers + easter eggs, `files.js` the My Potato
    file browser (fake joke files plus a Source Code folder of real files; add new
    `os/` files to its `OS_FILES` list), `store.js` safe localStorage
    (`taterOS.*` keys), `os.css`.
  - On mobile the shell skips windows and navigates straight to the app URL.
- `apps.js` — the app manifest. The header comment documents every field.
- `apps/<id>/index.html` — one self-contained app per folder (HTML, CSS and JS
  inline, no build step). Apps don't talk to the shell; they just run in an iframe
  and must also work standalone in their own tab and on phones.
- `_redirects` — Cloudflare 301s from the old flat URLs (e.g. `/Swindler.html`).
  Only needs touching if an app's id changes.

## Adding an app

1. Create `apps/<id>/index.html`.
2. Add an entry to `apps.js` in its category section (games | learn | tools | toys)
   with today's date in `added` — the newest 3 show in the "New!" folder.

## App conventions

- Each app has its own look; many lean retro (Pixelify Sans / VT323, bevelled
  Win95 chrome, 7-segment LEDs), others have their own style (Swindler, Signull).
- Fonts from Google Fonts; libraries from a CDN with a pinned version
  (three.js r128 from cdnjs, Tailwind CDN in a few older apps). No npm, no bundler.
- Persist with localStorage under an app-specific prefix, wrapped in try/catch.
- Support mouse, keyboard and touch; size to the window you're given.

## Running and committing

- Serve locally: `python3 -m http.server 8000` from the repo root, then open
  http://localhost:8000 (apps also load directly at `/apps/<id>/`).
- Commit messages are short, lowercase, imperative: `add Typo Kart typing game`,
  `fix start menu submenus being clipped after open animation`.
- Untracked on purpose (gitignored): `--GOTATER NOTES--` (the owner's idea list),
  the Luau Lab guide .docx, `LICENSE`, `.directory`.
