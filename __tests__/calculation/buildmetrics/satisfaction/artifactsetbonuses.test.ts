import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { getRandomEnumValue } from "@/__tests__/testhelpers";
import { calculateArtifactSetBonusesSatisfaction } from "@/calculation/buildmetrics/satisfaction/artifactsetbonuses";
import {
  Artifact,
  ArtifactMetric,
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  BuildArtifacts,
  StatKey,
} from "@/types";

describe("Artifact Set Bonuses Satisfaction Tests", () => {
  const generateArtifact = ({ setId, type }: { setId: string; type: ArtifactType }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      lastUpdatedDate: new Date().toISOString(),
      level: 20,
      mainStat: getRandomEnumValue(StatKey),
      metricsResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
        [ArtifactMetric.RATING]: { buildResults: {} },
      },
      rarity: 5,
      setId,
      subStats: [],
      type,
    };
    return artifact;
  };

  describe("calculateArtifactSetBonusesSatisfaction()", () => {
    describe("When a four-piece set is desired", () => {
      describe("and all five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId, type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.FOUR_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and exactly four of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.FOUR_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and three of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: uuidv4(), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.FOUR_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("and no artifacts are present", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {};
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.FOUR_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.FOUR_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });
    });

    describe("When a two-piece set is desired", () => {
      describe("and all five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId, type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.TWO_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and exactly two of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId: uuidv4(), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: uuidv4(), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.TWO_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and only one of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId: uuidv4(), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId: uuidv4(), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: uuidv4(), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusType: ArtifactSetBonusType.TWO_PIECE, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
          expect(satisfactionResult.details[0].desiredSetId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });
    });

    describe("When two different two-piece sets are desired", () => {
      describe("and all five artifacts match one desired set", () => {
        it("should indicate that one desired set is satisfied but not the other", () => {
          const set1Id = uuidv4();
          const set2Id = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId: set1Id, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId: set1Id, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId: set1Id, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: set1Id, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: set1Id, type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set1Id },
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
            if (details.desiredSetId === set1Id) {
              expect(details.satisfaction).toBe(true);
            } else {
              expect(details.satisfaction).toBe(false);
            }
          }
        });
      });

      describe("and exactly two of the five artifacts match each desired set", () => {
        it("should indicate both desired sets are satisfied", () => {
          const set1Id = uuidv4();
          const set2Id = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId: set1Id, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId: set1Id, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId: set2Id, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: set2Id, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set1Id },
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
            expect(details.satisfaction).toBe(true);
          }
        });
      });

      describe("and none of the five artifacts match either desired set", () => {
        it("should indicate neither desired set is satisfied", () => {
          const set1Id = uuidv4();
          const set2Id = uuidv4();
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ setId: uuidv4(), type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ setId: uuidv4(), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ setId: uuidv4(), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ setId: uuidv4(), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ setId: uuidv4(), type: ArtifactType.SANDS }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set1Id },
            { bonusType: ArtifactSetBonusType.TWO_PIECE, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredBonusType).toBe(ArtifactSetBonusType.TWO_PIECE);
            expect(details.satisfaction).toBe(false);
          }
        });
      });
    });
  });
});
