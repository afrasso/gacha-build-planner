import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactMetric, ArtifactMetricResult, Build } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import { calculateArtifactBuildSatisfaction } from "./calculateartifactbuildsatisfaction";
import { calculateArtifactRating } from "./calculateartifactrating";

const needsUpdate = ({
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
  genshinDataContext,
  iterations,
  metric,
}: {
  artifact: Artifact;
  build: Build;
  genshinDataContext: GenshinDataContext;
  iterations: number;
  metric: ArtifactMetric;
}): Promise<void> => {
  const result = artifact.metricResults[metric][build.characterId];
  if (needsUpdate({ artifact, build, iterations, result })) {
    if (metric === ArtifactMetric.RATING || metric === ArtifactMetric.PLUS_MINUS) {
      const artifactRating = calculateArtifactRating({ artifact, build, iterations });
      const buildArtifact = build.artifacts[artifact.type];
      const buildArtifactRating = buildArtifact
        ? calculateArtifactRating({ artifact: buildArtifact, build, iterations })
        : 0;
      artifact.metricResults[ArtifactMetric.RATING][build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: artifactRating,
      };
      artifact.metricResults[ArtifactMetric.PLUS_MINUS][build.characterId] = {
        calculatedOn: new Date().toISOString(),
        iterations,
        result: artifactRating - buildArtifactRating,
      };
    } else {
      const satisfaction = calculateArtifactBuildSatisfaction({
        artifact,
        build,
        calculationType: metric,
        genshinDataContext,
        iterations,
      });
      if (satisfaction) {
        artifact.metricResults[metric][build.characterId] = {
          calculatedOn: new Date().toISOString(),
          iterations,
          result: satisfaction,
        };
      }
    }
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
    updateMetric({ artifact, build, genshinDataContext, iterations, metric });
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
