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
  [ArtifactTier.A]: 4,
  [ArtifactTier.B]: 3,
  [ArtifactTier.C]: 2,
  [ArtifactTier.D]: 1,
  [ArtifactTier.F]: 0,
  [ArtifactTier.S]: 5,
  [ArtifactTier.SS]: 6,
  [ArtifactTier.SSS]: 7,
  [ArtifactTier.SSS_PLUS]: 8,
};

export const ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP: Record<number, ArtifactTier> = Object.fromEntries(
  Object.entries(ARTIFACT_TIER_NUMERIC_RATINGS).map(([key, value]) => [value, key])
) as Record<number, ArtifactTier>;

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

// Source: https://genshin-impact.fandom.com/wiki/Artifact/Stats
export const SUB_STAT_ROLL_VALUES_BY_RARITY: Record<number, Partial<Record<Stat, number[]>>> = {
  1: {
    // TODO: Remove the ATK stat.
    [Stat.ATK]: [1.56, 1.95],
    [Stat.ATK_FLAT]: [1.56, 1.95],
    [Stat.ATK_PERCENT]: [1.17, 1.46],
    [Stat.CRIT_DMG]: [1.55, 1.94],
    [Stat.CRIT_RATE]: [0.78, 0.97],
    [Stat.DEF_FLAT]: [1.85, 2.31],
    [Stat.DEF_PERCENT]: [1.46, 1.82],
    [Stat.ELEMENTAL_MASTERY]: [4.66, 5.83],
    [Stat.ENERGY_RECHARGE]: [1.3, 1.62],
    [Stat.HP_FLAT]: [23.9, 29.88],
    [Stat.HP_PERCENT]: [1.17, 1.46],
  },
  2: {
    // TODO: Remove the ATK stat.
    [Stat.ATK]: [3.27, 3.97, 4.67],
    [Stat.ATK_FLAT]: [3.27, 3.97, 4.67],
    [Stat.ATK_PERCENT]: [1.63, 1.98, 2.33],
    [Stat.CRIT_DMG]: [2.18, 2.64, 3.11],
    [Stat.CRIT_RATE]: [1.09, 1.32, 1.55],
    [Stat.DEF_FLAT]: [3.89, 4.72, 5.56],
    [Stat.DEF_PERCENT]: [2.04, 2.48, 2.91],
    [Stat.ELEMENTAL_MASTERY]: [6.53, 7.93, 9.33],
    [Stat.ENERGY_RECHARGE]: [1.81, 2.2, 2.59],
    [Stat.HP_FLAT]: [50.19, 60.95, 71.7],
    [Stat.HP_PERCENT]: [1.63, 1.98, 2.33],
  },
  3: {
    // TODO: Remove the ATK stat.
    [Stat.ATK]: [6.54, 7.47, 8.4, 9.34],
    [Stat.ATK_FLAT]: [6.54, 7.47, 8.4, 9.34],
    [Stat.ATK_PERCENT]: [2.45, 2.8, 3.15, 3.5],
    [Stat.CRIT_DMG]: [3.26, 3.73, 4.2, 4.66],
    [Stat.CRIT_RATE]: [1.63, 1.86, 2.1, 2.33],
    [Stat.DEF_FLAT]: [7.78, 8.89, 10.0, 11.11],
    [Stat.DEF_PERCENT]: [3.06, 3.5, 3.93, 4.37],
    [Stat.ELEMENTAL_MASTERY]: [9.79, 11.19, 12.59, 13.99],
    [Stat.ENERGY_RECHARGE]: [2.72, 3.11, 3.5, 3.89],
    [Stat.HP_FLAT]: [100.38, 114.72, 129.06, 143.4],
    [Stat.HP_PERCENT]: [2.45, 2.8, 3.15, 3.5],
  },
  4: {
    // TODO: Remove the ATK stat.
    [Stat.ATK]: [10.89, 12.45, 14.0, 15.56],
    [Stat.ATK_FLAT]: [10.89, 12.45, 14.0, 15.56],
    [Stat.ATK_PERCENT]: [3.26, 3.73, 4.2, 4.66],
    [Stat.CRIT_DMG]: [4.35, 4.97, 5.6, 6.22],
    [Stat.CRIT_RATE]: [2.18, 2.49, 2.8, 3.11],
    [Stat.DEF_FLAT]: [12.96, 14.82, 16.67, 18.52],
    [Stat.DEF_PERCENT]: [4.08, 4.66, 5.25, 5.83],
    [Stat.ELEMENTAL_MASTERY]: [13.06, 14.92, 16.79, 18.65],
    [Stat.ENERGY_RECHARGE]: [3.63, 4.14, 4.66, 5.18],
    [Stat.HP_FLAT]: [167.3, 191.2, 215.1, 239.0],
    [Stat.HP_PERCENT]: [3.26, 3.73, 4.2, 4.66],
  },
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
