import { IDataContext } from "@/contexts/DataContext";
import { IArtifact, IBuild } from "@/types";

import calculateArtifactRating from "./calculateartifactrating";
import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

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

    // If the raw (pre-rolled) rating is 0 (i.e., doesn't match a required main stat), no calculations are needed.
    if (rawArtifactRating === 0) {
      return false;
    }

    // If the build artifact that currently exists has at least a rating of 1, and there's at least one desired main
    // stat defined for the build, in order to not skip this artifact it needs to have a raw rating of greater
    // than 1 (i.e., at least one matching sub-stat).
    if (buildArtifactRating.result > 0 && build.desiredOverallStats.length > 0 && rawArtifactRating <= 1) {
      return false;
    }

    // If the artifact doesn't match the desired set bonus, ensure that it meets some minimum level of viability.
    if (
      build.desiredArtifactSetBonuses?.length > 0 &&
      !build.desiredArtifactSetBonuses.map((bonus) => bonus.setId).includes(artifact.setId)
    ) {
      const weightedArtifactSetBonusFactor = getWeightedArtifactSetBonusFactor({
        artifact,
        dataContext,
        desiredArtifactMainStats: build.desiredArtifactMainStats,
        desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
      });
      // Define the weighted raw artifact rating as the raw artifact weighting divided by the product of the artifact
      // set bonus factor and the number of artifact types. The sum of all weighted artifact set bonus factors for a
      // given set of artifacts should sum to one, so by multiplying by the number of artifacts, we should get a number
      // that is higher when the artifact is rarer and lower when it is not, but centered around 1.
      const weightedRawArtifactRating =
        rawArtifactRating * weightedArtifactSetBonusFactor * dataContext.getArtifactTypes().length;

      // If the artifact doesn't have at least a weighted rating at least 1, move on. We shouldn't bother with unleveled
      // non-rare off-set pieces no matter how good they are, because they're so unlikely to contribute to a build.
      if (weightedRawArtifactRating < 1) {
        return false;
      }
      // If after a few rolls a weighted rating of 3 means it's either fairly rare, or had exceptionally good rolls. If
      // you've already bothered to roll a non-rare off-set artifact, and it's had very good rolls, we can consider it.
      // TODO: These values probably need to be tuned.
      if (
        artifact.level >= 3 * dataContext.getArtifactLevelsPerSubStatRoll() &&
        weightedRawArtifactRating < 3 &&
        rawArtifactRating < 4
      ) {
        return false;
      }
    }
  }

  return true;
};

export default isArtifactWorthEvaluating;
