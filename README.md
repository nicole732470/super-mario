# Super Mario

Desktop habit widget: Mario/Luigi walk toward the flag. Tap to **jump up and bonk the `?` block** — each bump is +1. Drag anywhere to move the window.

| Track | Metric | Period | Default goal |
|-------|--------|--------|--------------|
| **CONNECT** | LinkedIn connects | Weekly (Mon–Sun) | 100 |
| **APPLY** | Job applications | Daily | 50 |

## Features

- Classic Mario bump: hop into a floating `?` block — coin sound + trail progress (scales to 100)
- CONNECT resets every Monday · APPLY resets every midnight
- Data in `data/progress.json`, auto-syncs to GitHub
- Trend charts in **[data/STATS.md](data/STATS.md)**

## Try it (no Mac app install)

Open the browser demo — same bump feel, no Electron needed:

→ **[demo/index.html](demo/index.html)** (clone the repo, open that file in Safari/Chrome)

Or after clone:

```bash
open demo/index.html
```

## Run the desktop widget (Mac)

**Easiest (no Terminal after install):**

```bash
npm run install:app
```

Installs `/Applications/Super Mario.app`, opens it, and sets **Open at Login**.
After that: Spotlight (`⌘Space` → Super Mario) or Launchpad.

**Dev / one-off:**

```bash
npm install
npm start
```

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘⇧C` | +1 connect |
| `⌘⇧A` | +1 application |
| `⌘⇧S` | Sync to GitHub |
| `⌘⇧R` | Reset counts to 0 |
| `⌘⇧Q` | Quit |
| Click / tap | bump `?` block on that track |
| Right-click | Menu |
| Drag | Move widget |

## Goals

Edit `data/progress.json`:

```json
{
  "goals": {
    "connectsWeekly": 100,
    "applicationsDaily": 50
  }
}
```

Personal project — for local use only.
