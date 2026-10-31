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
| Zork | | Signull | |

Every app also works on its own at `/apps/<id>/`, which is handy on phones.
TaterOS sends phones there automatically.

Click the time in the taskbar to open the **Potato Clock**, a digital clock
wired to two potatoes, with a calendar and a voltmeter. The potatoes slowly lose
their freshness the longer you leave it open.

## System requirements

| | Minimum | Recommended |
|---|---|---|
| Processor | 1 potato | 2 potatoes, wired in series |
| Memory | 640K (should be enough for anybody) | 1 sack |
| Display | 640×480, 16 colors | Any screen you can see a potato on |
| Storage | 0 bytes free (it lives in your browser) | A cool, dark cupboard |
| Input | Mouse, keyboard or finger | A steady hand for Tatersweeper |
| Browser | Anything from this decade | One with localStorage, so your stuff stays put |
| OS | TaterOS | TaterOS |

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
