import { Artifact, ArtifactMetric, Build } from "@/types";

export const getTopArtifacts = ({
  artifacts,
  build,
  metric,
}: {
  artifacts: Artifact[];
  build: Build;
  metric: ArtifactMetric;
}): Artifact[] => {
  return artifacts
    .filter((artifact) => {
      const results = artifact.metricsResults[metric].buildResults[build.characterId];
      return results && results.result && results.result > 0;
    })
    .sort((a, b) => {
      const aResult = a.metricsResults[metric].buildResults[build.characterId].result;
      const bResult = b.metricsResults[metric].buildResults[build.characterId].result;
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
