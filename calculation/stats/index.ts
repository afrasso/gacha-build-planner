import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, BuildArtifacts, OverallStat, Stat } from "@/types";

import { calculateStandardStat } from "./calculatestandardstat";
import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

const round = (num: number, places: number = 0) => {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
};

export const calculateStats = ({
  artifacts,
  build,
  genshinDataContext,
}: {
  artifacts?: BuildArtifacts;
  build: Build;
  genshinDataContext: GenshinDataContext;
}) => {
  const { getCharacter, getWeapon } = genshinDataContext;
  const character = getCharacter(build.characterId);
  const weapon = build.weaponId ? getWeapon(build.weaponId) : undefined;

  const resolvedArtifacts = artifacts || build.artifacts;

  const calculateAtk = () => {
    const initial = character.maxLvlStats.ATK + (weapon?.maxLvlStats.ATK || 0);
    const bonusPercent = calculateStandardStat({
      artifacts: resolvedArtifacts,
      character,
      stat: Stat.ATK_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, stat: Stat.ATK_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateCritDmg = () => {
    return round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        min: 50,
        stat: Stat.CRIT_DMG,
        weapon,
      }),
      1
    );
  };

  const calculateCritRate = () => {
    return round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        min: 5,
        stat: Stat.CRIT_RATE,
        weapon,
      }),
      1
    );
  };

  const calculateDef = () => {
    const initial = character.maxLvlStats.DEF;
    const bonusPercent = calculateStandardStat({
      artifacts: resolvedArtifacts,
      character,
      stat: Stat.DEF_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, stat: Stat.DEF_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateEr = () => {
    return round(
      calculateStandardStat({ artifacts: resolvedArtifacts, character, min: 100, stat: Stat.ENERGY_RECHARGE, weapon }),
      1
    );
  };

  const calculateHp = () => {
    const initial = character.maxLvlStats.HP;
    const bonusPercent = calculateStandardStat({
      artifacts: resolvedArtifacts,
      character,
      stat: Stat.HP_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, stat: Stat.HP_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const result = {
    [OverallStat.ATK]: calculateAtk(),
    [OverallStat.CRIT_DMG]: calculateCritDmg(),
    [OverallStat.CRIT_RATE]: calculateCritRate(),
    [OverallStat.DEF]: calculateDef(),
    [OverallStat.DMG_BONUS_ANEMO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_ANEMO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_CRYO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_CRYO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_DENDRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_DENDRO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_ELECTRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_ELECTRO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_GEO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_GEO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_HYDRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_HYDRO,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_PHYSICAL]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_PHYSICAL,
        weapon,
      })
    ),
    [OverallStat.DMG_BONUS_PYRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.DMG_BONUS_PYRO,
        weapon,
      })
    ),
    [OverallStat.ELEMENTAL_MASTERY]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.ELEMENTAL_MASTERY,
        weapon,
      })
    ),
    [OverallStat.ENERGY_RECHARGE]: calculateEr(),
    [OverallStat.HEALING_BONUS]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        stat: Stat.HEALING_BONUS,
        weapon,
      })
    ),
    [OverallStat.MAX_HP]: calculateHp(),
  } as Record<OverallStat, number>;

  return result;
};
