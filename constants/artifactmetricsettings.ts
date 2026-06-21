import { ArtifactMetric, ArtifactMetricSettings } from "@/types";
import getEnumValues from "@/utils/getenumvalues";

export const RATING_METRICS = [
  ArtifactMetric.RATING,
  ArtifactMetric.PLUS_MINUS,
  ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS,
] as const;

export const BUILD_COMPLETION_METRICS = [
  ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
  ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS,
  ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS,
  ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS,
] as const;

export const DEFAULT_ARTIFACT_METRIC_SETTINGS: ArtifactMetricSettings = Object.fromEntries(
  getEnumValues(ArtifactMetric).map((metric) => [metric, true])
) as ArtifactMetricSettings;

export const isRatingMetric = (metric: ArtifactMetric): metric is (typeof RATING_METRICS)[number] => {
  return (RATING_METRICS as readonly ArtifactMetric[]).includes(metric);
};

export const getEnabledArtifactMetrics = (settings: ArtifactMetricSettings): ArtifactMetric[] => {
  return getEnumValues(ArtifactMetric).filter((metric) => settings[metric]);
};

export const countEnabledArtifactMetrics = (settings: ArtifactMetricSettings): number => {
  return getEnabledArtifactMetrics(settings).length;
};

export const mergeArtifactMetricSettings = (stored: Partial<ArtifactMetricSettings>): ArtifactMetricSettings => {
  return { ...DEFAULT_ARTIFACT_METRIC_SETTINGS, ...stored };
};

export const canDisableArtifactMetric = ({
  metric,
  settings,
}: {
  metric: ArtifactMetric;
  settings: ArtifactMetricSettings;
}): boolean => {
  return settings[metric] && countEnabledArtifactMetrics(settings) > 1;
};
