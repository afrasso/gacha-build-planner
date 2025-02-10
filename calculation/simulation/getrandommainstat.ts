import { getMainStatOdds, getMainStats } from "@/constants";
import { ArtifactType, Stat } from "@/types";
import getCumulativeMainStatOdds from "../getcumulativemainstatodds";

export const getRandomMainStat = ({ mainStats, type }: { mainStats?: Stat[]; type: ArtifactType }): Stat => {
  const unfilteredMainStats = getMainStats({ artifactType: type });
  const filteredMainStats =
    mainStats && mainStats.length > 0
      ? unfilteredMainStats.filter((stat) => mainStats?.includes(stat))
      : unfilteredMainStats;
  const cumulativeOdds = getCumulativeMainStatOdds({ artifactType: type, mainStats: filteredMainStats });

  const random = Math.random() * cumulativeOdds;
  let currentCumulativeOdds = 0;
  for (const mainStat of filteredMainStats) {
    const odds = getMainStatOdds({ artifactType: type, mainStat });
    if (random < currentCumulativeOdds + odds) {
      return mainStat;
    }
    currentCumulativeOdds += odds;
  }

  throw new Error(
    `Unexpected error: the actual cumulative main stat odds for the artifact type ${type} are greater than the expected cumulative odds: ${currentCumulativeOdds}.`
  );
};
