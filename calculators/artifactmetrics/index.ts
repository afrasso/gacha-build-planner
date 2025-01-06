import ArtifactMetrics from "@/components/artifacts/ArtifactManager/ArtifactMetrics";
import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactMetric, ArtifactMetricResultMap, ArtifactTier, Build } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { calculateArtifactBuildSatisfaction } from "./calculateartifactbuildsatisfaction";
import { calculatePlusMinusForArtifact, calculateTierRatingForArtifact } from "./index_old";

const calculateMetric = <M extends keyof ArtifactMetricResultMap>({
  artifact,
  build,
  callback,
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  build: Build;
  callback?: (progress: number) => void;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: M;
}): ArtifactMetricResultMap[M] => {
  switch (metric) {
    case ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS:
      return calculateArtifactBuildSatisfaction({
        artifact,
        build,
        calculationType: metric,
        genshinDataContext,
        iterations,
      }) as ArtifactMetricResultMap[M];
    case ArtifactMetric.ROLL_PLUS_MINUS:
      return calculatePlusMinusForArtifact({ artifact, build }) as ArtifactMetricResultMap[M];
    case ArtifactMetric.TIER_RATING:
      return calculateTierRatingForArtifact({ artifact, build }) as ArtifactMetricResultMap[M];
    default:
      throw new Error(`The artifact metric ${metric} is not currently supported.`);
  }
};

export const updateMetrics = ({
  artifact,
  builds,
  callback = () => {},
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  builds: Build[];
  callback: (progress: number) => void;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: ArtifactMetric;
}): void => {
  callback(0);
  for (const [index, build] of builds.entries()) {
    console.log("starting build for " + build.characterId);
    if (!artifact.metrics) {
      artifact.metrics = {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.ROLL_PLUS_MINUS]: {},
        [ArtifactMetric.TIER_RATING]: {},
      };
    }
    const metricResult = artifact.metrics[metric][build.characterId];
    if (
      !metricResult ||
      (artifact.lastUpdatedDate && metricResult.calculatedOn < artifact.lastUpdatedDate) ||
      (build.lastUpdatedDate && metricResult.calculatedOn < build.lastUpdatedDate)
    ) {
      artifact.metrics[metric][build.characterId] = {
        calculatedOn: new Date(),
        result: calculateMetric({ artifact, build, callback, genshinDataContext, iterations, metric }),
      };
    }
    const progress = index / builds.length;
    console.log("progress _should_ be at " + progress);
    callback(progress);
  }
};

export const updateAllMetrics = ({
  artifact,
  builds,
  callback = () => {},
  genshinDataContext,
  iterations,
}: {
  artifact: Artifact;
  builds: Build[];
  callback?: (progress: number) => void;
  genshinDataContext: GenshinDataContext;
  iterations: number;
}): void => {
  callback(0);
  const metrics = getEnumValues(ArtifactMetric);
  for (const [index, metric] of getEnumValues(ArtifactMetric).entries()) {
    console.log("starting metric " + metric);
    updateMetrics({
      artifact,
      builds,
      callback: (p) => (index + p) / metrics.length,
      genshinDataContext,
      iterations,
      metric,
    });
    console.log("finishing metric " + metric);
  }
};
