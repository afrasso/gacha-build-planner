import { getArtifactLevelsPerSubStatRoll, getArtifactMaxLevel, getMaxSubStats } from "@/constants";
import { Artifact, Stat, StatValue } from "@/types";

import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { getRandomValue } from "./getrandomvalue";
import { rollSubStat } from "./rollsubstat";

export const rollSubStats = ({ artifact }: { artifact: Artifact }): StatValue<Stat>[] => {
  // Create a copy of the artifact's substats.
  const subStats = artifact.subStats.map((subStat) => ({ stat: subStat.stat, value: subStat.value }));
  const numRolls = Math.ceil(
    (getArtifactMaxLevel({ rarity: artifact.rarity }) - artifact.level) / getArtifactLevelsPerSubStatRoll()
  );

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < getMaxSubStats()) {
      const stat = getRandomNewSubStat({ mainStat: artifact.mainStat, subStats: subStats.map((s) => s.stat) });
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, stat });
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, stat: subStat.stat });
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};
