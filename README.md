# Super Mario

Personal desktop widget for tracking job-search outreach. Mario and Luigi walk toward the flag as you log progress — tap to +1, drag anywhere to move the window.

| Track | Metric | Period | Default goal |
|-------|--------|--------|--------------|
| **CONNECT** | LinkedIn connects | Weekly (Mon–Sun) | 100 |
| **APPLY** | Job applications | Daily | 50 |

## Features

- Mini side-scroller UI with jump sounds and goal fanfare
- CONNECT resets every Monday · APPLY resets every midnight
- Data in `data/progress.json`, auto-syncs to GitHub
- Trend charts in **[data/STATS.md](data/STATS.md)**

## Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘⇧C` | +1 connect |
| `⌘⇧A` | +1 application |
| `⌘⇧S` | Sync to GitHub |
| `⌘⇧R` | Reset counts to 0 |
| `⌘⇧Q` | Quit |
| Click / tap | +1 on tapped track |
| Right-click | Menu |
| Drag | Move widget |

## Run

**Easiest (no Terminal):**

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
