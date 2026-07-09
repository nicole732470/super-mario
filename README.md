# Sprout

A tiny always-on-top desktop widget for tracking job-search outreach. Mario and Luigi walk toward the flag as you log progress — tap to +1, drag anywhere to move the window.

| Track | Metric | Period | Default goal |
|-------|--------|--------|--------------|
| **CONNECT** | LinkedIn connects | Weekly | 100 |
| **APPLY** | Job applications | Daily | 50 |

## Features

- **Mini side-scroller UI** — each track is a short stage with a hero, ground, coin trail, and goal flag
- **Satisfying feedback** — jump animation, retro sounds, combo text, and milestone pops
- **Smart coach** — optional nudges when you're behind pace or on a streak
- **Local-first data** — counts live in `data/progress.json`
- **GitHub sync** — `⌘⇧S` commits and pushes progress + trend charts to `data/STATS.md`

## Trends on GitHub

Open **[data/STATS.md](data/STATS.md)** on the repo for live charts:

- **APPLY** — daily line chart (resets at midnight)
- **CONNECT** — daily adds + weekly bar totals (resets every Monday)

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘⇧C` | +1 connect |
| `⌘⇧A` | +1 application |
| `⌘⇧S` | Sync stats to GitHub |
| `⌘⇧Q` | Quit Sprout |
| Click / tap | +1 on the tapped track |
| Right-click | Quit menu |
| Drag | Move the widget |

## Getting started

```bash
npm install
npm start
```

## Mac app (double-click to launch)

Build a real `.app` with Dock icon:

```bash
npm install
npm run install:app
```

This installs **Sprout** to `/Applications`. Then open it from Launchpad, Spotlight, or double-click in Applications.

Rebuild after code changes:

```bash
npm run install:app
```

Dev mode still works with `npm start`. The packaged app reads/writes data in this repo (`data/`) so GitHub sync keeps working.

Optional: set a custom repo path for sync/data:

```bash
export SPROUT_REPO=/path/to/sprout
```

## Configuration

Edit goals in `data/progress.json`:

```json
{
  "goals": {
    "connectsWeekly": 100,
    "applicationsDaily": 50
  }
}
```

## Stack

Electron + vanilla HTML/CSS/JS. Sprites are cropped from classic Mario tile sheets for a retro look; the sky and HUD use a softer modern palette.

## License

Personal project — use and fork freely.
