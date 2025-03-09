const mapDbStatKey = (dbStatKey: string): string => {
  const lookup: Record<string, string> = {
    AttackAddedRatio: "ATK_PERCENT",
    BaseAttack: "ATK",
    BaseDefence: "DEF",
    BaseHP: "HP",
    BaseSpeed: "SPD",
    BreakDamageAddedRatioBase: "BREAK_EFF",
    CriticalChanceBase: "CRIT_RATE",
    CriticalDamageBase: "CRIT_DMG",
    DefenceAddedRatio: "DEF_PERCENT",
    FireAddedRatio: "DMG_BONUS_FIRE",
    HPAddedRatio: "HP_PERCENT",
    IceAddedRatio: "DMG_BONUS_ICE",
    ImaginaryAddedRatio: "DMG_BONUS_IMAGINARY",
    PhysicalAddedRatio: "DMG_BONUS_PHYSICAL",
    QuantumAddedRatio: "DMG_BONUS_QUANTUM",
    SpeedDelta: "SPD",
    StatusProbabilityBase: "EFF_HIT_RATE",
    StatusResistanceBase: "EFF_RES",
    ThunderAddedRatio: "DMG_BONUS_LIGHTNING",
    WindAddedRatio: "DMG_BONUS_WIND",
  };

  const mappedStat = lookup[dbStatKey];
  if (!mappedStat) {
    throw new Error(`Could not find the stat ${dbStatKey}.`);
  }

  return mappedStat;
};

export default mapDbStatKey;
