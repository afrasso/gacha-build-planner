import { IDataContext } from "@/contexts/DataContext";
import { ArtifactMetric, ArtifactMetricResult, IArtifact, IBuild } from "@/types";
import getEnumValues from "@/utils/getenumvalues";

import calculateArtifactBuildSatisfaction from "./calculateartifactbuildsatisfaction";
import calculateArtifactRatingMetrics from "./calculateartifactratingmetrics";
import getMaxMetricValue from "./getmaxmetricvalue";

const doesMetricNeedUpdate = ({
  artifact,
  build,
  iterations,
  result,
}: {
  artifact: IArtifact;
  build: IBuild;
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

export const clearMetric = ({
  artifact,
  build,
  metric,
}: {
  artifact: IArtifact;
  build: IBuild;
  metric: ArtifactMetric;
}): void => {
  delete artifact.metricsResults[metric].buildResults[build.characterId];
};

export const clearMetrics = ({
  artifact,
  builds,
  metric,
}: {
  artifact: IArtifact;
  builds: IBuild[];
  metric: ArtifactMetric;
}): void => {
  for (const build of builds) {
    clearMetric({ artifact, build, metric });
  }
};

export const clearAllMetrics = ({ artifact, builds }: { artifact: IArtifact; builds: IBuild[] }): void => {
  const metrics = getEnumValues(ArtifactMetric);
  for (const metric of metrics) {
    clearMetrics({ artifact, builds, metric });
  }
};

export const updateMetric = async ({
  artifact,
  build,
  dataContext,
  forceRecalculate = false,
  iterations,
  metric,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  forceRecalculate?: boolean;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  if (forceRecalculate) {
    clearMetric({ artifact, build, metric });
  }
  const result = artifact.metricsResults[metric].buildResults[build.characterId];
  if (doesMetricNeedUpdate({ artifact, build, iterations, result })) {
    // We need the rating of the build artifact (if it exists) prior to calculating any metric for the artifact to
    // determine whether the artifact itself is worth the expense of evaluating.
    const buildArtifact = build.artifacts[artifact.typeKey];
    if (buildArtifact && artifact !== buildArtifact) {
      updateMetric({ artifact: buildArtifact, build, dataContext, iterations, metric: ArtifactMetric.RATING });
    }
    if (
      metric === ArtifactMetric.RATING ||
      metric === ArtifactMetric.PLUS_MINUS ||
      metric === ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS
    ) {
      const buildArtifact = build.artifacts[artifact.typeKey];
      if (buildArtifact && artifact !== buildArtifact) {
        updateMetric({ artifact: buildArtifact, build, dataContext, iterations, metric });
      }
      const { plusMinus, positivePlusMinusOdds, rating } = calculateArtifactRatingMetrics({
        artifact,
        build,
        dataContext,
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
        dataContext,
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
  dataContext,
  forceRecalculate = false,
  iterations,
  metric,
}: {
  artifact: IArtifact;
  builds: IBuild[];
  callback?: (progress: number) => void;
  dataContext: IDataContext;
  forceRecalculate?: boolean;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  if (forceRecalculate) {
    clearMetrics({ artifact, builds, metric });
  }
  await callback(0);
  for (const [index, build] of builds.entries()) {
    updateMetric({ artifact, build, dataContext, iterations, metric });
    const progress = (index + 1) / builds.length;
    await callback(progress);
  }
};

export const updateAllMetrics = async ({
  artifact,
  builds,
  callback = () => {},
  dataContext,
  forceRecalculate = false,
  iterations,
}: {
  artifact: IArtifact;
  builds: IBuild[];
  callback?: (progress: number) => void;
  dataContext: IDataContext;
  forceRecalculate?: boolean;
  iterations: number;
}): Promise<void> => {
  if (forceRecalculate) {
    clearAllMetrics({ artifact, builds });
  }
  const metrics = getEnumValues(ArtifactMetric);
  for (const [index, metric] of metrics.entries()) {
    await updateMetrics({
      artifact,
      builds,
      callback: async (p) => await callback((index + p) / metrics.length),
      dataContext,
      iterations,
      metric,
    });
    artifact.metricsResults[metric].maxValue = getMaxMetricValue({ metric, metricsResults: artifact.metricsResults });
  }
};
