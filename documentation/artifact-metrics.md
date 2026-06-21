# Artifact metrics

This document describes how the Gacha Build Planner evaluates artifacts against character builds. The same logic applies to **Genshin Impact** (artifacts) and **Honkai: Star Rail** (relics); game-specific details (slot names, main-stat odds, roll values) come from each game's `IDataContext`.

Metrics are computed **per artifact, per build** (keyed by `characterId`), then aggregated for sorting and charts via each metric's `maxValue` (the highest result across all builds for that artifact).

Implementation lives under `calculation/artifactmetrics/` and `calculation/buildmetrics/satisfaction/`.

---

## Build inputs used by metrics

Every metric evaluates an artifact in the context of a **build**, which supplies:

| Build field | Role in metrics |
|-------------|-----------------|
| `desiredOverallStats` | Target character stats (with priority weights for rating). Each entry has a `stat` (key + target value), `priority` (1–3), and `excessUseful` (stored for UI; not used in satisfaction math today). |
| `desiredArtifactMainStats` | Acceptable main stats per slot (e.g. Sands → ATK% or EM). Wrong main stat → rating and satisfaction metrics return **0**. |
| `desiredArtifactSetBonuses` | Required set counts (e.g. 4-piece Deepwood, 2-piece Gilded). Drives set-bonus weighting for off-set pieces. |
| `artifacts` | The artifact currently equipped in each slot on the build. Used as the baseline for **Plus/Minus** and for **Current Artifacts** satisfaction modes. |

---

## Overview of the seven metrics

| Metric | Question it answers | Output range (typical) |
|--------|---------------------|----------------------|
| **RATING** | If I fully level this piece (simulated rolls), how well do its substats match what the build wants? | 0–~10, scaled by set-bonus factor for off-set pieces |
| **PLUS_MINUS** | Compared to the piece already in this slot, how much better or worse is the expected fully-rolled rating? | Can be negative; UI treats display as ≥ 0 |
| **POSITIVE_PLUS_MINUS_ODDS** | What fraction of simulated full rolls beat the equipped piece's rating? | 0–1 (probability), scaled by set-bonus factor |
| **CURRENT_STATS_CURRENT_ARTIFACTS** | With **current** stat targets and **existing** pieces on other slots (rolled forward), how often does equipping this piece satisfy the whole build? | 0–1 (probability) |
| **CURRENT_STATS_RANDOM_ARTIFACTS** | With **current** stat targets and **random** other slots, how often does this piece lead to a satisfied build? | 0–1, with main-stat and set-bonus factors |
| **DESIRED_STATS_CURRENT_ARTIFACTS** | With **desired** stat targets and **existing** other pieces (rolled forward), how often does equipping this piece satisfy the build? | 0–1 |
| **DESIRED_STATS_RANDOM_ARTIFACTS** | With **desired** stat targets and **random** other slots, how often does this piece lead to a satisfied build? | 0–1, with main-stat and set-bonus factors |

The four **satisfaction** metrics share the same core **build satisfaction** check; they differ in (1) whether targets are current calculated stats vs. explicitly desired values, and (2) whether other slots use the build's current artifacts or freshly rolled random ones.

The three **rating** metrics (`RATING`, `PLUS_MINUS`, `POSITIVE_PLUS_MINUS_ODDS`) are always computed together in one Monte Carlo pass.

---

## Monte Carlo simulation

Most metrics use a configurable **`iterations`** count (default **10** in the artifact manager UI). Each iteration:

1. **Rolls the candidate artifact forward** to max level (`rollArtifact`): remaining substat upgrades are simulated using game-accurate roll tables (new lines vs. upgrades to existing lines, weighted by game rules).
2. Optionally rolls other slots (see satisfaction modes below).
3. Scores the outcome and accumulates results; the final metric is the **average** over iterations.

Results are cached on the artifact (`metricsResults[metric].buildResults[characterId]`) and invalidated when the artifact, build, or iteration count changes.

---

## Artifact rating (substat score)

**Source:** `calculation/artifactmetrics/calculateartifactrating.ts`

The **raw rating** of an artifact (before simulation averaging) measures how well its **current substats** align with the build's desired stats.

### Main stat gate

If the build defines required main stats for this slot and the artifact's main stat is not in that list, the rating is **0**.

### Baseline

Otherwise, rating starts at **1** (a valid main stat with no useful substats still scores 1).

### Substat contribution

For each entry in `desiredOverallStats`, the code finds substats whose **overall stat** matches (via `getStatDefinitions()` — e.g. ATK% and Flat ATK both contribute to overall ATK depending on game definitions).

For each matching substat line:

```
substatContribution = priorityWeight × (substatValue / maxSingleRoll)
```

**Priority weights:**

| Priority | Weight |
|----------|--------|
| 1 (low)  | 0.25   |
| 2        | 0.50   |
| 3 (high) | 1.00   |

`maxSingleRoll` is the maximum possible single roll for that substat at the artifact's rarity (from `getPossibleArtifactSubStatRollValues`).

**Total raw rating** = 1 + sum of all substat contributions.

### Theoretical maximum

The UI chart normalizes **RATING** against **10**, reflecting: 1 (baseline) + up to 4 initial substats at max roll + up to 5 further upgrade rolls at max — a practical upper bound for a 5★ piece, not a hard cap in code.

### Artifact tiers

Letter tiers (F through SSS+) map from the **floored integer part** of the rating via `constants/constants.ts` and `getArtifactTier()`.

---

## RATING metric

**Source:** `calculation/artifactmetrics/calculateartifactratingmetrics.ts`

```
RATING = weightedSetBonusFactor × (1/iterations) × Σ simulateFullRoll(artifact).rating
```

For each iteration:

1. `rollArtifact` levels the piece to max with random substat rolls.
2. `calculateArtifactRating` scores the rolled piece.
3. Results are summed and averaged.

**Set-bonus weighting:** Off-set pieces (not in any `desiredArtifactSetBonuses` set) are multiplied by `getWeightedArtifactSetBonusFactor` (see below). On-set pieces use factor **1**.

---

## PLUS_MINUS metric

**Source:** same as RATING

Compares the candidate to the artifact **already equipped** in the same slot:

```
PLUS_MINUS = weightedSetBonusFactor × (1/iterations) × Σ (rolledRating − equippedRating)
```

- `equippedRating` is the cached **RATING** metric for the build's current piece in that slot (computed first if missing).
- If the candidate **is** the equipped piece, plus/minus is **0** by definition.
- Negative values mean the candidate is expected to be worse after full rolls; positive means better.

---

## POSITIVE_PLUS_MINUS_ODDS metric

**Source:** same as RATING

```
POSITIVE_PLUS_MINUS_ODDS = weightedSetBonusFactor × (1/iterations) × count(rolledRating > equippedRating)
```

This is the **probability** (0–1 after weighting) that fully rolling the candidate beats the equipped piece. Again **0** if evaluating the equipped piece itself.

---

## Build satisfaction (used by four metrics)

**Source:** `calculation/buildmetrics/satisfaction/`

An artifact "satisfies" a build in a given simulation when **all** of the following are true:

### 1. Main stats per slot

Every slot listed in `desiredArtifactMainStats` must have an artifact whose main stat is in the allowed list for that slot.

### 2. Set bonuses

For each entry in `desiredArtifactSetBonuses`, at least `bonusCount` equipped pieces must belong to that `setId`. If no set bonuses are configured, this check is skipped (treated as satisfied).

### 3. Target stats

Character stats are computed via `build.calculateStats()` with the simulated artifact set. Each target stat must meet its threshold:

- **DESIRED** strategy: compare against values in `desiredOverallStats`.
- **CURRENT** strategy: compare against the build's **current** calculated stats (same keys as desired stats, but thresholds taken from what the character already reaches with current artifacts).

For each stat: `satisfaction = currentValue >= targetValue`.

**Overall satisfaction** = main stats OK **AND** set bonuses OK **AND** all target stats OK.

---

## Satisfaction-based artifact metrics

**Source:** `calculation/artifactmetrics/calculateartifactbuildsatisfaction.ts`

All four metrics return the fraction of iterations where the build is satisfied after equipping the candidate:

```
metric = (1/iterations) × Σ (setBonusFactor × mainStatsFactor × (overallSatisfaction ? 1 : 0))
```

Early exits return **0** if:

- The artifact fails the [worth evaluating](#worth-evaluating-filter) check.
- Required main stat doesn't match.
- `setBonusFactor` or `mainStatsFactor` is **0** (piece can never contribute to a valid build).

### Artifact set used per iteration

| Metric | Other slots | Candidate slot |
|--------|-------------|----------------|
| `*_CURRENT_ARTIFACTS` | Build's equipped pieces, each `rollArtifact`'d forward | Candidate, rolled forward |
| `*_RANDOM_ARTIFACTS` | Fresh random 5★ pieces (correct set assignment — see below), each rolled forward | Candidate, rolled forward |

For **random artifacts** mode, other slots get `rollNewArtifact` with:

- Main stat drawn from `desiredArtifactMainStats` for that slot (if specified).
- Set ID from a pool derived from `desiredArtifactSetBonuses` (remaining on-set slots after reserving one count for the candidate's set if applicable).
- Default rarity **5**.

### Target stats strategy

| Metric prefix | `TargetStatsStrategy` |
|---------------|------------------------|
| `CURRENT_STATS_*` | CURRENT |
| `DESIRED_STATS_*` | DESIRED |

### Factors for random-artifacts modes

When other slots are **random** (not taken from the build), two probability factors adjust the result because set/main-stat constraints are not fully modeled inside the satisfaction roll itself:

**Set bonus factor** (`getWeightedArtifactSetBonusFactor`): Same as for rating — down-weights off-set candidates when the build requires specific set counts.

**Main stats factor** (`getArtifactMainStatsFactor`): Product over **other** slots of the cumulative odds of rolling an acceptable main stat before/at the same time as farming this slot. Reflects that domain drops are equally likely per slot type, but specific main stats (e.g. Crit Rate circlet) are rare.

For **current artifacts** modes, both factors are **1** — the actual equipped sets and main stats are already in the simulation.

---

## Weighted set bonus factor

**Source:** `calculation/artifactmetrics/setbonusfactor/`

When the build specifies set bonuses and the candidate is **off-set**:

1. Sum required on-set piece counts across all `desiredArtifactSetBonuses`.
2. Enumerate all combinations of which **slots** must be on-set (`getArtifactTypeCombinations`).
3. For each combination, estimate the relative likelihood of farming exactly those slots on-set (`calculateOddsOfOnSetPieces`), accounting for:
   - Per-slot main-stat acceptability (`getCumulativeMainStatOdds`).
   - Equal 1/N probability per slot type from domain drops (N = number of artifact types).
   - Factorial multiplier for order independence when multiple slots are required.
4. **Factor** = (weight of combinations where **this slot is off-set**) / (total weight of all combinations).

If the candidate's set is listed in desired bonuses, or no set bonuses are configured, the factor is **1**.

Intuition: a strong off-set circlet is less valuable if the build **must** use the circlet slot for a 4-piece set — the factor captures how often you can afford to use that slot off-set.

---

## Main stats factor

**Source:** `calculation/artifactmetrics/mainstatsfactor/getartifactmainstatsfactor.ts`

For random-artifacts satisfaction modes:

```
mainStatsFactor = Π (over other slot types) getCumulativeMainStatOdds(slot, desiredMainStats[slot])
```

If a slot has no main-stat requirement, its odds are **1**. This factor does **not** divide by slot-type drop rate — unlike set bonus odds — because set identity is handled separately and domain slot-type probability is uniform.

---

## Worth evaluating filter

**Source:** `calculation/artifactmetrics/isartifactworthevaluating.ts`

Before expensive simulation, artifacts can be skipped (all metrics return **0**) to avoid scoring obviously irrelevant pieces:

1. **Wrong main stat** (when required) → skip.
2. **Replacement vs. equipped:** If the build already has a rated piece in the slot with rating > 0 and the build defines desired overall stats, a candidate whose **raw** rating is ≤ 1 (main stat only, no matching substats) → skip.
3. **Off-set pieces** when set bonuses are required:
   - Compute `weightedRawRating = rawRating × setBonusFactor × numArtifactTypes`.
   - Skip if `weightedRawRating < 1` (too common / too weak to matter).
   - Skip if the piece is leveled (`level ≥ 3 × levelsPerSubstatRoll`) but `weightedRawRating < 3` and `rawRating < 4` — heavily invested off-set with mediocre rolls.

The build's equipped artifact **RATING** must be computed first when evaluating replacements; otherwise an error is thrown.

---

## Caching and updates

**Source:** `calculation/artifactmetrics/index.ts`

- `updateMetric` / `updateMetrics` / `updateAllMetrics` drive computation.
- `RATING`, `PLUS_MINUS`, and `POSITIVE_PLUS_MINUS_ODDS` are updated in a single pass.
- Cache invalidation: artifact or build `lastUpdatedDate` changes, or `iterations` increases.
- After all metrics run, `maxValue` = max of `buildResults` for that metric (used for artifact list sorting and aggregate chart bars).

---

## UI display notes

**Source:** `components/artifacts/ArtifactDetails/MetricChart.tsx`

- **RATING** and **PLUS_MINUS** bars: value / 10, clamped for display.
- **Satisfaction** and **POSITIVE_PLUS_MINUS_ODDS**: raw 0–1 probability; bar length uses `2^log10(x)` for visibility when values are small.
- Metric names in the UI match the enum strings (e.g. `CURRENT_STATS_RANDOM_ARTIFACTS`).

---

## Code reference

| Concept | Primary file(s) |
|---------|-----------------|
| Metric enum & result types | `types/artifactmetrics.ts` |
| Orchestration & cache | `calculation/artifactmetrics/index.ts` |
| Raw substat rating | `calculation/artifactmetrics/calculateartifactrating.ts` |
| RATING / PLUS_MINUS / ODDS | `calculation/artifactmetrics/calculateartifactratingmetrics.ts` |
| Satisfaction metrics | `calculation/artifactmetrics/calculateartifactbuildsatisfaction.ts` |
| Build satisfaction | `calculation/buildmetrics/satisfaction/` |
| Roll simulation | `calculation/simulation/` |
| Set bonus weight | `calculation/artifactmetrics/setbonusfactor/` |
| Main stat weight | `calculation/artifactmetrics/mainstatsfactor/` |
| Main stat odds helper | `calculation/getcumulativemainstatodds.ts` |
| Sort / top lists | `gettopbuilds.ts`, `gettopartifacts.ts`, `sortartifacts.tsx` |

---

## Choosing a metric

| Goal | Suggested metric |
|------|------------------|
| Raw substat quality for a build | **RATING** |
| Upgrade vs. keep equipped piece | **PLUS_MINUS** or **POSITIVE_PLUS_MINUS_ODDS** |
| Will this piece complete the build as-is? | **DESIRED_STATS_CURRENT_ARTIFACTS** or **CURRENT_STATS_CURRENT_ARTIFACTS** |
| Long-term farming value with random other pieces | **DESIRED_STATS_RANDOM_ARTIFACTS** or **CURRENT_STATS_RANDOM_ARTIFACTS** |
| Compare artifacts across all builds | Sort by metric **`maxValue`** |

**CURRENT** vs **DESIRED** stats: use CURRENT when targets are "maintain what I already hit"; use DESIRED when targets are explicit goals (e.g. 70/140 crit, 190 ER).

**CURRENT** vs **RANDOM** artifacts: use CURRENT for short-term "plug this in today"; use RANDOM for expected value assuming other slots are still being farmed.
