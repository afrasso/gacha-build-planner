import { describe, expect, it } from "vitest";

import calculateOddsOfOnSetPieces from "@/calculation/artifactmetrics/setbonusfactor/calculateoddsofonsetpieces";
import { getMainStatOdds } from "@/constants";
import { ArtifactType, StatKey } from "@/types";

describe("calculateOddsOfOnSetPieces()", () => {
  const desiredArtifactMainStats = {
    [ArtifactType.CIRCLET]: [StatKey.ATK_PERCENT],
    [ArtifactType.GOBLET]: [StatKey.ATK_PERCENT],
    [ArtifactType.SANDS]: [StatKey.ATK_PERCENT],
  };

  describe("When the list of artifact types is empty", () => {
    it("should return 1", () => {
      const artifactTypes: ArtifactType[] = [];
      const odds = calculateOddsOfOnSetPieces({ artifactTypes, desiredArtifactMainStats });
      expect(odds).toBe(1);
    });
  });

  describe("When the list of artifact types contains a single artifact", () => {
    it("should return the odds of receiving that particular artifact", () => {
      const artifactTypes: ArtifactType[] = [ArtifactType.CIRCLET];
      const odds = calculateOddsOfOnSetPieces({ artifactTypes, desiredArtifactMainStats });

      const initialOdds = getMainStatOdds({ artifactType: ArtifactType.CIRCLET, mainStat: StatKey.ATK_PERCENT });

      const expectedOdds = initialOdds! / 5;
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains two artifacts", () => {
    it("should return the odds of receiving both of those artifacts", () => {
      const artifactTypes: ArtifactType[] = [ArtifactType.CIRCLET, ArtifactType.GOBLET];
      const odds = calculateOddsOfOnSetPieces({ artifactTypes, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactType: ArtifactType.CIRCLET, mainStat: StatKey.ATK_PERCENT });
      const initialGobletOdds = getMainStatOdds({ artifactType: ArtifactType.GOBLET, mainStat: StatKey.ATK_PERCENT });

      // Multiplying by 2!, since the artifacts can be retrieved in either order.
      const expectedOdds = (initialCircletOdds! / 5) * (initialGobletOdds! / 5) * (2 * 1);
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains three artifacts", () => {
    it("should return the odds of receiving all of those artifacts", () => {
      const artifactTypes: ArtifactType[] = [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS];
      const odds = calculateOddsOfOnSetPieces({ artifactTypes, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactType: ArtifactType.CIRCLET, mainStat: StatKey.ATK_PERCENT });
      const initialGobletOdds = getMainStatOdds({ artifactType: ArtifactType.GOBLET, mainStat: StatKey.ATK_PERCENT });
      const initialSandsOdds = getMainStatOdds({ artifactType: ArtifactType.SANDS, mainStat: StatKey.ATK_PERCENT });

      // Multiplying by 3!, since the artifacts can be retrieved in any order.
      const expectedOdds = (initialCircletOdds! / 5) * (initialGobletOdds! / 5) * (initialSandsOdds! / 5) * (3 * 2 * 1);
      expect(odds).toBeCloseTo(expectedOdds);
    });
  });

  describe("When the list of artifact types contains five artifacts", () => {
    it("should return the odds of receiving all of those artifacts", () => {
      const artifactTypes: ArtifactType[] = Object.values(ArtifactType);
      const odds = calculateOddsOfOnSetPieces({ artifactTypes, desiredArtifactMainStats });

      const initialCircletOdds = getMainStatOdds({ artifactType: ArtifactType.CIRCLET, mainStat: StatKey.ATK_PERCENT });
      const initialGobletOdds = getMainStatOdds({ artifactType: ArtifactType.GOBLET, mainStat: StatKey.ATK_PERCENT });
      const initialSandsOdds = getMainStatOdds({ artifactType: ArtifactType.SANDS, mainStat: StatKey.ATK_PERCENT });

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
