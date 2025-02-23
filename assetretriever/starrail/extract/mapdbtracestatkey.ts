const mapDbTraceStatKey = (dbTraceStatKey: string): string => {
  switch (dbTraceStatKey) {
    case "AttackAddedRatio":
      return "ATK_PERCENT";
    case "BreakDamageAddedRatioBase":
      return "BREAK_EFF";
    case "CriticalChanceBase":
      return "CRIT_RATE";
    case "CriticalDamageBase":
      return "CRIT_DMG";
    case "DefenceAddedRatio":
      return "DEF_PERCENT";
    case "FireAddedRatio":
      return "DMG_BONUS_FIRE";
    case "HPAddedRatio":
      return "HP_PERCENT";
    case "IceAddedRatio":
      return "DMG_BONUS_ICE";
    case "ImaginaryAddedRatio":
      return "DMG_BONUS_IMAGINARY";
    case "PhysicalAddedRatio":
      return "DMG_BONUS_PHYSICAL";
    case "QuantumAddedRatio":
      return "DMG_BONUS_QUANTUM";
    case "SpeedDelta":
      return "SPD";
    case "StatusProbabilityBase":
      return "EFF_HIT_RATE";
    case "StatusResistanceBase":
      return "EFF_RES";
    case "ThunderAddedRatio":
      return "DMG_BONUS_LIGHTNING";
    case "WindAddedRatio":
      return "DMG_BONUS_WIND";
    default:
      throw new Error(`Unexpected trace stat ${dbTraceStatKey} encountered.`);
  }
};

export default mapDbTraceStatKey;
