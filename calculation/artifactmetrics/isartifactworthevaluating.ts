import { IDataContext } from "@/contexts/DataContext";
import { IArtifact, IBuild } from "@/types";

import calculateArtifactRating from "./calculateartifactrating";

export let skipCount = 0;
export let totalCount = 1;

const isArtifactWorthEvaluating = ({
  artifact,
  build,
  dataContext,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  iterations: number;
}): boolean => {
  totalCount++;

  const rawArtifactRating = calculateArtifactRating({ artifact, build, dataContext });
  const buildArtifact = build.artifacts[artifact.typeKey];

  // Initialize the build artifact rating to either itself, or if there is no build artifact, to 0.
  const buildArtifactRating = buildArtifact
    ? buildArtifact?.metricsResults.RATING.buildResults[build.characterId]
    : { iterations, result: 0 };

  if (artifact !== buildArtifact) {
    if (buildArtifactRating.result === undefined || buildArtifactRating.iterations !== iterations) {
      // We should always have a rating for the build artifact before getting a rating for a non-build artifact for the
      // given build. If we don't have one, throw an error.
      throw new Error("Unexpected error: the build artifact doesn't have an available rating.");
    }
    if (
      // If the raw (pre-rolled) rating is 0 (i.e., doesn't match a required main stat), no calculations are needed.
      rawArtifactRating === 0 ||
      // If the build artifact that currently exists has at least a rating of 1, and there's at least one desired main
      // stat defined for the build, in order to not skip this artifact it needs to have a raw rating of greater
      // than 1 (i.e., at least one matching sub-stat).
      (buildArtifactRating.result > 0 && build.desiredOverallStats.length > 0 && rawArtifactRating === 1)
    ) {
      skipCount++;
      return false;
    }
  }

  return true;
};

export default isArtifactWorthEvaluating;
