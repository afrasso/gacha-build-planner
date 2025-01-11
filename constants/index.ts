import { ArtifactTier, ArtifactType, OverallStat, Stat } from "@/types";

// Source: https://genshin-impact.fandom.com/wiki/Artifact/Stats
export const ARTIFACT_MAX_LEVEL_BY_RARITY: Record<number, number> = {
  1: 4,
  2: 4,
  3: 12,
  4: 16,
  5: 20,
};

export const ARTIFACT_TIER_NUMERIC_RATINGS: Record<ArtifactTier, number> = {
  [ArtifactTier.F]: 0,
  [ArtifactTier.D]: 1,
  [ArtifactTier.C]: 2,
  [ArtifactTier.B]: 3,
  [ArtifactTier.A]: 4,
  [ArtifactTier.S]: 5,
  [ArtifactTier.SS]: 6,
  [ArtifactTier.SSS]: 7,
  [ArtifactTier.SSS_PLUS]: 8,
};

export const ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP = Object.fromEntries(
  Object.entries(ARTIFACT_TIER_NUMERIC_RATINGS).map(([key, value]) => [value, key])
);

// Source: https://keqingmains.com/misc/artifacts/
// These odds assume the artifact source is a domain.
export const INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY: Record<number, Record<number, number>> = {
  1: { 0: 1 },
  2: { 0: 0.8, 1: 0.2 },
  3: { 1: 0.8, 2: 0.2 },
  4: { 2: 0.8, 3: 0.2 },
  5: { 3: 0.8, 4: 0.2 },
};

// Source: https://genshin-impact.fandom.com/wiki/Artifact/Distribution
export const MAIN_STAT_ODDS_BY_ARTIFACT_TYPE: Record<ArtifactType, Partial<Record<Stat, number>>> = {
  [ArtifactType.CIRCLET]: {
    [Stat.ATK_PERCENT]: 0.22,
    [Stat.CRIT_DMG]: 0.1,
    [Stat.CRIT_RATE]: 0.1,
    [Stat.DEF_PERCENT]: 0.22,
    [Stat.ELEMENTAL_MASTERY]: 0.04,
    [Stat.HEALING_BONUS]: 0.1,
    [Stat.HP_PERCENT]: 0.22,
  },
  [ArtifactType.FLOWER]: { [Stat.HP_FLAT]: 1 },
  [ArtifactType.GOBLET]: {
    [Stat.ATK_PERCENT]: 0.1925,
    [Stat.DEF_PERCENT]: 0.19,
    [Stat.DMG_BONUS_ANEMO]: 0.05,
    [Stat.DMG_BONUS_CRYO]: 0.05,
    [Stat.DMG_BONUS_DENDRO]: 0.05,
    [Stat.DMG_BONUS_ELECTRO]: 0.05,
    [Stat.DMG_BONUS_GEO]: 0.05,
    [Stat.DMG_BONUS_HYDRO]: 0.05,
    [Stat.DMG_BONUS_PHYSICAL]: 0.05,
    [Stat.DMG_BONUS_PYRO]: 0.05,
    [Stat.ELEMENTAL_MASTERY]: 0.025,
    [Stat.HP_PERCENT]: 0.1925,
  },
  [ArtifactType.PLUME]: { [Stat.ATK_FLAT]: 1 },
  [ArtifactType.SANDS]: {
    [Stat.ATK_PERCENT]: 0.2666,
    [Stat.DEF_PERCENT]: 0.2666,
    [Stat.ELEMENTAL_MASTERY]: 0.1,
    [Stat.ENERGY_RECHARGE]: 0.1,
    [Stat.HP_PERCENT]: 0.2668,
  },
};

export const MAIN_STATS_BY_ARTIFACT_TYPE: Record<ArtifactType, Stat[]> = {
  [ArtifactType.CIRCLET]: [
    Stat.ATK_PERCENT,
    Stat.CRIT_DMG,
    Stat.CRIT_RATE,
    Stat.DEF_PERCENT,
    Stat.ELEMENTAL_MASTERY,
    Stat.HEALING_BONUS,
    Stat.HP_PERCENT,
  ],
  [ArtifactType.FLOWER]: [Stat.HP_FLAT],
  [ArtifactType.GOBLET]: [
    Stat.ATK_PERCENT,
    Stat.DEF_PERCENT,
    Stat.DMG_BONUS_ANEMO,
    Stat.DMG_BONUS_CRYO,
    Stat.DMG_BONUS_DENDRO,
    Stat.DMG_BONUS_ELECTRO,
    Stat.DMG_BONUS_GEO,
    Stat.DMG_BONUS_HYDRO,
    Stat.DMG_BONUS_PHYSICAL,
    Stat.DMG_BONUS_PYRO,
    Stat.ELEMENTAL_MASTERY,
    Stat.HP_PERCENT,
  ],
  [ArtifactType.PLUME]: [Stat.ATK_FLAT],
  [ArtifactType.SANDS]: [
    Stat.ATK_PERCENT,
    Stat.DEF_PERCENT,
    Stat.ELEMENTAL_MASTERY,
    Stat.ENERGY_RECHARGE,
    Stat.HP_PERCENT,
  ],
};

// TODO: Change rarity into an enum.
export const MAIN_STAT_MAX_VALUES_BY_RARITY: Record<number, Partial<Record<Stat, number>>> = {
  5: {
    [Stat.ATK]: 311,
    [Stat.ATK_FLAT]: 311,
    [Stat.ATK_PERCENT]: 46.6,
    [Stat.CRIT_DMG]: 62.2,
    [Stat.CRIT_RATE]: 31.1,
    [Stat.DEF_PERCENT]: 58.3,
    [Stat.DMG_BONUS_ANEMO]: 46.6,
    [Stat.DMG_BONUS_CRYO]: 46.6,
    [Stat.DMG_BONUS_DENDRO]: 46.6,
    [Stat.DMG_BONUS_ELECTRO]: 46.6,
    [Stat.DMG_BONUS_GEO]: 46.6,
    [Stat.DMG_BONUS_HYDRO]: 46.6,
    [Stat.DMG_BONUS_PHYSICAL]: 46.6,
    [Stat.DMG_BONUS_PYRO]: 46.6,
    [Stat.ELEMENTAL_MASTERY]: 187,
    [Stat.ENERGY_RECHARGE]: 51.8,
    [Stat.HEALING_BONUS]: 35.9,
    [Stat.HP_FLAT]: 4780,
    [Stat.HP_PERCENT]: 46.6,
  },
};

export const OVERALL_STATS_ORDER: OverallStat[] = [
  OverallStat.MAX_HP,
  OverallStat.ATK,
  OverallStat.DEF,
  OverallStat.ELEMENTAL_MASTERY,
  OverallStat.CRIT_RATE,
  OverallStat.CRIT_DMG,
  OverallStat.HEALING_BONUS,
  OverallStat.ENERGY_RECHARGE,
  OverallStat.DMG_BONUS_PYRO,
  OverallStat.DMG_BONUS_HYDRO,
  OverallStat.DMG_BONUS_DENDRO,
  OverallStat.DMG_BONUS_ELECTRO,
  OverallStat.DMG_BONUS_ANEMO,
  OverallStat.DMG_BONUS_CRYO,
  OverallStat.DMG_BONUS_GEO,
  OverallStat.DMG_BONUS_PHYSICAL,
];

export const SUB_STAT_ROLL_VALUES_BY_RARITY: Record<number, Partial<Record<Stat, number[]>>> = {
  5: {
    // TODO: Remove the ATK stat.
    [Stat.ATK]: [13.62, 15.56, 17.51, 19.45],
    [Stat.ATK_FLAT]: [13.62, 15.56, 17.51, 19.45],
    [Stat.ATK_PERCENT]: [4.08, 4.66, 5.25, 5.83],
    [Stat.CRIT_DMG]: [5.44, 6.22, 6.99, 7.77],
    [Stat.CRIT_RATE]: [2.72, 3.11, 3.5, 3.89],
    [Stat.DEF_FLAT]: [16.2, 18.52, 20.83, 23.15],
    [Stat.DEF_PERCENT]: [5.1, 5.83, 6.56, 7.29],
    [Stat.ELEMENTAL_MASTERY]: [16.32, 18.65, 20.98, 23.31],
    [Stat.ENERGY_RECHARGE]: [4.53, 5.18, 5.83, 6.48],
    [Stat.HP_FLAT]: [209.13, 239.0, 268.88, 298.75],
    [Stat.HP_PERCENT]: [4.08, 4.66, 5.25, 5.83],
  },
};

export const SUB_STAT_WEIGHTS: Partial<Record<Stat, number>> = {
  // TODO: Remove the ATK stat.
  [Stat.ATK]: 6,
  [Stat.ATK_FLAT]: 6,
  [Stat.ATK_PERCENT]: 4,
  [Stat.CRIT_DMG]: 3,
  [Stat.CRIT_RATE]: 3,
  [Stat.DEF_FLAT]: 6,
  [Stat.DEF_PERCENT]: 4,
  [Stat.ELEMENTAL_MASTERY]: 4,
  [Stat.ENERGY_RECHARGE]: 4,
  [Stat.HP_FLAT]: 6,
  [Stat.HP_PERCENT]: 4,
};

export const SUB_STATS: Stat[] = [
  Stat.ATK_FLAT,
  Stat.ATK_PERCENT,
  Stat.CRIT_DMG,
  Stat.CRIT_RATE,
  Stat.DEF_FLAT,
  Stat.DEF_PERCENT,
  Stat.ELEMENTAL_MASTERY,
  Stat.ENERGY_RECHARGE,
  Stat.HP_FLAT,
  Stat.HP_PERCENT,
];
