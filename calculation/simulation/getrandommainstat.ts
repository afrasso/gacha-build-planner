import { getMainStatOdds, getMainStats } from "@/constants";
import { ArtifactType, Stat } from "@/types";

export const getRandomMainStat = ({ type }: { type: ArtifactType }): Stat => {
  const random = Math.random();
  let cumulativeOdds = 0;
  for (const mainStat of getMainStats({ artifactType: type })) {
    const odds = getMainStatOdds({ artifactType: type, mainStat });
    if (random < cumulativeOdds + odds) {
      return mainStat;
    }
    cumulativeOdds += odds;
  }

  throw new Error(
    `Unexpected error: the cumulative main stat odds for the artifact type ${type} are greater than one: ${cumulativeOdds}.`
  );
};
