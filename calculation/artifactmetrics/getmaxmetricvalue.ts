import { ArtifactMetric, ArtifactMetricResults } from "@/types";

export const getMaxMetricValue = ({
  metric,
  results,
}: {
  metric: ArtifactMetric;
  results: ArtifactMetricResults;
}): number | undefined => {
  if (!results?.[metric]) {
    return;
  }
  return Math.max(...Object.values(results[metric]).map((result) => result.result || 0));
};
