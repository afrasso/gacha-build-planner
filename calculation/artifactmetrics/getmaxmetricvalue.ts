import { ArtifactMetric, ArtifactMetricsResults } from "@/types";

const getMaxMetricValue = ({
  metric,
  metricsResults,
}: {
  metric: ArtifactMetric;
  metricsResults: ArtifactMetricsResults;
}): number | undefined => {
  if (!metricsResults?.[metric]) {
    return;
  }
  const values = Object.values(metricsResults?.[metric].buildResults);
  if (!values || values.length === 0) {
    return;
  }
  return Math.max(...values.map((result) => result.result || 0));
};

export default getMaxMetricValue;
