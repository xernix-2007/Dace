# DACE — Daily Adaptive Coding Environment

DACE is the SDE/DSA practice app inside the DayFlow-AI repository.

## Features

- Daily adaptive set: 1 Easy + 2 Medium + 2 Hard by default
- Mixed topics instead of a fixed roadmap
- Solved / revision / couldn't solve states
- Per-problem focus timer
- Attempt and hint tracking
- Topic and difficulty analytics
- Company focus
- Interview mode
- Streak and weekly progress
- Local-first progress storage
- JSON export/import backup
- Responsive dark technical UI with icons and motion
- Direct links to original LeetCode problems

## Run locally

From the repository root:

```bash
cd sde
npm install
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, if npm.ps1 is blocked by Execution Policy:

```powershell
npm.cmd install
npm.cmd run dev
```

## Production build

```bash
npm run build
npm run start
```

## Deploy

The `sde` folder is a standalone Next.js app. On Vercel, import the GitHub repository and set **Root Directory** to `sde`.

## Data

The current version stores user progress in browser localStorage. This is local-first while the product is being built.

The next data-layer upgrade is Supabase Auth + Postgres so progress can sync across devices. The problem bank is currently a curated starter dataset; the production version should import permitted company-wise/public problem metadata into a proper dataset.

## Product direction

DACE is intentionally not a 55-day roadmap. It is a continuous practice engine:

`history -> performance signals -> daily selection -> solve -> measure -> revise -> next selection`

The long-term goal is an adaptive interview-preparation system rather than a static question list.
