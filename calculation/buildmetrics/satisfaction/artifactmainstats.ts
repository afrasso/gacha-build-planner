import { ArtifactType, BuildArtifacts, DesiredArtifactMainStats, StatKey } from "@/types";

import { ArtifactMainStatSatisfactionDetails, SatisfactionResult } from "./types";

export const calculateArtifactMainStatsSatisfaction = ({
  artifacts,
  desiredArtifactMainStats,
}: {
  artifacts: BuildArtifacts;
  desiredArtifactMainStats: DesiredArtifactMainStats;
}): SatisfactionResult<ArtifactMainStatSatisfactionDetails> => {
  const details = (Object.entries(desiredArtifactMainStats) as [ArtifactType, StatKey[]][]).map(
    ([artifactType, mainStats]) => {
      const mainStat = artifacts[artifactType]?.mainStat;
      return {
        artifactType,
        desiredMainStats: mainStats,
        mainStat,
        satisfaction: !!mainStat && mainStats.includes(mainStat),
      };
    }
  );

  return {
    details,
    satisfaction: details.every((x) => x.satisfaction),
  };
};
