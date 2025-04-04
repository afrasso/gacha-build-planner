const mapDbStatKey = (dbStatKey?: string): string | undefined => {
  if (!dbStatKey) {
    return;
  }

  const lookup: Record<string, string> = {
    FIGHT_PROP_ATTACK_PERCENT: "ATK_PERCENT",
    FIGHT_PROP_CHARGE_EFFICIENCY: "ENERGY_RECHARGE",
    FIGHT_PROP_CRITICAL: "CRIT_RATE",
    FIGHT_PROP_CRITICAL_HURT: "CRIT_DMG",
    FIGHT_PROP_DEFENSE_PERCENT: "DEF_PERCENT",
    FIGHT_PROP_ELEC_ADD_HURT: "DMG_BONUS_ELECTRO",
    FIGHT_PROP_ELEMENT_MASTERY: "ELEMENTAL_MASTERY",
    FIGHT_PROP_FIRE_ADD_HURT: "DMG_BONUS_PYRO",
    FIGHT_PROP_GRASS_ADD_HURT: "DMG_BONUS_DENDRO",
    FIGHT_PROP_HEAL_ADD: "HEALING_BONUS",
    FIGHT_PROP_HP_PERCENT: "HP_PERCENT",
    FIGHT_PROP_ICE_ADD_HURT: "DMG_BONUS_CRYO",
    FIGHT_PROP_PHYSICAL_ADD_HURT: "DMG_BONUS_PHYSICAL",
    FIGHT_PROP_ROCK_ADD_HURT: "DMG_BONUS_GEO",
    FIGHT_PROP_WATER_ADD_HURT: "DMG_BONUS_HYDRO",
    FIGHT_PROP_WIND_ADD_HURT: "DMG_BONUS_ANEMO",
  };

  const mappedStat = lookup[dbStatKey];
  if (!mappedStat) {
    throw new Error(`Could not find the stat ${dbStatKey}.`);
  }

  return mappedStat;
};

export default mapDbStatKey;
