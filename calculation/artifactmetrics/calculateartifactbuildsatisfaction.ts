import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactMetric, ArtifactType, Build, BuildArtifacts, SatisfactionCalculationType } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { calculateBuildSatisfaction, TargetStatsStrategy } from "../buildmetrics/satisfaction";
import { rollArtifact, rollNewArtifact } from "../simulation";
import { getArtifactMainStatsFactor } from "./mainstatsfactor";
import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

const getSetBonusFactor = ({
  artifact,
  build,
  calculationType,
}: {
  artifact: Artifact;
  build: Build;
  calculationType: SatisfactionCalculationType;
}): number => {
  // Since we're not generating random artifacts, we're already taking into account the current artifact's set and
  // those of the other artifacts on the build, so no need to reduce the factor at all.
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return 1;
  }

  return getWeightedArtifactSetBonusFactor({
    artifact,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
    desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
  });
};

const getMainStatsFactor = ({
  artifact,
  build,
  calculationType,
}: {
  artifact: Artifact;
  build: Build;
  calculationType: SatisfactionCalculationType;
}): number => {
  // Since we're not generating random artifacts, we're already taking into account the current artifact's set and
  // those of the other artifacts on the build, so no need to reduce the factor at all.
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return 1;
  }

  return getArtifactMainStatsFactor({ artifact, desiredArtifactMainStats: build.desiredArtifactMainStats });
};

const getArtifactsForCalculation = ({
  artifact,
  build,
  calculationType,
}: {
  artifact: Artifact;
  build: Build;
  calculationType: SatisfactionCalculationType;
}): BuildArtifacts => {
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return Object.fromEntries(
      Object.entries({ ...build.artifacts, [artifact.type]: artifact }).map(([type, artifact]) => [
        type,
        rollArtifact({ artifact }),
      ])
    );
  }

  return getEnumValues(ArtifactType)
    .filter((type) => type !== artifact.type)
    .reduce(
      (acc, type) => {
        acc[type] = rollNewArtifact({
          level: 20,
          mainStats: build.desiredArtifactMainStats[type],
          rarity: 5,
          setId: artifact.setId,
          type,
        });
        return acc;
      },
      { [artifact.type]: rollArtifact({ artifact }) }
    );
};

const getTargetStatsStrategy = ({ calculationType }: { calculationType: SatisfactionCalculationType }) => {
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS
  ) {
    return TargetStatsStrategy.CURRENT;
  }
  return TargetStatsStrategy.DESIRED;
};

export const calculateArtifactBuildSatisfaction = ({
  artifact,
  build,
  calculationType,
  genshinDataContext,
  iterations,
}: {
  artifact: Artifact;
  build: Build;
  calculationType: SatisfactionCalculationType;
  genshinDataContext: GenshinDataContext;
  iterations: number;
}): number | undefined => {
  // If you've defined a required main stat for this artifact type in your build, and this doesn't match, it's a default 0.
  if (
    build.desiredArtifactMainStats[artifact.type] &&
    !build.desiredArtifactMainStats[artifact.type]?.includes(artifact.mainStat)
  ) {
    return 0;
  }

  let satisfactionCount = 0;
  const targetStatsStrategy = getTargetStatsStrategy({ calculationType });
  for (let i = 0; i < iterations; i++) {
    const artifacts = getArtifactsForCalculation({ artifact, build, calculationType });
    const satisfactionResult = calculateBuildSatisfaction({
      artifacts,
      build,
      genshinDataContext,
      targetStatsStrategy,
    });

    // Factor in set bonus requirements into satisfaction result (since they basically weren't considered above).
    const setBonusFactor = getSetBonusFactor({ artifact, build, calculationType });
    const mainStatsFactor = getMainStatsFactor({ artifact, build, calculationType });
    satisfactionCount += setBonusFactor * mainStatsFactor * (satisfactionResult.overallSatisfaction ? 1 : 0);
  }
  return satisfactionCount / iterations;
};
