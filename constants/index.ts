import { ArtifactType, Stat } from "@/types";

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
