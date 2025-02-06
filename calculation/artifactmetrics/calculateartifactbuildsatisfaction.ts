import { MAIN_STAT_ODDS_BY_ARTIFACT_TYPE } from "@/constants";
import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  Artifact,
  ArtifactMetric,
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
  SatisfactionCalculationType,
  Stat,
} from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { rollArtifact, rollNewArtifact } from "../../simulation/artifact";
import { calculateBuildSatisfaction, TargetStatsStrategy } from "../buildmetrics/satisfaction";

const getArtifactSetBonusFactor = ({
  artifact,
  calculationType,
  desiredArtifactSetBonuses,
}: {
  artifact: Artifact;
  calculationType: SatisfactionCalculationType;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
}): number => {
  // Since we're not generating random artifacts, we're already taking into account the current artifact's set and
  // those of the other artifacts on the build, so no need to reduce the factor at all.
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return 1;
  }

  // If the artifact matches one of the sets that's required, we also don't need to reduce the factor.
  if (desiredArtifactSetBonuses.map((bonus) => bonus.setId).includes(artifact.setId)) {
    return 1;
  }

  // Otherwise, reduce the factor by the number of other artifacts that are required to meet the desired set bonuses.
  const requiredMatchingArtifactCount = desiredArtifactSetBonuses.reduce((result, bonus) => {
    result += bonus.bonusType === ArtifactSetBonusType.FOUR_PIECE ? 4 : 2;
    return result;
  }, 0);
  const factor = (5 - requiredMatchingArtifactCount) / 5;
  return factor;
};

const getArtifactMainStatFactorForType = ({
  artifact,
  artifactType,
  mainStat,
}: {
  artifact: Artifact;
  artifactType: ArtifactType;
  mainStat?: Stat;
}): number => {
  if (!mainStat) {
    return 1;
  }
  if (artifact.type === artifactType) {
    return 1;
  }
  const factor = MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[artifactType][mainStat];
  if (!factor) {
    throw new Error(
      `Unexpected error: could not find odds for main stat ${mainStat} on artifact type ${artifactType}.`
    );
  }
  return factor;
};

const getArtifactMainStatFactor = ({
  artifact,
  calculationType,
  desiredArtifactMainStats,
}: {
  artifact: Artifact;
  calculationType: SatisfactionCalculationType;
  desiredArtifactMainStats: DesiredArtifactMainStats;
}): number => {
  // Since we're not generating random artifacts, we're already taking into account the current artifact's set and
  // those of the other artifacts on the build, so no need to reduce the factor at all.
  if (
    calculationType === ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS ||
    calculationType === ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  ) {
    return 1;
  }

  const factor = [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS].reduce((acc, artifactType) => {
    acc =
      acc *
      getArtifactMainStatFactorForType({ artifact, artifactType, mainStat: desiredArtifactMainStats[artifactType] });
    return acc;
  }, 1);
  return factor;
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
        const mainStat = build.desiredArtifactMainStats[type];
        acc[type] = rollNewArtifact({ level: 20, mainStat, rarity: 5, setId: artifact.setId, type });
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
    build.desiredArtifactMainStats[artifact.type] !== artifact.mainStat
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
      ignoreSetBonuses: true,
      targetStatsStrategy,
    });

    // Factor in set bonus requirements into satisfaction result (since they basically weren't considered above).
    const setBonusFactor = getArtifactSetBonusFactor({
      artifact,
      calculationType,
      desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
    });
    const mainStatFactor = getArtifactMainStatFactor({
      artifact,
      calculationType,
      desiredArtifactMainStats: build.desiredArtifactMainStats,
    });
    satisfactionCount += setBonusFactor * mainStatFactor * (satisfactionResult.overallSatisfaction ? 1 : 0);
  }
  return satisfactionCount / iterations;
};
