import { SUB_STAT_ROLL_VALUES_BY_RARITY, SUB_STATS } from "@/constants";
import { Artifact, Stat, StatValue } from "@/types";

const getRandomValue = <T>(arr: Array<T>) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const rollArtifact = (artifact: Artifact): Artifact => {
  if (artifact.rarity !== 5) {
    return artifact;
  }

  const rolledArtifact = { ...artifact, level: 20, subStats: rollSubstats(artifact) };

  return rolledArtifact;
};

const rollSubstats = (artifact: Artifact): StatValue<Stat>[] => {
  const subStats = artifact.subStats.map((subStat) => ({ stat: subStat.stat, value: subStat.value }));
  const numRolls = Math.ceil((20 - artifact.level) / 4);

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < 4) {
      const stat = pickNewSubStat({ mainStat: artifact.mainStat, subStats: subStats.map((s) => s.stat) });
      const rolledSubStat = rollSubStat(stat);
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat(subStat.stat);
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};

const pickNewSubStat = ({ mainStat, subStats }: { mainStat: Stat; subStats: Stat[] }): Stat => {
  const currentSubStats = new Set([mainStat, ...subStats]);
  return getRandomValue(SUB_STATS.filter((subStat) => !currentSubStats.has(subStat)));
};

const rollSubStat = (stat: Stat): StatValue<Stat> => {
  const value = getRandomValue(SUB_STAT_ROLL_VALUES_BY_RARITY[5][stat]!);

  return { stat, value };
};
