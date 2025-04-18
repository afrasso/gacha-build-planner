import { IDataContext } from "@/contexts/DataContext";
import { DesiredOverallStat, IArtifact, IBuild } from "@/types";

import { rollArtifact } from "../simulation";
import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

const PRIORITY_WEIGHTS: Record<number, number> = {
  1: 0.25,
  2: 0.5,
  3: 1,
};

const calculateSubstatRating = ({
  artifact,
  dataContext,
  desiredOverallStat,
}: {
  artifact: IArtifact;
  dataContext: IDataContext;
  desiredOverallStat: DesiredOverallStat;
}): number => {
  const { getPossibleArtifactSubStatRollValues, getStatDefinitions } = dataContext;

  let rating = 0;

  const calculateSubstatRollValue = ({ overallStatKey, statKey }: { overallStatKey: string; statKey: string }) => {
    if (desiredOverallStat.stat.key !== overallStatKey) {
      return;
    }
    const subStatValue = artifact.subStats.find((subStat) => subStat.key === statKey);
    if (!subStatValue) {
      return;
    }
    const maxRoll = Math.max(
      ...getPossibleArtifactSubStatRollValues({ rarity: artifact.rarity, subStatKey: subStatValue.key })
    );
    rating += (PRIORITY_WEIGHTS[desiredOverallStat.priority] * subStatValue.value) / maxRoll;
  };

  getStatDefinitions().forEach((statDefinition) => {
    calculateSubstatRollValue({ overallStatKey: statDefinition.overallStatKey, statKey: statDefinition.key });
  });

  return rating;
};

const calculateRating = ({
  artifact,
  build,
  dataContext,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
}): number => {
  // If the build requires a specific main stat, and the current artifact doesn't have it, the artifact has no value.
  if (
    build.desiredArtifactMainStats[artifact.typeKey] &&
    !build.desiredArtifactMainStats[artifact.typeKey]?.includes(artifact.mainStatKey)
  ) {
    return 0;
  }

  const rolledArtifact = rollArtifact({ artifact, dataContext });

  // TODO: The max rating is actually based on the build criteria. At some point we can make the rating relative to max
  // possible rating given the build's desired stats.
  const initialRating = 1;
  return build.desiredOverallStats.reduce((total, desiredOverallStat) => {
    total += calculateSubstatRating({ artifact: rolledArtifact, dataContext, desiredOverallStat });
    return total;
  }, initialRating);
};

export interface ArtifactRatingMetricsResults {
  plusMinus: number;
  positivePlusMinusOdds: number;
  rating: number;
}

export const calculateArtifactRatingMetrics = ({
  artifact,
  build,
  dataContext,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  iterations: number;
}): ArtifactRatingMetricsResults => {
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
    const artifactRating = calculateRating({ artifact, build, dataContext });
    const buildArtifact = build.artifacts[artifact.typeKey];
    const buildArtifactRating = buildArtifact ? calculateRating({ artifact: buildArtifact, build, dataContext }) : 0;
    totalRating += artifactRating;
    totalPlusMinus += artifactRating - buildArtifactRating;
    positivePlusMinusCount += artifactRating > buildArtifactRating ? 1 : 0;
  }

  return {
    plusMinus: (weightedFactor * totalPlusMinus) / iterations,
    positivePlusMinusOdds: (weightedFactor * positivePlusMinusCount) / iterations,
    rating: (weightedFactor * totalRating) / iterations,
  };
};
