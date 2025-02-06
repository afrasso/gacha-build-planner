import { describe, expect, it } from "vitest";

import getArtifactTypeCombinations from "@/calculation/artifactmetrics/setbonusfactor/getartifacttypecombinations";
import { ArtifactType } from "@/types";

describe("getArtifactTypeCombinations()", () => {
  const artifactTypes = Object.values(ArtifactType);

  describe("When the list of artifact types is empty", () => {
    it("should return a single empty combination", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypes: [], count: 0 });
      expect(combinations.length).toBe(1);
      expect(combinations[0]).toEqual([]);
    });
  });

  describe("When the combination count is 0", () => {
    it("should return a single empty combination", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypes, count: 0 });
      expect(combinations.length).toBe(1);
      expect(combinations[0]).toEqual([]);
    });
  });

  describe("When the combination count is greater than the number of artifact types", () => {
    it("should throw an error", () => {
      expect(() => getArtifactTypeCombinations({ artifactTypes, count: artifactTypes.length + 1 })).toThrow();
    });
  });

  const expectedCombinationsByCount: Record<number, ArtifactType[][]> = {
    1: [
      [ArtifactType.CIRCLET],
      [ArtifactType.FLOWER],
      [ArtifactType.GOBLET],
      [ArtifactType.PLUME],
      [ArtifactType.SANDS],
    ],
    2: [
      [ArtifactType.CIRCLET, ArtifactType.FLOWER],
      [ArtifactType.CIRCLET, ArtifactType.GOBLET],
      [ArtifactType.CIRCLET, ArtifactType.PLUME],
      [ArtifactType.CIRCLET, ArtifactType.SANDS],
      [ArtifactType.FLOWER, ArtifactType.GOBLET],
      [ArtifactType.FLOWER, ArtifactType.PLUME],
      [ArtifactType.FLOWER, ArtifactType.SANDS],
      [ArtifactType.GOBLET, ArtifactType.PLUME],
      [ArtifactType.GOBLET, ArtifactType.SANDS],
      [ArtifactType.PLUME, ArtifactType.SANDS],
    ],
    3: [
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.GOBLET],
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.PLUME],
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.SANDS],
      [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.PLUME],
      [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS],
      [ArtifactType.CIRCLET, ArtifactType.PLUME, ArtifactType.SANDS],
      [ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.PLUME],
      [ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.SANDS],
      [ArtifactType.FLOWER, ArtifactType.PLUME, ArtifactType.SANDS],
      [ArtifactType.GOBLET, ArtifactType.PLUME, ArtifactType.SANDS],
    ],
    4: [
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.PLUME],
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.SANDS],
      [ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.PLUME, ArtifactType.SANDS],
      [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.PLUME, ArtifactType.SANDS],
      [ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.PLUME, ArtifactType.SANDS],
    ],
    5: [[ArtifactType.CIRCLET, ArtifactType.FLOWER, ArtifactType.GOBLET, ArtifactType.PLUME, ArtifactType.SANDS]],
  };

  describe.each([1, 2, 3, 4, 5])("When I specify a combination count of %i", (count: number) => {
    it("should return the expected combinations", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypes, count });
      const expectedCombinations = expectedCombinationsByCount[count];
      expect(combinations.length).toEqual(expectedCombinations.length);
      for (let i = 0; i < combinations.length; i++) {
        expect(combinations[i]).toEqual(expectedCombinations[i]);
      }
    });
  });
});
