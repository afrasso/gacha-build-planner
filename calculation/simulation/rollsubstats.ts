import { getArtifactLevelsPerSubStatRoll, getArtifactMaxLevel, getMaxSubStats } from "@/constants";
import { Artifact, Stat, StatKey } from "@/types";

import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { getRandomValue } from "./getrandomvalue";
import { rollSubStat } from "./rollsubstat";

export const rollSubStats = ({ artifact }: { artifact: Artifact }): Stat<StatKey>[] => {
  // Create a copy of the artifact's substats.
  const subStats: Stat<StatKey>[] = artifact.subStats.map((subStat) => ({ ...subStat }));
  const numRolls = Math.ceil(
    (getArtifactMaxLevel({ rarity: artifact.rarity }) - artifact.level) / getArtifactLevelsPerSubStatRoll()
  );

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < getMaxSubStats()) {
      const statKey = getRandomNewSubStat({ mainStat: artifact.mainStat, subStats: subStats.map((s) => s.key) });
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, statKey });
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, statKey: subStat.key });
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};
