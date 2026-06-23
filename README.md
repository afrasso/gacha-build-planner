# Gacha Build Planner

A web app for planning and evaluating character builds in **Genshin Impact** and **Honkai: Star Rail**.

Track artifacts, compare builds, score how well pieces fit your goals, and import/export your inventory. Most of your data stays in the browser; sign in if you want to sync builds to the cloud.

Live app: [gacha-build-planner.vercel.app](https://gacha-build-planner.vercel.app)

Backend API (auth + cloud sync): [gacha-build-planner-api](https://github.com/afrasso/gacha-build-planner-api)

---

## What you can do

- **Plan builds** — Pick a character, weapon/light cone, artifact/relic sets, and target stats.
- **Manage artifacts** — Add, edit, sort, and rate pieces in your local collection.
- **Evaluate fit** — See satisfaction scores, top builds, and artifact metrics for a piece.
- **Import & export** — Genshin GOOD format and Star Rail HSR Scanner format.
- **Sync (optional)** — Log in with Discord, Google, or Facebook to save one plan per account in the cloud.

Build calculations run entirely in the browser. The API is only needed for login and cloud storage.

---

## Local development

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/afrasso/gacha-build-planner.git
cd gacha-build-planner
npm install
```

Create `.env.local` in the project root:

```env
API_URL=http://localhost:4000
```

`API_URL` must point at a running [gacha-build-planner-api](https://github.com/afrasso/gacha-build-planner-api) instance if you want login or cloud sync locally. The app still works offline for build planning without it.

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run depcheck, lint, and unit tests |
| `npm run retrieve-assets` | Regenerate game data and icons (maintainers) |

---

## Project layout (short tour)

| Path | What's there |
|------|----------------|
| `app/genshin/`, `app/starrail/` | Game-specific pages |
| `components/` | UI (builds, artifacts, settings, etc.) |
| `calculation/` | Build and artifact scoring logic |
| `data/` | Static game data (characters, sets, stats) |
| `dataimport/` | Import/export formats |
| `contexts/` | React providers (storage, auth, settings) |

Game data lives in YAML under `data/`. User builds and artifacts are stored in IndexedDB in the browser.

---

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/afrasso/gacha-build-planner/issues).

For agent-oriented architecture notes, see [AGENTS.md](./AGENTS.md).

---

## License

UNLICENSED — private project by Anthony Frasso.
