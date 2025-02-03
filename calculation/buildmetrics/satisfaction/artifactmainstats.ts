import { ArtifactType, BuildArtifacts, DesiredArtifactMainStats, Stat } from "@/types";

import { ArtifactMainStatSatisfactionDetails, SatisfactionResult } from "./types";

export const calculateArtifactMainStatsSatisfaction = ({
  artifacts,
  desiredArtifactMainStats,
}: {
  artifacts: BuildArtifacts;
  desiredArtifactMainStats: DesiredArtifactMainStats;
}): SatisfactionResult<ArtifactMainStatSatisfactionDetails> => {
  const details = (Object.entries(desiredArtifactMainStats) as [ArtifactType, Stat][]).map(([artifactType, stat]) => {
    const mainStat = artifacts[artifactType]?.mainStat;
    return { artifactType, desiredMainStat: stat, mainStat, satisfaction: mainStat === stat };
  });

  return {
    details,
    satisfaction: details.every((x) => x.satisfaction),
  };
};
