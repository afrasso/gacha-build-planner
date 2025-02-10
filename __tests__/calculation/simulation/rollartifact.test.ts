import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { rollArtifact } from "@/calculation/simulation";
import { getArtifactMaxLevel } from "@/constants";
import { Artifact, ArtifactMetric, ArtifactType, Stat, StatValue } from "@/types";

describe("rollArtifact()", () => {
  const generateArtifact = ({
    level,
    rarity,
    subStats,
  }: {
    level: number;
    rarity: number;
    subStats: StatValue<Stat>[];
  }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      level,
      mainStat: Stat.ATK_FLAT,
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
      setId: uuidv4(),
      subStats,
      type: ArtifactType.FLOWER,
    };
    return artifact;
  };

  describe("When I roll an artifact", () => {
    it("should have all of the same values except for the level and sub-stats", () => {
      const level = 1;
      const rarity = 1;
      const subStats: StatValue<Stat>[] = [];
      const artifact = generateArtifact({ level, rarity, subStats });
      const rolledArtifact = rollArtifact({ artifact });
      expect(rolledArtifact.id).toBe(artifact.id);
      expect(rolledArtifact.lastUpdatedDate).toBe(rolledArtifact.lastUpdatedDate);
      expect(rolledArtifact.level).toBe(getArtifactMaxLevel({ rarity }));
      expect(rolledArtifact.mainStat).toBe(artifact.mainStat);
      expect(rolledArtifact.rarity).toBe(artifact.rarity);
      expect(rolledArtifact.setId).toBe(artifact.setId);
      expect(rolledArtifact.type).toBe(artifact.type);
    });
  });
});
