import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { calculateArtifactBuildSatisfaction } from "@/calculation/artifactmetrics/calculateartifactbuildsatisfaction";
import { IDataContext } from "@/contexts/DataContext";
import { ArtifactMetric, IBuild } from "@/types";

describe("calculateArtifactBuildSatisfaction()", () => {
  const dataContext = {
    getArtifactLevelsPerSubStatRoll: () => 0,
    getArtifactMaxLevel: (_) => 0,
  } as IDataContext;

  const generateBuild = (): IBuild => {
    const build: IBuild = {
      _typeBrand: "IBuild",
      artifacts: {},
      calculateStats: generateOverallStats,
      characterId: uuidv4(),
      desiredArtifactMainStats: {},
      desiredArtifactSetBonuses: [],
      desiredOverallStats: [],
      lastUpdatedDate: new Date().toISOString(),
      sortOrder: 0,
      toBuildData: () => {
        throw new Error("Not implemented.");
      },
    };
    return build;
  };

  const generateOverallStats = (): Record<string, number> => {
    return {
      ATK: 1000,
      CRIT_DMG: 100,
      CRIT_RATE: 100,
      DEF: 1000,
      DMG_BONUS_ANEMO: 0,
      DMG_BONUS_CRYO: 0,
      DMG_BONUS_DENDRO: 0,
      DMG_BONUS_ELECTRO: 0,
      DMG_BONUS_GEO: 0,
      DMG_BONUS_HYDRO: 0,
      DMG_BONUS_PHYSICAL: 0,
      DMG_BONUS_PYRO: 0,
      ELEMENTAL_MASTERY: 100,
      ENERGY_RECHARGE: 100,
      HEALING_BONUS: 0,
      MAX_HP: 10000,
    };
  };

  describe("When I have a build with an existing artifact", () => {
    describe("and the existing artifact is part of the desired set bonus", () => {
      describe("and I have a new artifact that is not part of the desired set bonus", () => {
        it("should result in a satisfaction of 0", () => {
          const setId = uuidv4();

          const build = generateBuild();
          build.artifacts.CIRCLET = generateArtifact({ setId, typeKey: "CIRCLET" });
          build.artifacts.FLOWER = generateArtifact({ setId, typeKey: "FLOWER" });
          build.artifacts.GOBLET = generateArtifact({ setId, typeKey: "GOBLET" });
          build.artifacts.PLUME = generateArtifact({ setId, typeKey: "PLUME" });
          // Set the sands artifact to have a different set, so any change to the set of the other four artifacts would
          // result in a lack of satisfaction.
          build.artifacts.SANDS = generateArtifact({ typeKey: "SANDS" });
          build.desiredArtifactSetBonuses.push({ bonusCount: 4, setId });

          const artifact = generateArtifact({ typeKey: "CIRCLET" });

          const result = calculateArtifactBuildSatisfaction({
            artifact,
            build,
            calculationType: ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
            dataContext,
            iterations: 1,
          });

          expect(result).toBe(0);
        });
      });
    });
  });
});
