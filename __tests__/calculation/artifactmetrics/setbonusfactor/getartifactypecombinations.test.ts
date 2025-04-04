import { describe, expect, it } from "vitest";

import getArtifactTypeCombinations from "@/calculation/artifactmetrics/setbonusfactor/getartifacttypecombinations";

describe("getArtifactTypeCombinations()", () => {
  const artifactTypeKeys = ["CIRCLET", "FLOWER", "GOBLET", "PLUME", "SANDS"];

  describe("When the list of artifact types is empty", () => {
    it("should return a single empty combination", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypeKeys: [], count: 0 });
      expect(combinations.length).toBe(1);
      expect(combinations[0]).toEqual([]);
    });
  });

  describe("When the combination count is 0", () => {
    it("should return a single empty combination", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypeKeys, count: 0 });
      expect(combinations.length).toBe(1);
      expect(combinations[0]).toEqual([]);
    });
  });

  describe("When the combination count is greater than the number of artifact types", () => {
    it("should throw an error", () => {
      expect(() => getArtifactTypeCombinations({ artifactTypeKeys, count: artifactTypeKeys.length + 1 })).toThrow();
    });
  });

  const expectedCombinationsByCount: Record<number, string[][]> = {
    1: [["CIRCLET"], ["FLOWER"], ["GOBLET"], ["PLUME"], ["SANDS"]],
    2: [
      ["CIRCLET", "FLOWER"],
      ["CIRCLET", "GOBLET"],
      ["CIRCLET", "PLUME"],
      ["CIRCLET", "SANDS"],
      ["FLOWER", "GOBLET"],
      ["FLOWER", "PLUME"],
      ["FLOWER", "SANDS"],
      ["GOBLET", "PLUME"],
      ["GOBLET", "SANDS"],
      ["PLUME", "SANDS"],
    ],
    3: [
      ["CIRCLET", "FLOWER", "GOBLET"],
      ["CIRCLET", "FLOWER", "PLUME"],
      ["CIRCLET", "FLOWER", "SANDS"],
      ["CIRCLET", "GOBLET", "PLUME"],
      ["CIRCLET", "GOBLET", "SANDS"],
      ["CIRCLET", "PLUME", "SANDS"],
      ["FLOWER", "GOBLET", "PLUME"],
      ["FLOWER", "GOBLET", "SANDS"],
      ["FLOWER", "PLUME", "SANDS"],
      ["GOBLET", "PLUME", "SANDS"],
    ],
    4: [
      ["CIRCLET", "FLOWER", "GOBLET", "PLUME"],
      ["CIRCLET", "FLOWER", "GOBLET", "SANDS"],
      ["CIRCLET", "FLOWER", "PLUME", "SANDS"],
      ["CIRCLET", "GOBLET", "PLUME", "SANDS"],
      ["FLOWER", "GOBLET", "PLUME", "SANDS"],
    ],
    5: [["CIRCLET", "FLOWER", "GOBLET", "PLUME", "SANDS"]],
  };

  describe.each([1, 2, 3, 4, 5])("When I specify a combination count of %i", (count: number) => {
    it("should return the expected combinations", () => {
      const combinations = getArtifactTypeCombinations({ artifactTypeKeys, count });
      const expectedCombinations = expectedCombinationsByCount[count];
      expect(combinations.length).toEqual(expectedCombinations.length);
      for (let i = 0; i < combinations.length; i++) {
        expect(combinations[i]).toEqual(expectedCombinations[i]);
      }
    });
  });
});
