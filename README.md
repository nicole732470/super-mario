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
- **GitHub sync** — `⌘⇧S` commits and pushes `progress.json`, `stats.json`, and `chart.svg`

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘⇧C` | +1 connect |
| `⌘⇧A` | +1 application |
| `⌘⇧S` | Sync stats to GitHub |
| Click / tap | +1 on the tapped track |
| Drag | Move the widget |

## Getting started

```bash
npm install
npm start
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
