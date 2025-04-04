import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { getWeightedArtifactSetBonusFactor } from "@/calculation/artifactmetrics/setbonusfactor";
import { IDataContext } from "@/contexts/DataContext";
import { ArtifactSetBonus } from "@/types";

describe("getWeightedArtifactSetBonusFactor()", () => {
  const dataContext = {
    getArtifactMainStatOdds: ({ artifactTypeKey }) => {
      if (artifactTypeKey === "FLOWER" || artifactTypeKey === "PLUME") {
        return 1;
      }
      return 0.2;
    },
    getArtifactTypes: () => [
      { key: "CIRCLET" },
      { key: "FLOWER" },
      { key: "GOBLET" },
      { key: "PLUME" },
      { key: "SANDS" },
    ],
  } as IDataContext;

  describe("When there are no main stat requirements", () => {
    const desiredArtifactMainStats = {};

    describe("and no set bonuses are specified", () => {
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [];

      it("should return 1", () => {
        const artifact = generateArtifact({});
        const factor = getWeightedArtifactSetBonusFactor({
          artifact,
          dataContext,
          desiredArtifactMainStats,
          desiredArtifactSetBonuses,
        });
        expect(factor).toBe(1);
      });
    });

    describe("and a two-piece bonus is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 2, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ setId });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return 0.6", () => {
          const artifact = generateArtifact({});
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBeCloseTo(0.6);
        });
      });
    });

    describe("and two two-piece bonuses are specified", () => {
      const setId1 = uuidv4();
      const setId2 = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
        { bonusCount: 2, setId: setId1 },
        { bonusCount: 2, setId: setId2 },
      ];

      describe("and the artifact matches the first set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ setId: setId1 });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches the second set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ setId: setId2 });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches neither set bonus", () => {
        it("should return 0.2", () => {
          const artifact = generateArtifact({});
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBeCloseTo(0.2);
        });
      });
    });

    describe("and a four-piece bonuses is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ setId });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return 0.2", () => {
          const artifact = generateArtifact({});
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBeCloseTo(0.2);
        });
      });
    });
  });

  describe("When there are main stat requirements", () => {
    const desiredArtifactMainStats = {
      CIRCLET: ["ATK_PERCENT"],
      GOBLET: ["ATK_PERCENT"],
      SANDS: ["ATK_PERCENT"],
    };

    describe("and no set bonuses are specified", () => {
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [];

      it("should return 1", () => {
        const artifact = generateArtifact({
          mainStatKey: "ATK_PERCENT",
          typeKey: "CIRCLET",
        });
        const factor = getWeightedArtifactSetBonusFactor({
          artifact,
          dataContext,
          desiredArtifactMainStats,
          desiredArtifactSetBonuses,
        });
        expect(factor).toBe(1);
      });
    });

    describe("and a two-piece bonus is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 2, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ setId });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStatKey: "ATK_PERCENT",
            typeKey: "CIRCLET",
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const getOdds = dataContext.getArtifactMainStatOdds;
          const numTypes = dataContext.getArtifactTypes().length;
          const circletFlowerOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes);
          const circletGobletOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const circletPlumeOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes);
          const circletSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const flowerGobletOdds =
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const flowerPlumeOdds =
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes);
          const flowerSandsOdds =
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const gobletPlumeOdds =
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes);
          const gobletSandsOdds =
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const plumeSandsOdds =
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);

          // The total weight is the sum of all odds.
          const totalWeight =
            circletFlowerOdds +
            circletGobletOdds +
            circletPlumeOdds +
            circletSandsOdds +
            flowerGobletOdds +
            flowerPlumeOdds +
            flowerSandsOdds +
            gobletPlumeOdds +
            gobletSandsOdds +
            plumeSandsOdds;

          // The artifact weight is the sum of the odds for combinations that don't include the circlet.
          const artifactWeight =
            flowerGobletOdds + flowerPlumeOdds + flowerSandsOdds + gobletPlumeOdds + gobletSandsOdds + plumeSandsOdds;

          const expectedFactor = artifactWeight / totalWeight;
          expect(factor).toBe(expectedFactor);
        });
      });
    });

    describe("and two two-piece bonuses are specified", () => {
      const setId1 = uuidv4();
      const setId2 = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
        { bonusCount: 2, setId: setId1 },
        { bonusCount: 2, setId: setId2 },
      ];

      describe("and the artifact matches the first set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({
            mainStatKey: "ATK_PERCENT",
            setId: setId1,
            typeKey: "CIRCLET",
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches the second set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({
            mainStatKey: "ATK_PERCENT",
            setId: setId2,
            typeKey: "CIRCLET",
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches neither set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStatKey: "ATK_PERCENT",
            typeKey: "CIRCLET",
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const getOdds = dataContext.getArtifactMainStatOdds;
          const numTypes = dataContext.getArtifactTypes().length;
          const circletFlowerGobletPlumeOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes);
          const circletFlowerGobletSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const circletFlowerPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const circletGobletPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const flowerGobletPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);

          const totalWeight =
            circletFlowerGobletPlumeOdds +
            circletFlowerGobletSandsOdds +
            circletFlowerPlumeSandsOdds +
            circletGobletPlumeSandsOdds +
            flowerGobletPlumeSandsOdds;

          const artifactWeight = flowerGobletPlumeSandsOdds;

          const expectedFactor = artifactWeight / totalWeight;
          expect(factor).toBeCloseTo(expectedFactor);
        });
      });
    });

    describe("and a four-piece bonuses is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStatKey: "ATK_PERCENT", setId, typeKey: "CIRCLET" });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStatKey: "ATK_PERCENT",
            typeKey: "CIRCLET",
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            dataContext,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const getOdds = dataContext.getArtifactMainStatOdds;
          const numTypes = dataContext.getArtifactTypes().length;
          const circletFlowerGobletPlumeOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes);
          const circletFlowerGobletSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const circletFlowerPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const circletGobletPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "CIRCLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);
          const flowerGobletPlumeSandsOdds =
            (getOdds({ artifactTypeKey: "FLOWER", mainStatKey: "HP_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "GOBLET", mainStatKey: "ATK_PERCENT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "PLUME", mainStatKey: "ATK_FLAT" }) / numTypes) *
            (getOdds({ artifactTypeKey: "SANDS", mainStatKey: "ATK_PERCENT" }) / numTypes);

          const totalWeight =
            circletFlowerGobletPlumeOdds +
            circletFlowerGobletSandsOdds +
            circletFlowerPlumeSandsOdds +
            circletGobletPlumeSandsOdds +
            flowerGobletPlumeSandsOdds;

          const artifactWeight = flowerGobletPlumeSandsOdds;

          const expectedFactor = artifactWeight / totalWeight;
          expect(factor).toBeCloseTo(expectedFactor);
        });
      });
    });
  });
});
