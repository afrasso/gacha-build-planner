import { isRatingMetric, RATING_METRICS } from "@/constants/artifactmetricsettings";
import { IDataContext } from "@/contexts/DataContext";
import { ArtifactMetric, ArtifactMetricResult, IArtifact, IBuild } from "@/types";
import getEnumValues from "@/utils/getenumvalues";

import calculateArtifactBuildSatisfaction from "./calculateartifactbuildsatisfaction";
import calculateArtifactRatingMetrics from "./calculateartifactratingmetrics";
import getMaxMetricValue from "./getmaxmetricvalue";

export type MetricUpdateProgressCallback = (progress: number) => boolean | Promise<boolean | void> | void;

const doesMetricNeedUpdate = ({
  artifact,
  build,
  iterations,
  result,
}: {
  artifact: IArtifact;
  build: IBuild;
  iterations: number;
  result?: ArtifactMetricResult;
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

const writeRatingMetricResults = ({
  artifact,
  build,
  enabledRatingMetrics,
  iterations,
  plusMinus,
  positivePlusMinusOdds,
  rating,
}: {
  artifact: IArtifact;
  build: IBuild;
  enabledRatingMetrics: ArtifactMetric[];
  iterations: number;
  plusMinus: number;
  positivePlusMinusOdds: number;
  rating: number;
}): void => {
  const calculatedOn = new Date().toISOString();
  const enabledSet = new Set(enabledRatingMetrics);

  if (enabledSet.has(ArtifactMetric.RATING)) {
    artifact.metricsResults[ArtifactMetric.RATING].buildResults[build.characterId] = {
      calculatedOn,
      iterations,
      result: rating,
    };
  }
  if (enabledSet.has(ArtifactMetric.PLUS_MINUS)) {
    artifact.metricsResults[ArtifactMetric.PLUS_MINUS].buildResults[build.characterId] = {
      calculatedOn,
      iterations,
      result: plusMinus,
    };
  }
  if (enabledSet.has(ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS)) {
    artifact.metricsResults[ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS].buildResults[build.characterId] = {
      calculatedOn,
      iterations,
      result: positivePlusMinusOdds,
    };
  }
};

const ensureBuildArtifactRating = async ({
  artifact,
  build,
  buildArtifact,
  dataContext,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  buildArtifact: IArtifact;
  dataContext: IDataContext;
  iterations: number;
}): Promise<void> => {
  if (artifact === buildArtifact) {
    return;
  }
  await updateMetric({
    artifact: buildArtifact,
    build,
    dataContext,
    enabledRatingMetrics: [ArtifactMetric.RATING],
    iterations,
    metric: ArtifactMetric.RATING,
  });
};

const updateRatingMetricsForBuild = async ({
  artifact,
  build,
  dataContext,
  enabledRatingMetrics,
  forceRecalculate = false,
  iterations,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  enabledRatingMetrics: ArtifactMetric[];
  forceRecalculate?: boolean;
  iterations: number;
}): Promise<void> => {
  const buildArtifact = build.artifacts[artifact.typeKey];
  if (buildArtifact) {
    await ensureBuildArtifactRating({ artifact, build, buildArtifact, dataContext, iterations });
  }

  const needsUpdate =
    forceRecalculate ||
    enabledRatingMetrics.some((metric) =>
      doesMetricNeedUpdate({
        artifact,
        build,
        iterations,
        result: artifact.metricsResults[metric].buildResults[build.characterId],
      }),
    );

  if (!needsUpdate) {
    return;
  }

  if (forceRecalculate) {
    for (const metric of enabledRatingMetrics) {
      clearMetric({ artifact, build, metric });
    }
  }

  const { plusMinus, positivePlusMinusOdds, rating } = calculateArtifactRatingMetrics({
    artifact,
    build,
    dataContext,
    iterations,
  });

  writeRatingMetricResults({
    artifact,
    build,
    enabledRatingMetrics,
    iterations,
    plusMinus,
    positivePlusMinusOdds,
    rating,
  });
};

export const updateMetric = async ({
  artifact,
  build,
  dataContext,
  enabledRatingMetrics = [...RATING_METRICS],
  forceRecalculate = false,
  iterations,
  metric,
}: {
  artifact: IArtifact;
  build: IBuild;
  dataContext: IDataContext;
  enabledRatingMetrics?: ArtifactMetric[];
  forceRecalculate?: boolean;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  if (forceRecalculate) {
    clearMetric({ artifact, build, metric });
  }
  const result = artifact.metricsResults[metric].buildResults[build.characterId];
  if (doesMetricNeedUpdate({ artifact, build, iterations, result })) {
    const buildArtifact = build.artifacts[artifact.typeKey];
    if (buildArtifact) {
      await ensureBuildArtifactRating({ artifact, build, buildArtifact, dataContext, iterations });
    }
    if (isRatingMetric(metric)) {
      await updateRatingMetricsForBuild({
        artifact,
        build,
        dataContext,
        enabledRatingMetrics,
        forceRecalculate,
        iterations,
      });
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
  callback?: MetricUpdateProgressCallback;
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
    await updateMetric({ artifact, build, dataContext, iterations, metric });
    const progress = (index + 1) / builds.length;
    await callback(progress);
  }
};

export const updateAllMetrics = async ({
  artifact,
  builds,
  callback = () => {},
  dataContext,
  enabledMetrics = getEnumValues(ArtifactMetric),
  forceRecalculate = false,
  iterations,
}: {
  artifact: IArtifact;
  builds: IBuild[];
  callback?: MetricUpdateProgressCallback;
  dataContext: IDataContext;
  enabledMetrics?: ArtifactMetric[];
  forceRecalculate?: boolean;
  iterations: number;
}): Promise<void> => {
  if (forceRecalculate) {
    clearAllMetrics({ artifact, builds });
  }

  const enabledRatingMetrics = enabledMetrics.filter(isRatingMetric);
  const enabledSatisfactionMetrics = enabledMetrics.filter((metric) => !isRatingMetric(metric));
  const workUnitCount = (enabledRatingMetrics.length > 0 ? 1 : 0) + enabledSatisfactionMetrics.length;

  if (workUnitCount === 0) {
    return;
  }

  let completedUnits = 0;

  if (enabledRatingMetrics.length > 0) {
    if (forceRecalculate) {
      for (const metric of enabledRatingMetrics) {
        clearMetrics({ artifact, builds, metric });
      }
    }
    await callback(0);
    for (const [index, build] of builds.entries()) {
      await updateRatingMetricsForBuild({
        artifact,
        build,
        dataContext,
        enabledRatingMetrics,
        forceRecalculate,
        iterations,
      });
      await callback((completedUnits + (index + 1) / builds.length) / workUnitCount);
    }
    for (const metric of enabledRatingMetrics) {
      artifact.metricsResults[metric].maxValue = getMaxMetricValue({ metric, metricsResults: artifact.metricsResults });
    }
    completedUnits += 1;
  }

  for (const metric of enabledSatisfactionMetrics) {
    await updateMetrics({
      artifact,
      builds,
      callback: async (p) => await callback((completedUnits + p) / workUnitCount),
      dataContext,
      forceRecalculate,
      iterations,
      metric,
    });
    artifact.metricsResults[metric].maxValue = getMaxMetricValue({ metric, metricsResults: artifact.metricsResults });
    completedUnits += 1;
  }
};
