import { MAIN_STAT_ODDS_BY_ARTIFACT_TYPE } from "@/constants";
import { ArtifactType, DesiredArtifactMainStats } from "@/types";

const calculateFactorial = (n: number): number => {
  if (n < 0) {
    throw new Error("A factorial is not defined for negative numbers.");
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const calculateOddsOfOnSetPieces = ({
  artifactTypes,
  desiredArtifactMainStats,
}: {
  artifactTypes: ArtifactType[];
  desiredArtifactMainStats: DesiredArtifactMainStats;
}): number => {
  // Odds are the odds that all of the specified artifacts are on-set.
  const initialOdds = artifactTypes.reduce((acc, artifactType) => {
    const desiredArtifactMainStat = desiredArtifactMainStats[artifactType];
    if (desiredArtifactMainStat) {
      const odds = MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[artifactType][desiredArtifactMainStat];
      if (!odds) {
        throw new Error(
          `Unexpected error: could not find odds for the stat ${desiredArtifactMainStat} for an artifact of type ${artifactType}.`
        );
      }
      // Divide by five due to the raw odds of even getting this artifact type.
      acc = acc * odds;
    }
    return acc / 5;
  }, 1);

  return initialOdds * calculateFactorial(artifactTypes.length);
};

export default calculateOddsOfOnSetPieces;
