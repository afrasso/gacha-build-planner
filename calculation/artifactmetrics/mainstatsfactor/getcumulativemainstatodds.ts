import { getMainStatOdds } from "@/constants";
import { ArtifactType, Stat } from "@/types";

const getCumulativeMainStatOdds = ({
  artifactType,
  mainStats,
}: {
  artifactType: ArtifactType;
  mainStats?: Stat[];
}): number => {
  // If no main stats are specified, we can assume that any main stat is acceptable, and thus the odds of getting an
  //  main stat is 1.
  if (!mainStats || mainStats.length === 0) {
    return 1;
  }

  return mainStats.reduce((acc, mainStat) => {
    acc += getMainStatOdds({ artifactType, mainStat });
    return acc;
  }, 0);
};

export default getCumulativeMainStatOdds;
