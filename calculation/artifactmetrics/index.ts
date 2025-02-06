import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactMetric, ArtifactMetricResult, Build } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { calculateArtifactBuildSatisfaction } from "./calculateartifactbuildsatisfaction";
import { calculateArtifactRatingMetrics } from "./calculateartifactrating";
import { getMaxMetricValue } from "./getmaxmetricvalue";

const determineIfMetricNeedsUpdate = ({
  artifact,
  build,
  iterations,
  result,
}: {
  artifact: Artifact;
  build: Build;
  iterations: number;
  result: ArtifactMetricResult;
}): boolean => {
  return (
    !result ||
    result.calculatedOn < artifact.lastUpdatedDate ||
    result.calculatedOn < build.lastUpdatedDate ||
    result.iterations < iterations
  );
};

export const updateMetric = async ({
  artifact,
  build,
  forceRecalculate = false,
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  build: Build;
  forceRecalculate?: boolean;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  const result = artifact.metricsResults[metric].buildResults[build.characterId];
  const needsUpdate = determineIfMetricNeedsUpdate({ artifact, build, iterations, result });
  if (forceRecalculate || needsUpdate) {
    if (
      metric === ArtifactMetric.RATING ||
      metric === ArtifactMetric.PLUS_MINUS ||
      metric === ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS
    ) {
      const { plusMinus, positivePlusMinusOdds, rating } = calculateArtifactRatingMetrics({
        artifact,
        build,
        iterations,
      });
      artifact.metricsResults[ArtifactMetric.RATING].buildResults[build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: rating,
      };
      artifact.metricsResults[ArtifactMetric.PLUS_MINUS].buildResults[build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: plusMinus,
      };
      artifact.metricsResults[ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS].buildResults[build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: positivePlusMinusOdds,
      };
    } else {
      const satisfaction = calculateArtifactBuildSatisfaction({
        artifact,
        build,
        calculationType: metric,
        genshinDataContext,
        iterations,
      });
      artifact.metricsResults[metric].buildResults[build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: satisfaction,
      };
    }
  }
};

export const updateMetrics = async ({
  artifact,
  builds,
  callback = () => {},
  forceRecalculate = false,
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  builds: Build[];
  callback?: (progress: number) => void;
  forceRecalculate?: boolean;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  await callback(0);
  for (const [index, build] of builds.entries()) {
    updateMetric({ artifact, build, forceRecalculate, genshinDataContext, iterations, metric });
    const progress = (index + 1) / builds.length;
    await callback(progress);
  }
};

export const updateAllMetrics = async ({
  artifact,
  builds,
  callback = () => {},
  forceRecalculate = false,
  genshinDataContext,
  iterations,
}: {
  artifact: Artifact;
  builds: Build[];
  callback?: (progress: number) => void;
  forceRecalculate?: boolean;
  genshinDataContext: GenshinDataContext;
  iterations: number;
}): Promise<void> => {
  const metrics = getEnumValues(ArtifactMetric);
  for (const [index, metric] of getEnumValues(ArtifactMetric).entries()) {
    await updateMetrics({
      artifact,
      builds,
      callback: async (p) => await callback((index + p) / metrics.length),
      forceRecalculate,
      genshinDataContext,
      iterations,
      metric,
    });
    artifact.metricsResults[metric].maxValue = getMaxMetricValue({ metric, metricsResults: artifact.metricsResults });
  }
};
