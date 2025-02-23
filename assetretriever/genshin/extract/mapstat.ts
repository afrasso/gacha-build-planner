import { Stat } from "@/types";

const mapStat = (stat: string | undefined) => {
  if (!stat) {
    return;
  }

  const lookup: Record<string, Stat> = {
    FIGHT_PROP_ATTACK_PERCENT: Stat.ATK_PERCENT,
    FIGHT_PROP_CHARGE_EFFICIENCY: Stat.ENERGY_RECHARGE,
    FIGHT_PROP_CRITICAL: Stat.CRIT_RATE,
    FIGHT_PROP_CRITICAL_HURT: Stat.CRIT_DMG,
    FIGHT_PROP_DEFENSE_PERCENT: Stat.DEF_PERCENT,
    FIGHT_PROP_ELEC_ADD_HURT: Stat.DMG_BONUS_ELECTRO,
    FIGHT_PROP_ELEMENT_MASTERY: Stat.ELEMENTAL_MASTERY,
    FIGHT_PROP_FIRE_ADD_HURT: Stat.DMG_BONUS_PYRO,
    FIGHT_PROP_GRASS_ADD_HURT: Stat.DMG_BONUS_DENDRO,
    FIGHT_PROP_HEAL_ADD: Stat.HEALING_BONUS,
    FIGHT_PROP_HP_PERCENT: Stat.HP_PERCENT,
    FIGHT_PROP_ICE_ADD_HURT: Stat.DMG_BONUS_CRYO,
    FIGHT_PROP_PHYSICAL_ADD_HURT: Stat.DMG_BONUS_PHYSICAL,
    FIGHT_PROP_ROCK_ADD_HURT: Stat.DMG_BONUS_GEO,
    FIGHT_PROP_WATER_ADD_HURT: Stat.DMG_BONUS_HYDRO,
    FIGHT_PROP_WIND_ADD_HURT: Stat.DMG_BONUS_ANEMO,
  };

  const mappedStat = lookup[stat];
  if (!mappedStat) {
    throw new Error(`Could not find the stat ${stat}.`);
  }

  return mappedStat;
};

export default mapStat;
