import { Artifact, ArtifactMetric } from "@/types";

export type ArtifactSort = "LEVEL" | "RARITY" | ArtifactMetric;

const getMetricSort = (metric: ArtifactMetric) => {
  return (a: Artifact, b: Artifact) => {
    const aValue = a.metricsResults[metric].maxValue;
    const bValue = b.metricsResults[metric].maxValue;
    if (!aValue && !bValue) {
      return 0;
    }
    if (!aValue) {
      return 1;
    }
    if (!bValue) {
      return -1;
    }
    return bValue - aValue;
  };
};

export const sortArtifacts = ({ artifacts, sort }: { artifacts: Artifact[]; sort: ArtifactSort }): Artifact[] => {
  switch (sort) {
    case ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS:
    case ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS:
    case ArtifactMetric.PLUS_MINUS:
    case ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS:
    case ArtifactMetric.RATING:
      return artifacts.sort(getMetricSort(sort));
    case "LEVEL":
      return artifacts.sort((a, b) => b.level - a.level);
    case "RARITY":
      return artifacts.sort((a, b) => b.rarity - a.rarity);
    default:
      throw new Error(`Unexpected error: the artifact sort ${sort} was encountered.`);
  }
};
