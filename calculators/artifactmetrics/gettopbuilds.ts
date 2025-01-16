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
  return builds.sort((a, b) => {
    if (!artifact.metricResults) {
      return 0;
    }
    const resultA = artifact.metricResults[metric][a.characterId].result;
    const resultB = artifact.metricResults[metric][b.characterId].result;

    if (typeof resultA === "number" && typeof resultB === "number") {
      return resultB - resultA;
    } else if (typeof resultA === "string" && typeof resultB === "string") {
      return resultB.localeCompare(resultA);
    } else {
      throw new Error("Inconsistent types for metric results.");
    }
  });
};
