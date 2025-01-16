import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactMetric, ArtifactMetricResultMap, Build } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { calculateArtifactBuildSatisfaction } from "./calculateartifactbuildsatisfaction";
import { calculateArtifactPlusMinus } from "./calculateartifactplusminus";
import { calculateArtifactTierRating } from "./calculateartifacttierrating";

const calculateMetric = <M extends keyof ArtifactMetricResultMap>({
  artifact,
  build,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      return calculateArtifactPlusMinus({ artifact, build, iterations }) as ArtifactMetricResultMap[M];
    case ArtifactMetric.TIER_RATING:
      return calculateArtifactTierRating({ artifact, build, iterations }) as ArtifactMetricResultMap[M];
    default:
      throw new Error(`The artifact metric ${metric} is not currently supported.`);
  }
};

export const updateMetrics = async ({
  artifact,
  builds,
  callback = () => {},
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  builds: Build[];
  callback?: (progress: number) => void;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  await callback(0);
  for (const [index, build] of builds.entries()) {
    if (!artifact.metricResults) {
      artifact.metricResults = {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.ROLL_PLUS_MINUS]: {},
        [ArtifactMetric.TIER_RATING]: {},
      };
    }
    const metricResult = artifact.metricResults[metric][build.characterId];
    if (
      !metricResult ||
      (artifact.lastUpdatedDate && metricResult.calculatedOn < artifact.lastUpdatedDate) ||
      (build.lastUpdatedDate && metricResult.calculatedOn < build.lastUpdatedDate)
    ) {
      artifact.metricResults[metric][build.characterId] = {
        calculatedOn: new Date(),
        result: calculateMetric({ artifact, build, callback, genshinDataContext, iterations, metric }),
      };
    }
    const progress = (index + 1) / builds.length;
    await callback(progress);
  }
};

export const updateAllMetrics = async ({
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
}): Promise<void> => {
  const metrics = getEnumValues(ArtifactMetric);
  for (const [index, metric] of getEnumValues(ArtifactMetric).entries()) {
    await updateMetrics({
      artifact,
      builds,
      callback: async (p) => await callback((index + p) / metrics.length),
      genshinDataContext,
      iterations,
      metric,
    });
  }
};
