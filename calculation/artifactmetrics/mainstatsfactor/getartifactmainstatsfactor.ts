import { Artifact, ArtifactType, DesiredArtifactMainStats } from "@/types";

import getCumulativeMainStatOdds from "@/calculation/getcumulativemainstatodds";

const getArtifactMainStatsFactor = ({
  artifact,
  desiredArtifactMainStats,
}: {
  artifact: Artifact;
  desiredArtifactMainStats: DesiredArtifactMainStats;
}): number => {
  // The factor is equal to the odds that we'll obtain the other four artifacts with matching main before this one.
  // Unlike with set bonuses where we had to take into account the likelihood of main stats into account, here we don't
  // need to because when farming from a domain, the likelihood of getting a particular set on an artifact is the same
  // regardless of the artifact type (50%).

  // For the purposes of this calculation, we can ignore flowers and plumes, since they can only have one main stat, so
  // the odds of getting the needed main stat is 1.
  const artifactTypes = [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS];

  const factor = artifactTypes
    // Filter out the current artifact type, since what we're calculating is the odds we _won't_ get it before the
    // others.
    .filter((artifactType) => artifactType !== artifact.type)
    // Multiply the odds to get the total odds.
    .reduce((acc, artifactType) => {
      acc =
        acc *
        getCumulativeMainStatOdds({
          artifactType,
          mainStats: desiredArtifactMainStats[artifactType],
        });
      return acc;
    }, 1);
  return factor;
};

export default getArtifactMainStatsFactor;
