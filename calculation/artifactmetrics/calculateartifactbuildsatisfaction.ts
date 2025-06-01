import { IDataContext } from "@/contexts/DataContext";
import { ArtifactMetric, IArtifact, IBuild, SatisfactionCalculationType } from "@/types";

import { calculateBuildSatisfaction, TargetStatsStrategy } from "../buildmetrics/satisfaction";
import { rollArtifact, rollNewArtifact } from "../simulation";
import isArtifactWorthEvaluating from "./isartifactworthevaluating";
import { getArtifactMainStatsFactor } from "./mainstatsfactor";
import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

const getSetBonusFactor = ({
  artifact,
  build,
  calculationType,
  dataContext,
}: {
  artifact: IArtifact;
  build: IBuild;
  calculationType: SatisfactionCalculationType;
  dataContext: IDataContext;
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
    dataContext,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
    desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
  });
};

const getMainStatsFactor = ({
  artifact,
  build,
  calculationType,
  dataContext,
}: {
  artifact: IArtifact;
  build: IBuild;
  calculationType: SatisfactionCalculationType;
  dataContext: IDataContext;
}): number => {
  // Since we're not generating random artifacts, we're already taking into account the current artifact's set and
  // those of the other artifacts on the build, so no need to reduce the factor at all.
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return 1;
  }

  return getArtifactMainStatsFactor({
    artifact,
    dataContext,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
  });
};

const getArtifactsForCalculation = ({
  artifact,
  build,
  calculationType,
  dataContext,
}: {
  artifact: IArtifact;
  build: IBuild;
  calculationType: SatisfactionCalculationType;
  dataContext: IDataContext;
}): Record<string, IArtifact> => {
  const { getArtifactTypes } = dataContext;

  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return Object.fromEntries(
      Object.entries({ ...build.artifacts, [artifact.typeKey]: artifact }).map(([type, artifact]) => [
        type,
        rollArtifact({ artifact, dataContext }),
      ])
    );
  }

  const setIds = build.desiredArtifactSetBonuses.reduce<string[]>((acc, setBonus) => {
    const remainingBonusCount = artifact.setId !== setBonus.setId ? setBonus.bonusCount : setBonus.bonusCount - 1;
    acc.push(...Array(remainingBonusCount).fill(setBonus.setId));
    return acc;
  }, []);

  const artifacts = getArtifactTypes()
    .filter((artifactType) => artifactType.key !== artifact.typeKey)
    .reduce(
      (acc, artifactType) => {
        const newArtifact = rollNewArtifact({
          dataContext,
          mainStatKeys: build.desiredArtifactMainStats[artifactType.key],
          rarity: 5,
          setId: setIds.pop() ?? artifact.setId,
          typeKey: artifactType.key,
        });
        acc[artifactType.key] = rollArtifact({ artifact: newArtifact, dataContext });
        return acc;
      },
      { [artifact.typeKey]: rollArtifact({ artifact, dataContext }) }
    );
  return artifacts;
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

const calculateArtifactBuildSatisfaction = ({
  artifact,
  build,
  calculationType,
  dataContext,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  calculationType: SatisfactionCalculationType;
  dataContext: IDataContext;
  iterations: number;
}): number | undefined => {
  // If the artifact isn't worth evaluating in the context of this build, return 0.
  if (!isArtifactWorthEvaluating({ artifact, build, dataContext, iterations })) {
    return 0;
  }

  // If you've defined a required main stat for this artifact type in your build, and this doesn't match, it's a default 0.
  if (
    build.desiredArtifactMainStats[artifact.typeKey] &&
    !build.desiredArtifactMainStats[artifact.typeKey]?.includes(artifact.mainStatKey)
  ) {
    return 0;
  }

  let satisfactionCount = 0;
  const targetStatsStrategy = getTargetStatsStrategy({ calculationType });
  const setBonusFactor = getSetBonusFactor({ artifact, build, calculationType, dataContext });
  const mainStatsFactor = getMainStatsFactor({ artifact, build, calculationType, dataContext });

  if (setBonusFactor === 0 || mainStatsFactor === 0) {
    // This artifact will never satisfy the requirements of the build.
    return 0;
  }

  for (let i = 0; i < iterations; i++) {
    const artifacts = getArtifactsForCalculation({ artifact, build, calculationType, dataContext });
    const satisfactionResult = calculateBuildSatisfaction({
      artifacts,
      build,
      dataContext,
      targetStatsStrategy,
    });

    // Factor in set bonus requirements into satisfaction result (since they basically weren't considered above).
    satisfactionCount += setBonusFactor * mainStatsFactor * (satisfactionResult.overallSatisfaction ? 1 : 0);
  }
  return satisfactionCount / iterations;
};

export default calculateArtifactBuildSatisfaction;
