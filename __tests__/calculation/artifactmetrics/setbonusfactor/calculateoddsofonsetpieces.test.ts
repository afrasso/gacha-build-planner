import { describe, expect, it } from "vitest";

import calculateOddsOfOnSetPieces from "@/calculation/artifactmetrics/setbonusfactor/calculateoddsofonsetpieces";
import { IDataContext } from "@/contexts/DataContext";

describe("calculateOddsOfOnSetPieces()", () => {
  const dataContext = {
    getArtifactMainStatOdds: ({}) => 0.1,
    getArtifactTypes: () => [
      { key: "CIRCLET" },
      { key: "FLOWER" },
      { key: "GOBLET" },
      { key: "PLUME" },
      { key: "SANDS" },
    ],
  } as IDataContext;
  const getMainStatOdds = dataContext.getArtifactMainStatOdds;
  const desiredArtifactMainStats = {
    CIRCLET: ["ATK_PERCENT"],
    GOBLET: ["ATK_PERCENT"],
    SANDS: ["ATK_PERCENT"],
  };

  describe("When the list of artifact types is empty", () => {
    it("should return 1", () => {
      const artifactTypeKeys: string[] = [];
      const odds = calculateOddsOfOnSetPieces({ artifactTypeKeys, dataContext, desiredArtifactMainStats });
      expect(odds).toBe(1);
    });
  });

  describe("When the list of artifact types contains a single artifact", () => {
    it("should return the odds of receiving that particular artifact", () => {
      const artifactTypeKeys: string[] = ["CIRCLET"];
      const odds = calculateOddsOfOnSetPieces({ artifactTypeKeys, dataContext, desiredArtifactMainStats });

      const initialOdds = getMainStatOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" });

      const expectedOdds = initialOdds! / 5;
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains two artifacts", () => {
    it("should return the odds of receiving both of those artifacts", () => {
      const artifactTypeKeys: string[] = ["CIRCLET", "GOBLET"];
      const odds = calculateOddsOfOnSetPieces({ artifactTypeKeys, dataContext, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" });
      const initialGobletOdds = getMainStatOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" });

      // Multiplying by 2!, since the artifacts can be retrieved in either order.
      const expectedOdds = (initialCircletOdds! / 5) * (initialGobletOdds! / 5) * (2 * 1);
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains three artifacts", () => {
    it("should return the odds of receiving all of those artifacts", () => {
      const artifactTypeKeys: string[] = ["CIRCLET", "GOBLET", "SANDS"];
      const odds = calculateOddsOfOnSetPieces({ artifactTypeKeys, dataContext, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" });
      const initialGobletOdds = getMainStatOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" });
      const initialSandsOdds = getMainStatOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" });

      // Multiplying by 3!, since the artifacts can be retrieved in any order.
      const expectedOdds = (initialCircletOdds! / 5) * (initialGobletOdds! / 5) * (initialSandsOdds! / 5) * (3 * 2 * 1);
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains five artifacts", () => {
    it("should return the odds of receiving all of those artifacts", () => {
      const artifactTypeKeys: string[] = ["CIRCLET", "FLOWER", "GOBLET", "PLUME", "SANDS"];
      const odds = calculateOddsOfOnSetPieces({ artifactTypeKeys, dataContext, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" });
      const initialGobletOdds = getMainStatOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" });
      const initialSandsOdds = getMainStatOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" });

      // Multiplying by 5!, since the artifacts can be retrieved in any order.
      const expectedOdds =
        (1 / 5) *
        (1 / 5) *
        (initialCircletOdds! / 5) *
        (initialGobletOdds! / 5) *
        (initialSandsOdds! / 5) *
        (5 * 4 * 3 * 2 * 1);
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });
});
