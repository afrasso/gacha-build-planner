import { ArtifactMetric, IArtifact, IBuild } from "@/types";

export const getTopArtifacts = ({
  artifacts,
  build,
  metric,
}: {
  artifacts: IArtifact[];
  build: IBuild;
  metric: ArtifactMetric;
}): IArtifact[] => {
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
