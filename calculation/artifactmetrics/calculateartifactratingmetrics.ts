import { IDataContext } from "@/contexts/DataContext";
import { IArtifact, IBuild } from "@/types";

import { rollArtifact } from "../simulation";
import calculateArtifactRating from "./calculateartifactrating";
import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

const calculateArtifactRatingMetrics = ({
  artifact,
  build,
  dataContext,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  iterations: number;
}): {
  plusMinus: number;
  positivePlusMinusOdds: number;
  rating: number;
} => {
  const rawArtifactRating = calculateArtifactRating({ artifact, build, dataContext });
  const buildArtifact = build.artifacts[artifact.typeKey];
  const buildArtifactRating = buildArtifact.metricsResults.RATING.buildResults[build.characterId];

  if (artifact !== buildArtifact && (!buildArtifactRating.result || buildArtifactRating.iterations !== iterations)) {
    // We should always have a rating for the build artifact before getting a rating for a non-build artifact for the
    // given build. If we don't throw an error.
    throw new Error("Unexpected error: the build artifact doesn't have an available rating.");
  }

  const rawBuildArtifactRating = buildArtifact ? calculateArtifactRating({ artifact, build, dataContext }) : 0;

  if (
    // If the rating is 0 (doesn't match a required main stat), no calculations are needed.
    rawArtifactRating === 0 ||
    // If there already exists a build artifact that has a rating of, 1 and there's at least one desired main stat, in
    // order to not skip this artifact it needs to have a rawArtifactRating of greater than 1.
    (rawBuildArtifactRating > 0 && build.desiredOverallStats.length > 0 && rawArtifactRating === 1)
  ) {
    return {
      plusMinus: 0,
      positivePlusMinusOdds: 0,
      rating: 0,
    };
  }

  const weightedFactor = getWeightedArtifactSetBonusFactor({
    artifact,
    dataContext,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
    desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
  });

  let totalRating = 0;
  let totalPlusMinus = 0;
  let positivePlusMinusCount = 0;
  for (let i = 0; i < iterations; i++) {
    const rolledArtifact = rollArtifact({ artifact, dataContext });
    const artifactRating = calculateArtifactRating({ artifact: rolledArtifact, build, dataContext });
    totalRating += artifactRating;
    // If the current artifact is the build artifact, totalPlusMinus and PositivePlusMinusCount will by definition be 0.
    if (artifact !== buildArtifact) {
      totalPlusMinus += artifactRating - buildArtifactRating.result!;
      positivePlusMinusCount += artifactRating > buildArtifactRating.result! ? 1 : 0;
    }
  }

  return {
    plusMinus: (weightedFactor * totalPlusMinus) / iterations,
    positivePlusMinusOdds: (weightedFactor * positivePlusMinusCount) / iterations,
    rating: (weightedFactor * totalRating) / iterations,
  };
};

export default calculateArtifactRatingMetrics;
