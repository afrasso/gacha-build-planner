import { IDataContext } from "@/contexts/DataContext";
import { IArtifact, IBuild } from "@/types";

import { rollArtifact } from "../simulation";
import calculateArtifactRating from "./calculateartifactrating";
import isArtifactWorthEvaluating from "./isartifactworthevaluating";
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
  // const rawArtifactRating = calculateArtifactRating({ artifact, build, dataContext });
  const buildArtifact = build.artifacts[artifact.typeKey];

  // Initialize the build artifact rating to either itself, or if there is no build artifact, to 0.
  const buildArtifactRating = buildArtifact
    ? buildArtifact?.metricsResults.RATING.buildResults[build.characterId]
    : { iterations, result: 0 };

  // If the artifact isn't worth evaluating in the context of this build, return 0 for all three metrics.
  if (!isArtifactWorthEvaluating({ artifact, build, dataContext, iterations })) {
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
