import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { getWeightedArtifactSetBonusFactor } from "@/calculation/artifactmetrics/setbonusfactor";
import { MAIN_STAT_ODDS_BY_ARTIFACT_TYPE } from "@/constants";
import { Artifact, ArtifactSetBonus, ArtifactSetBonusType, ArtifactType, Stat } from "@/types";

describe("getWeightedArtifactSetBonusFactor()", () => {
  const generateArtifact = ({
    mainStat,
    setId,
    type,
  }: {
    mainStat: Stat;
    setId: string;
    type: ArtifactType;
  }): Artifact => {
    return {
      mainStat,
      setId,
      type,
    } as Artifact;
  };

  describe("When there are no main stat requirements", () => {
    const desiredArtifactMainStats = {};

    describe("and no set bonuses are specified", () => {
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [];

      it("should return 1", () => {
        const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: uuidv4(), type: ArtifactType.CIRCLET });
        const factor = getWeightedArtifactSetBonusFactor({
          artifact,
          desiredArtifactMainStats,
          desiredArtifactSetBonuses,
        });
        expect(factor).toBe(1);
      });
    });

    describe("and a two-piece bonus is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.TWO_PIECE, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return 0.6", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
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
        { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: setId1 },
        { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: setId2 },
      ];

      describe("and the artifact matches the first set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: setId1, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches the second set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: setId2, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches neither set bonus", () => {
        it("should return 0.2", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBeCloseTo(0.2);
        });
      });
    });

    describe("and a four-piece bonuses is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return 0.2", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
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
      [ArtifactType.CIRCLET]: Stat.ATK_PERCENT,
      [ArtifactType.GOBLET]: Stat.ATK_PERCENT,
      [ArtifactType.SANDS]: Stat.ATK_PERCENT,
    };

    describe("and no set bonuses are specified", () => {
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [];

      it("should return 1", () => {
        const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: uuidv4(), type: ArtifactType.CIRCLET });
        const factor = getWeightedArtifactSetBonusFactor({
          artifact,
          desiredArtifactMainStats,
          desiredArtifactSetBonuses,
        });
        expect(factor).toBe(1);
      });
    });

    describe("and a two-piece bonus is specified", () => {
      const setId = uuidv4();
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.TWO_PIECE, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const circletFlowerOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5);
          const circletGobletOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5);
          const circletPlumeOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5);
          const circletSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const flowerGobletOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5);
          const flowerPlumeOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5);
          const flowerSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const gobletPlumeOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5);
          const gobletSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const plumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);

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
        { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: setId1 },
        { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: setId2 },
      ];

      describe("and the artifact matches the first set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: setId1, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches the second set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId: setId2, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact matches neither set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const circletFlowerGobletPlumeOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5);
          const circletFlowerGobletSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const circletFlowerPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const circletGobletPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const flowerGobletPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);

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
      const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];

      describe("and the artifact matches the set bonus", () => {
        it("should return 1", () => {
          const artifact = generateArtifact({ mainStat: Stat.ATK_PERCENT, setId, type: ArtifactType.CIRCLET });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });
          expect(factor).toBe(1);
        });
      });

      describe("and the artifact does not match the set bonus", () => {
        it("should return the expected value", () => {
          const artifact = generateArtifact({
            mainStat: Stat.ATK_PERCENT,
            setId: uuidv4(),
            type: ArtifactType.CIRCLET,
          });
          const factor = getWeightedArtifactSetBonusFactor({
            artifact,
            desiredArtifactMainStats,
            desiredArtifactSetBonuses,
          });

          const circletFlowerGobletPlumeOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5);
          const circletFlowerGobletSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const circletFlowerPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const circletGobletPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);
          const flowerGobletPlumeSandsOdds =
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.FLOWER][Stat.HP_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET][Stat.ATK_PERCENT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.PLUME][Stat.ATK_FLAT]! / 5) *
            (MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[ArtifactType.SANDS][Stat.ATK_PERCENT]! / 5);

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
