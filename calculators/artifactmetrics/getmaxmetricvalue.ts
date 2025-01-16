import { ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP, ARTIFACT_TIER_NUMERIC_RATINGS } from "@/constants";
import {
  ArtifactMetric,
  ArtifactMetricResult,
  ArtifactMetricResultMap,
  ArtifactMetricResults,
  ArtifactTier,
} from "@/types";

const getMaxNumericMetricValue = (results: ArtifactMetricResult<number>[]): number => {
  if (!results || results.length === 0) {
    return 0;
  }
  return Math.max(...results.map((result) => result.result || 0));
};

const getMaxTierRatingMetricValue = (results: ArtifactMetricResult<ArtifactTier>[]): ArtifactTier => {
  if (!results || results.length === 0) {
    return ArtifactTier.F;
  }
  return reverseLookupArtifactTierNumericRating(
    Math.max(...results.map((result) => result.result).map(lookupArtifactTierNumericRating))
  );
};

const lookupArtifactTierNumericRating = (tier: ArtifactTier): number => {
  return ARTIFACT_TIER_NUMERIC_RATINGS[tier];
};

const reverseLookupArtifactTierNumericRating = (rating: number): ArtifactTier => {
  return ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP[rating] as ArtifactTier;
};

export const getMaxMetricValue = <M extends keyof ArtifactMetricResults>({
  metric,
  results,
}: {
  metric: M;
  results: ArtifactMetricResults;
}): ArtifactMetricResultMap[M] | undefined => {
  if (!results?.[metric]) {
    return;
  }
  switch (metric) {
    case ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS:
    case ArtifactMetric.ROLL_PLUS_MINUS:
      return getMaxNumericMetricValue(
        Object.values(results[metric]) as ArtifactMetricResult<number>[]
      ) as ArtifactMetricResultMap[M];
    case ArtifactMetric.TIER_RATING:
      return getMaxTierRatingMetricValue(
        Object.values(results[metric]) as ArtifactMetricResult<ArtifactTier>[]
      ) as ArtifactMetricResultMap[M];
    default:
      throw new Error(`Unexpected metric encountered: ${metric}`);
  }
};
