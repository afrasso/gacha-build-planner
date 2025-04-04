import { describe, expect, it } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { rollArtifact } from "@/calculation/simulation";
import { IDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

describe("rollArtifact()", () => {
  const dataContext = {
    getArtifactLevelsPerSubStatRoll: () => 4,
    getArtifactMaxLevel: (_) => 20,
    getArtifactMaxSubStatCount: () => 4,
    getArtifactSubStatRelativeLikelihood: (_) => 1,
    getPossibleArtifactSubStatRollValues: (_) => [1, 2, 3, 4],
    getPossibleArtifactSubStats: () => ["ATK_FLAT", "ATK_PERCENT", "DEF_FLAT", "DEF_PERCENT", "HP_FLAT", "HP_PERCENT"],
  } as IDataContext;

  describe("When I roll an artifact", () => {
    it("should have all of the same values except for the level and sub-stats", () => {
      const level = 1;
      const rarity = 1;
      const subStats: Stat[] = [];
      const artifact = generateArtifact({ level, rarity, subStats });
      const rolledArtifact = rollArtifact({ artifact, dataContext });
      expect(rolledArtifact.id).toBe(artifact.id);
      expect(rolledArtifact.level).toBe(dataContext.getArtifactMaxLevel({ rarity }));
      expect(rolledArtifact.mainStatKey).toBe(artifact.mainStatKey);
      expect(rolledArtifact.rarity).toBe(artifact.rarity);
      expect(rolledArtifact.setId).toBe(artifact.setId);
      expect(rolledArtifact.typeKey).toBe(artifact.typeKey);
    });
  });
});
