import { Artifact, ArtifactMetric, Build } from "@/types";

export const getTopBuilds = ({
  artifact,
  builds,
  metric,
}: {
  artifact: Artifact;
  builds: Build[];
  metric: ArtifactMetric;
}): Build[] => {
  if (!artifact.metricsResults) {
    return [];
  }
  return builds
    .filter((build) => artifact.metricsResults[metric].buildResults[build.characterId])
    .sort(
      (a, b) =>
        artifact.metricsResults[metric].buildResults[b.characterId].result -
        artifact.metricsResults[metric].buildResults[a.characterId].result
    );
};
