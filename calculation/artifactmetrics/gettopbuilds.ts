import { IArtifact, ArtifactMetric, IBuild } from "@/types";

export const getTopBuilds = ({
  artifact,
  builds,
  metric,
}: {
  artifact: IArtifact;
  builds: IBuild[];
  metric: ArtifactMetric;
}): IBuild[] => {
  if (!artifact.metricsResults) {
    return [];
  }
  return builds
    .filter((build) => artifact.metricsResults[metric].buildResults[build.characterId])
    .sort((a, b) => {
      const aResult = artifact.metricsResults[metric].buildResults[a.characterId].result;
      const bResult = artifact.metricsResults[metric].buildResults[b.characterId].result;
      if (!aResult && !bResult) {
        return 0;
      }
      if (!aResult) {
        return 1;
      }
      if (!bResult) {
        return -1;
      }
      return bResult - aResult;
    });
};
