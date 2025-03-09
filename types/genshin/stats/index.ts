import { IDataContext } from "@/contexts/DataContext";
import { IArtifact } from "@/types";

import { Build } from "../build";
import { Character } from "../character";
import { Weapon } from "../weapon";
import { calculateStandardStat } from "./calculatestandardstat";
import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

const round = (num: number, places: number = 0) => {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
};

enum OverallStatKey {
  ATK = "ATK",
  CRIT_DMG = "CRIT_DMG",
  CRIT_RATE = "CRIT_RATE",
  DEF = "DEF",
  DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO",
  DMG_BONUS_CRYO = "DMG_BONUS_CRYO",
  DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO",
  DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO",
  DMG_BONUS_GEO = "DMG_BONUS_GEO",
  DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO",
  DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL",
  DMG_BONUS_PYRO = "DMG_BONUS_PYRO",
  ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE = "ENERGY_RECHARGE",
  HEALING_BONUS = "HEALING_BONUS",
  MAX_HP = "MAX_HP",
}

enum StatKey {
  ATK_FLAT = "ATK_FLAT",
  ATK_PERCENT = "ATK_PERCENT",
  CRIT_DMG = "CRIT_DMG",
  CRIT_RATE = "CRIT_RATE",
  DEF_FLAT = "DEF_FLAT",
  DEF_PERCENT = "DEF_PERCENT",
  DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO",
  DMG_BONUS_CRYO = "DMG_BONUS_CRYO",
  DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO",
  DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO",
  DMG_BONUS_GEO = "DMG_BONUS_GEO",
  DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO",
  DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL",
  DMG_BONUS_PYRO = "DMG_BONUS_PYRO",
  ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE = "ENERGY_RECHARGE",
  HEALING_BONUS = "HEALING_BONUS",
  HP_FLAT = "HP_FLAT",
  HP_PERCENT = "HP_PERCENT",
}

export const calculateStats = ({
  artifacts,
  build,
  dataContext,
}: {
  artifacts: Record<string, IArtifact>;
  build: Build;
  dataContext: IDataContext;
}): Record<string, number> => {
  const { getCharacter, getWeapon } = dataContext;
  const character = getCharacter(build.characterId) as Character;
  const weapon = build.weaponId ? (getWeapon(build.weaponId) as Weapon) : undefined;

  const calculateAtk = () => {
    const initial = character.maxLvlStats.ATK + (weapon?.maxLvlStats.ATK || 0);
    const bonusPercent = calculateStandardStat({
      artifacts,
      character,
      dataContext,
      statKey: StatKey.ATK_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({
      artifacts,
      dataContext,
      statKey: StatKey.ATK_FLAT,
    });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateCritDmg = () => {
    return round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
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
        artifacts,
        character,
        dataContext,
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
      artifacts,
      character,
      dataContext,
      statKey: StatKey.DEF_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({
      artifacts,
      dataContext,
      statKey: StatKey.DEF_FLAT,
    });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const calculateEr = () => {
    return round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
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
      artifacts,
      character,
      dataContext,
      statKey: StatKey.HP_PERCENT,
      weapon,
    });
    const bonusFlat = getTotalArtifactStatValue({
      artifacts,
      dataContext,
      statKey: StatKey.HP_FLAT,
    });

    return round(initial * (1 + bonusPercent / 100) + bonusFlat);
  };

  const result = {
    [OverallStatKey.ATK]: calculateAtk(),
    [OverallStatKey.CRIT_DMG]: calculateCritDmg(),
    [OverallStatKey.CRIT_RATE]: calculateCritRate(),
    [OverallStatKey.DEF]: calculateDef(),
    [OverallStatKey.DMG_BONUS_ANEMO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_ANEMO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_CRYO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_CRYO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_DENDRO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_DENDRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_ELECTRO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_ELECTRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_GEO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_GEO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_HYDRO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_HYDRO,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_PHYSICAL]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_PHYSICAL,
        weapon,
      })
    ),
    [OverallStatKey.DMG_BONUS_PYRO]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.DMG_BONUS_PYRO,
        weapon,
      })
    ),
    [OverallStatKey.ELEMENTAL_MASTERY]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.ELEMENTAL_MASTERY,
        weapon,
      })
    ),
    [OverallStatKey.ENERGY_RECHARGE]: calculateEr(),
    [OverallStatKey.HEALING_BONUS]: round(
      calculateStandardStat({
        artifacts,
        character,
        dataContext,
        statKey: StatKey.HEALING_BONUS,
        weapon,
      })
    ),
    [OverallStatKey.MAX_HP]: calculateHp(),
  } as Record<OverallStatKey, number>;

  return result;
};
