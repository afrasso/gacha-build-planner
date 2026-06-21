# Gacha Build Planner — Agent Guide

Web app for planning and evaluating gacha game character builds. Supports **Genshin Impact** and **Honkai: Star Rail** with shared UI and calculation logic, game-specific types/stats, and per-game static data.

---

## Tech stack

- **Next.js 14** (App Router), **React 18**, **TypeScript** (strict)
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Vitest** + **Testing Library** for unit tests
- **IndexedDB** for client-side build/artifact persistence
- **YAML** static game data in `data/`
- Deployed on **Vercel**; auth via external API (`API_URL` env var)

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (Next + perfectionist import sorting) |
| `npm test` | depcheck + lint + vitest |
| `npm run retrieve-assets` | Regenerate game data/icons via `assetretriever/` |

---

## Directory map

```
app/                    Next.js routes
  genshin/              Genshin-specific pages + layout (loads YAML data)
  starrail/             Star Rail-specific pages + layout
  auth/                 OAuth callback pages (Discord, Google, Facebook)
  actions/              Server actions (auth redirects)

components/             React UI (BuildCard, ArtifactEditor, Header, ui/)
contexts/               React context providers
  DataContext/          Game data access (IDataContext + per-game DataProviders)
  StorageContext.tsx    IndexedDB CRUD for builds/artifacts
  AuthContext.tsx       Auth state + API fetch helper

types/                  Domain models and JSON schemas
  genshin/              Genshin Build, Character, Weapon, stats
  starrail/             Star Rail equivalents (relics, light cones)
  build.ts, artifact.ts Shared interfaces (IBuild, BuildData, IArtifact)

calculation/            Pure logic — no React
  buildmetrics/         Build satisfaction scoring
  artifactmetrics/      Artifact rating, top-builds, set bonus factors
  simulation/           Artifact roll simulation

dataimport/             Import/export (GOOD format for Genshin, HSR Scanner for Star Rail)
data/                    Static YAML (characters, weapons/light cones, artifact/relic sets)
assetretriever/         CLI to scrape/extract game data and icons into data/ + public/
__tests__/              Vitest tests mirroring calculation/ structure
```

Path alias: `@/*` maps to repo root.

---

## Architecture

### Multi-game pattern

Genshin and Star Rail share structure but have separate implementations:

1. **Routes**: `app/genshin/` and `app/starrail/` each have their own `layout.tsx` that loads YAML and wraps children in `StorageProvider` + game-specific `DataProvider`.
2. **Types**: Shared interfaces in `types/`; game classes in `types/genshin/` and `types/starrail/` (e.g. `Build` with game-specific `calculateStats`).
3. **DataContext**: `IDataContext` defines the contract; `contexts/DataContext/genshin/DataProvider.tsx` and `.../starrail/DataProvider.tsx` wire game-specific lookups and `constructBuild`.
4. **Storage**: `StorageProvider` takes a `game` prop to namespace IndexedDB.

When adding a feature that applies to both games, prefer extending shared interfaces and mirroring changes in both game folders. When behavior differs (stat formulas, terminology), keep logic in the game-specific type/calculation modules.

### Data flow

```
YAML (data/) → layout loads at build/request time
User data → IndexedDB via StorageContext
Game lookups → IDataContext (characters, weapons, artifact sets, stat defs)
Build evaluation → IBuild.calculateStats + calculation/buildmetrics
```

### Calculation layer

- Lives in `calculation/` — keep it **framework-agnostic** (no `"use client"`, no React imports).
- Takes `IDataContext`, `IBuild`, and `IArtifact` as inputs.
- **Build satisfaction**: `calculateBuildSatisfaction` in `calculation/buildmetrics/satisfaction/` combines main-stat match, set bonus match, and target stat satisfaction.
- **Artifact metrics**: rating, top builds, set bonus probability — used by artifact manager UI.
- **Simulation**: models artifact rolling for odds/probability features.

Add tests in `__tests__/calculation/` when changing calculation logic.

### Types and validation

- `BuildData` / `ArtifactData` are serializable plain shapes; `IBuild` / `IArtifact` are class instances with methods.
- JSON schemas (AJV) live alongside types — used for import validation (`dataimport/`).
- Brand fields like `_typeBrand: "BuildData"` help distinguish serialized vs runtime types.

### UI conventions

- shadcn/ui components in `components/ui/`; custom shared widgets in `components/ui/custom/`.
- Game-agnostic artifact UI under `components/artifacts/`; receives game context via hooks (`useDataContext`, `useStorageContext`).
- `"use client"` only where needed (contexts, interactive components).

---

## Coding conventions

- **Imports**: sorted by `eslint-plugin-perfectionist`; internal `@/` imports grouped separately.
- **Optional properties**: prefer `prop?: T` over `prop: T | undefined` on object types.
- **Unused vars**: prefix with `_` to ignore (e.g. `_unused`).
- **File naming**: lowercase, no separators in most files (`buildgetartifactset.ts` style in builders).
- **Minimize scope**: match existing patterns; don't refactor unrelated code in the same change.
- **No secrets in repo**: env vars like `API_URL` are required at runtime; `.env*` is gitignored.

---

## Testing

- Vitest with jsdom; setup in `setupTests.ts`.
- `npm test` runs depcheck, lint, then vitest — fix lint before relying on test output.
- Calculation tests use comparator helpers in `__tests__/comparatormethods.ts` for floating-point stats.

---

## Common tasks

| Task | Where to look |
|------|---------------|
| Add a character stat formula | `types/{game}/stats/` |
| Change build satisfaction logic | `calculation/buildmetrics/satisfaction/` |
| Add import format support | `dataimport/` |
| Refresh game database | `assetretriever/{game}/`, then `npm run retrieve-assets` |
| Add a page | `app/{game}/` following existing route patterns |
| Add UI component | `components/`; use existing shadcn primitives |

---

## Out of scope for agents unless asked

- Don't commit, push, or open PRs unless explicitly requested.
- Don't modify `data/*.yaml` or scraped assets unless the task involves game data updates.
- Don't add tests for trivial changes unless they cover meaningful calculation or import behavior.
