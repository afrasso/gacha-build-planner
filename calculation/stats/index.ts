import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, BuildArtifacts, OverallStatKey, StatKey } from "@/types";

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
}): Record<OverallStatKey, number> => {
  const { getCharacter, getWeapon } = genshinDataContext;
  const character = getCharacter(build.characterId);
  const weapon = build.weaponId ? getWeapon(build.weaponId) : undefined;

  const resolvedArtifacts = artifacts || build.artifacts;

  const calculateAtk = () => {
    const initial = character.maxLvlStats.ATK + (weapon?.maxLvlStats.ATK || 0);
    const bonusPercent = calculateStandardStat({
      artifacts: resolvedArtifacts,
      character,
      statKey: StatKey.ATK_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, statKey: StatKey.ATK_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateCritDmg = () => {
    return round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        min: 50,
        statKey: StatKey.CRIT_DMG,
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
        statKey: StatKey.CRIT_RATE,
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
      statKey: StatKey.DEF_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, statKey: StatKey.DEF_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateEr = () => {
    return round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        min: 100,
        statKey: StatKey.ENERGY_RECHARGE,
        weapon,
      }),
      1
    );
  };

  const calculateHp = () => {
    const initial = character.maxLvlStats.HP;
    const bonusPercent = calculateStandardStat({
      artifacts: resolvedArtifacts,
      character,
      statKey: StatKey.HP_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({ artifacts: resolvedArtifacts, statKey: StatKey.HP_FLAT });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const result = {
    [OverallStatKey.ATK]: calculateAtk(),
    [OverallStatKey.CRIT_DMG]: calculateCritDmg(),
    [OverallStatKey.CRIT_RATE]: calculateCritRate(),
    [OverallStatKey.DEF]: calculateDef(),
    [OverallStatKey.DMG_BONUS_ANEMO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_ANEMO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_CRYO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_CRYO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_DENDRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_DENDRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_ELECTRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_ELECTRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_GEO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_GEO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_HYDRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_HYDRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_PHYSICAL]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_PHYSICAL,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_PYRO]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.DMG_BONUS_PYRO,
        weapon,
      })
    ),
    [OverallStatKey.ELEMENTAL_MASTERY]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.ELEMENTAL_MASTERY,
        weapon,
      })
    ),
    [OverallStatKey.ENERGY_RECHARGE]: calculateEr(),
    [OverallStatKey.HEALING_BONUS]: round(
      calculateStandardStat({
        artifacts: resolvedArtifacts,
        character,
        statKey: StatKey.HEALING_BONUS,
        weapon,
      })
    ),
    [OverallStatKey.MAX_HP]: calculateHp(),
  } as Record<OverallStatKey, number>;

  return result;
};
