import { getMaxMetricValue } from "@/calculation/artifactmetrics/getmaxmetricvalue";
import { ArtifactMetric, ArtifactMetricsResults } from "@/types";

interface ArtifactMetricsProps {
  metricsResults: ArtifactMetricsResults;
}

const ArtifactMetrics: React.FC<ArtifactMetricsProps> = ({ metricsResults }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Artifact Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Build Satisfaction for Current Stats with Current Artifacts"
          value={getMaxMetricValue({
            metric: ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
            metricsResults,
          })}
        />
        <MetricCard
          title="Overall Potential Build Satisfaction for Current Stats"
          value={getMaxMetricValue({
            metric: ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS,
            metricsResults,
          })}
        />
        <MetricCard
          title="Build Satisfaction for Desired Stats with Current Artifacts"
          value={getMaxMetricValue({
            metric: ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS,
            metricsResults,
          })}
        />
        <MetricCard
          title="Overall Potential Build Satisfaction for Desired Stats"
          value={getMaxMetricValue({
            metric: ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS,
            metricsResults,
          })}
        />
        <MetricCard
          title="Plus/Minus Rating"
          value={getMaxMetricValue({ metric: ArtifactMetric.PLUS_MINUS, metricsResults })}
        />
        <MetricCard title="Tier Rating" value={getMaxMetricValue({ metric: ArtifactMetric.RATING, metricsResults })} />
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
