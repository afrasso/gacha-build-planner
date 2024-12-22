import { Build, OverallStat, Stat } from "@/types";

import { MAIN_STAT_MAX_VALUES } from "../constants";

export const calculateStats = ({ build }: { build: Build }) => {
  const getTotalArtifactStatValue = (stat: Stat): number => {
    let total = 0;
    for (const artifact of Object.values(build.artifacts)) {
      if (artifact.mainStat === stat) {
        total += MAIN_STAT_MAX_VALUES[stat];
      }
      total += artifact.subStats.find((statValue) => statValue.stat === stat)?.value || 0;
    }
    return total;
  };

  const calculateBasicStat = (stat: Stat) => {
    const total =
      getTotalArtifactStatValue(stat) +
      (build.character.ascensionStat === stat ? build.character.maxLvlStats.ascensionStat : 0) +
      (build.weapon?.mainStat === stat ? build.weapon.maxLvlStats.mainStat : 0);

    return total;
  };

  const calculateAtk = () => {
    const initial = build.character.maxLvlStats.ATK + (build.weapon?.maxLvlStats.ATK || 0);
    const bonusPercent = calculateBasicStat(Stat.ATK_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.ATK_FLAT);

    return initial * (1 + bonusPercent / 100) + bonusFlat;
  };

  const calculateCritDmg = () => {
    return 50 + calculateBasicStat(Stat.CRIT_DMG);
  };

  const calculateCritRate = () => {
    return 5 + calculateBasicStat(Stat.CRIT_RATE);
  };

  const calculateDef = () => {
    const initial = build.character.maxLvlStats.DEF;
    const bonusPercent = calculateBasicStat(Stat.DEF_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.DEF_FLAT);

    return initial * (1 + bonusPercent / 100) + bonusFlat;
  };

  const calculateEr = () => {
    return 100 + calculateBasicStat(Stat.ENERGY_RECHARGE);
  };

  const calculateHp = () => {
    const initial = build.character.maxLvlStats.HP;
    const bonusPercent = calculateBasicStat(Stat.HP_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.HP_FLAT);

    return initial * (1 + bonusPercent / 100) + bonusFlat;
  };

  return {
    [OverallStat.ATK]: calculateAtk(),
    [OverallStat.CRIT_DMG]: calculateCritDmg(),
    [OverallStat.CRIT_RATE]: calculateCritRate(),
    [OverallStat.DEF]: calculateDef(),
    [OverallStat.DMG_BONUS_ANEMO]: calculateBasicStat(Stat.DMG_BONUS_ANEMO),
    [OverallStat.DMG_BONUS_CRYO]: calculateBasicStat(Stat.DMG_BONUS_CRYO),
    [OverallStat.DMG_BONUS_DENDRO]: calculateBasicStat(Stat.DMG_BONUS_DENDRO),
    [OverallStat.DMG_BONUS_ELECTRO]: calculateBasicStat(Stat.DMG_BONUS_ELECTRO),
    [OverallStat.DMG_BONUS_GEO]: calculateBasicStat(Stat.DMG_BONUS_GEO),
    [OverallStat.DMG_BONUS_HYDRO]: calculateBasicStat(Stat.DMG_BONUS_HYDRO),
    [OverallStat.DMG_BONUS_PHYSICAL]: calculateBasicStat(Stat.DMG_BONUS_PHYSICAL),
    [OverallStat.DMG_BONUS_PYRO]: calculateBasicStat(Stat.DMG_BONUS_PYRO),
    [OverallStat.ELEMENTAL_MASTERY]: calculateBasicStat(Stat.ELEMENTAL_MASTERY),
    [OverallStat.ENERGY_RECHARGE]: calculateEr(),
    [OverallStat.HEALING_BONUS]: calculateBasicStat(Stat.HEALING_BONUS),
    [OverallStat.MAX_HP]: calculateHp(),
  } as Record<OverallStat, number>;
};
