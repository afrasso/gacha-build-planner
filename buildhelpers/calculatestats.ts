import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, OverallStat, Stat } from "@/types";

import { MAIN_STAT_MAX_VALUES } from "../constants";

const round = (num: number, places: number = 0) => {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
};

export const calculateStats = ({
  build,
  genshinDataContext,
}: {
  build: Build;
  genshinDataContext: GenshinDataContext;
}) => {
  const { getCharacter, getWeapon } = genshinDataContext;
  const character = getCharacter(build.characterId);
  const weapon = build.weaponId ? getWeapon(build.weaponId) : undefined;

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

  const calculateBasicStat = (stat: Stat, min = 0) => {
    const total =
      getTotalArtifactStatValue(stat) +
      (character.ascensionStat === stat ? character.maxLvlStats.ascensionStat : min) +
      (weapon?.mainStat === stat ? weapon.maxLvlStats.mainStat : 0);

    return total;
  };

  const calculateAtk = () => {
    const initial = character.maxLvlStats.ATK + (weapon?.maxLvlStats.ATK || 0);
    const bonusPercent = calculateBasicStat(Stat.ATK_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.ATK_FLAT);

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateCritDmg = () => {
    return round(calculateBasicStat(Stat.CRIT_DMG, 50), 1);
  };

  const calculateCritRate = () => {
    return round(calculateBasicStat(Stat.CRIT_RATE, 5), 1);
  };

  const calculateDef = () => {
    const initial = character.maxLvlStats.DEF;
    const bonusPercent = calculateBasicStat(Stat.DEF_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.DEF_FLAT);

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateEr = () => {
    return round(calculateBasicStat(Stat.ENERGY_RECHARGE, 100), 1);
  };

  const calculateHp = () => {
    const initial = character.maxLvlStats.HP;
    const bonusPercent = calculateBasicStat(Stat.HP_PERCENT);
    const bonusFlat = getTotalArtifactStatValue(Stat.HP_FLAT);

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const result = {
    [OverallStat.ATK]: calculateAtk(),
    [OverallStat.CRIT_DMG]: calculateCritDmg(),
    [OverallStat.CRIT_RATE]: calculateCritRate(),
    [OverallStat.DEF]: calculateDef(),
    [OverallStat.DMG_BONUS_ANEMO]: round(calculateBasicStat(Stat.DMG_BONUS_ANEMO)),
    [OverallStat.DMG_BONUS_CRYO]: round(calculateBasicStat(Stat.DMG_BONUS_CRYO)),
    [OverallStat.DMG_BONUS_DENDRO]: round(calculateBasicStat(Stat.DMG_BONUS_DENDRO)),
    [OverallStat.DMG_BONUS_ELECTRO]: round(calculateBasicStat(Stat.DMG_BONUS_ELECTRO)),
    [OverallStat.DMG_BONUS_GEO]: round(calculateBasicStat(Stat.DMG_BONUS_GEO)),
    [OverallStat.DMG_BONUS_HYDRO]: round(calculateBasicStat(Stat.DMG_BONUS_HYDRO)),
    [OverallStat.DMG_BONUS_PHYSICAL]: round(calculateBasicStat(Stat.DMG_BONUS_PHYSICAL)),
    [OverallStat.DMG_BONUS_PYRO]: round(calculateBasicStat(Stat.DMG_BONUS_PYRO)),
    [OverallStat.ELEMENTAL_MASTERY]: round(calculateBasicStat(Stat.ELEMENTAL_MASTERY)),
    [OverallStat.ENERGY_RECHARGE]: calculateEr(),
    [OverallStat.HEALING_BONUS]: round(calculateBasicStat(Stat.HEALING_BONUS)),
    [OverallStat.MAX_HP]: calculateHp(),
  } as Record<OverallStat, number>;

  return result;
};
