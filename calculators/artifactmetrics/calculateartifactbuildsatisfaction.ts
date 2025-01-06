import { calculateBuildSatisfaction } from "@/calculators/buildsatisfaction";
import { TargetStatsStrategy } from "@/calculators/buildsatisfaction/types";
import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  Artifact,
  ArtifactMetric,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  BuildArtifacts,
  SatisfactionCalculationType,
} from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { rollArtifact, rollNewArtifact } from "./simulations/rollartifact";

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
        rollArtifact(artifact),
      ])
    );
  }

  const setIds: string[] = [];
  for (const setBonus of build.desiredArtifactSetBonuses) {
    const times = setBonus.bonusType === ArtifactSetBonusType.FOUR_PIECE ? 4 : 2;
    for (let i = 0; i < times; i++) {
      setIds.push(setBonus.setId);
    }
  }

  const artifacts: BuildArtifacts = {
    [artifact.type]: rollArtifact(artifact),
  };
  return getEnumValues(ArtifactType)
    .filter((type) => type !== artifact.type)
    .reduce((acc, type, index) => {
      acc[type] = rollNewArtifact({ rarity: 5, setId: setIds[index] || artifact.setId, type });
      return acc;
    }, artifacts);
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
}): number => {
  let satisfactionCount = 0;
  for (let i = 0; i < iterations; i++) {
    satisfactionCount += calculateBuildSatisfaction({
      artifacts: getArtifactsForCalculation({ artifact, build, calculationType }),
      build,
      genshinDataContext,
      targetStatsStrategy: getTargetStatsStrategy({ calculationType }),
    }).overallSatisfaction
      ? 1
      : 0;
  }
  return satisfactionCount / iterations;
};
