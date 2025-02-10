import { v4 as uuidv4 } from "uuid";

import { Artifact, ArtifactMetric, ArtifactType, Stat } from "@/types";

import { getRandomInitialSubStats } from "./getrandominitialsubstats";
import { getRandomMainStat } from "./getrandommainstat";

export const rollNewArtifact = ({
  level,
  mainStats,
  rarity,
  setId,
  type,
}: {
  level: number;
  mainStats?: Stat[];
  rarity: number;
  setId: string;
  type: ArtifactType;
}): Artifact => {
  const actualMainStat = getRandomMainStat({ mainStats, type });
  const subStats = getRandomInitialSubStats({ mainStat: actualMainStat, rarity });
  return {
    id: uuidv4(),
    isLocked: false,
    lastUpdatedDate: new Date().toISOString(),
    level,
    mainStat: actualMainStat,
    metricsResults: {
      [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
      [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
      [ArtifactMetric.RATING]: { buildResults: {} },
    },
    rarity,
    setId,
    subStats,
    type,
  };
};
