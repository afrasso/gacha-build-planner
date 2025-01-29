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

import { rollArtifact, rollNewArtifact } from "../../simulation/artifact";
import { calculateBuildSatisfaction, TargetStatsStrategy } from "../buildmetrics/satisfaction";

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

  const setIds: string[] = [];
  for (const setBonus of build.desiredArtifactSetBonuses) {
    const times = setBonus.bonusType === ArtifactSetBonusType.FOUR_PIECE ? 4 : 2;
    for (let i = 0; i < times; i++) {
      setIds.push(setBonus.setId);
    }
  }

  const artifacts: BuildArtifacts = {
    [artifact.type]: rollArtifact({ artifact }),
  };
  return getEnumValues(ArtifactType)
    .filter((type) => type !== artifact.type)
    .reduce((acc, type, index) => {
      acc[type] = rollNewArtifact({ level: 20, rarity: 5, setId: setIds[index] || artifact.setId, type });
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
}): number | undefined => {
  if (
    !build.desiredArtifactMainStats ||
    Object.values(build.desiredArtifactMainStats).every((stat) => !stat) ||
    !build.desiredStats ||
    build.desiredStats.length === 0
  ) {
    return;
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
    satisfactionCount += satisfactionResult.overallSatisfaction ? 1 : 0;
  }
  return satisfactionCount / iterations;
};
