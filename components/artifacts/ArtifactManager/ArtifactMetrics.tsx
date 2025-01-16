import { getMaxMetricValue } from "@/calculators/artifactmetrics/getmaxmetricvalue";
import { Artifact, ArtifactMetric, ArtifactMetricResults } from "@/types";

interface ArtifactMetricsProps {
  metricResults: ArtifactMetricResults;
}

const ArtifactMetrics: React.FC<ArtifactMetricsProps> = ({ metricResults }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Artifact Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Build Satisfaction for Current Stats with Current Artifacts"
          value={getMaxMetricValue({
            results: metricResults,
            metric: ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
          })}
        />
        <MetricCard
          title="Overall Potential Build Satisfaction for Current Stats"
          value={getMaxMetricValue({
            results: metricResults,
            metric: ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS,
          })}
        />
        <MetricCard
          title="Build Satisfaction for Desired Stats with Current Artifacts"
          value={getMaxMetricValue({
            results: metricResults,
            metric: ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS,
          })}
        />
        <MetricCard
          title="Overall Potential Build Satisfaction for Desired Stats"
          value={getMaxMetricValue({
            results: metricResults,
            metric: ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS,
          })}
        />
        <MetricCard
          title="Plus/Minus Rating"
          value={getMaxMetricValue({ results: metricResults, metric: ArtifactMetric.ROLL_PLUS_MINUS })}
        />
        <MetricCard
          title="Tier Rating"
          value={getMaxMetricValue({ results: metricResults, metric: ArtifactMetric.TIER_RATING })}
        />
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value?: number | string }> = ({ title, value = "N/A" }) => (
  <div className="bg-secondary p-4 rounded-lg">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default ArtifactMetrics;
