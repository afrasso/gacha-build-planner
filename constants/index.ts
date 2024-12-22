import { ArtifactType, OverallStat, Stat } from "@/types";

export const MAIN_STATS_BY_ARTIFACT_TYPE = {
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

export const MAIN_STAT_MAX_VALUES = {
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
} as Record<Stat, number>;

export const SUB_STATS = [
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

export const SUB_STAT_ROLL_VALUES_BY_RARITY: Record<number, Partial<Record<Stat, number[]>>> = {
  5: {
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

export const ORDER_OVERALL_STATS = [
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
