# 🥔 GoTater

Some simple apps. Have fun.

**Play it at [gotater.pages.dev](https://gotater.pages.dev)**

GoTater is **TaterOS**, a pretend retro desktop that runs in your browser. It has a
Start menu, draggable windows, a taskbar clock, screensavers, and folders full
of little single-page apps. Most of them are just for fun. A few turned out to be
genuinely useful.

## What's inside

| 🕹️ Games | 📚 Learn | 🧰 Tools | 🫧 Toys |
|---|---|---|---|
| Go Tater | Basic Math Vocab | Recipe Studio | Lagoon |
| Swindler | Luau Lab | Grit Paint | Stillwater |
| Meteor Defender | Block to Luau | The Workshop | Disk Defragmenter |
| Glyphcrawl | Git Playground | Voidwave | |
| Out Driving | GitHub Branching Guide | Crop Studio | |
| Sokoban Studio | | Git Guide | |
| Typo Kart | | MenuCraft | |
| Tatersweeper | | I Was Framed | |
| | | Signull | |

Every app also works on its own at `/apps/<id>/`, which is handy on phones.
TaterOS sends phones there automatically.

## Running it locally

There's no build step and nothing to install. Serve the folder and open it:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Adding an app

1. Make a self-contained page at `apps/<id>/index.html`.
2. Add an entry to `apps.js`. The comment at the top of that file explains each field.

That's it. It shows up in its category folder, in the Start menu, in Run… search,
and in the "New!" folder for a while.

## How it's built

Plain HTML, CSS and JavaScript. The shell is a handful of ES modules in `os/`,
and each app is a single HTML file that loads inside a window (an iframe). It's
hosted on Cloudflare Pages.

---

Built with passion and potatoes. © 2026 GoTater Games
