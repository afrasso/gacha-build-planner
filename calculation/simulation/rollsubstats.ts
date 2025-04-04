import { IDataContext } from "@/contexts/DataContext";
import { IArtifact, Stat } from "@/types";

import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { getRandomValue } from "./getrandomvalue";
import { rollSubStat } from "./rollsubstat";

export const rollSubStats = ({ artifact, dataContext }: { artifact: IArtifact; dataContext: IDataContext }): Stat[] => {
  const { getArtifactLevelsPerSubStatRoll, getArtifactMaxLevel, getArtifactMaxSubStatCount } = dataContext;

  // Create a copy of the artifact's substats.
  const subStats: Stat[] = artifact.subStats.map((subStat) => ({ ...subStat }));
  const numRolls = Math.ceil(
    (getArtifactMaxLevel({ rarity: artifact.rarity }) - artifact.level) / getArtifactLevelsPerSubStatRoll()
  );

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < getArtifactMaxSubStatCount()) {
      const statKey = getRandomNewSubStat({
        dataContext,
        mainStatKey: artifact.mainStatKey,
        subStatKeys: subStats.map((s) => s.key),
      });
      const rolledSubStat = rollSubStat({ dataContext, rarity: artifact.rarity, statKey });
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat({ dataContext, rarity: artifact.rarity, statKey: subStat.key });
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};
