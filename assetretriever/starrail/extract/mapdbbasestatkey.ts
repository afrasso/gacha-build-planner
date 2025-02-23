const mapDbBaseStatKey = (dbBaseStatKey: string): string => {
  switch (dbBaseStatKey) {
    case "BaseAttack":
      return "ATK";
    case "BaseDefence":
      return "DEF";
    case "BaseHP":
      return "HP";
    case "BaseSpeed":
      return "SPD";
    case "CriticalChanceBase":
      return "CRIT_RATE";
    case "CriticalDamageBase":
      return "CRIT_DMG";
    default:
      throw new Error(`Unexpected base stat ${dbBaseStatKey} encountered.`);
  }
};

export default mapDbBaseStatKey;
