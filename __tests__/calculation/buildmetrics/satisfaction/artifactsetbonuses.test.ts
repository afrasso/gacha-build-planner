import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { calculateArtifactSetBonusesSatisfaction } from "@/calculation/buildmetrics/satisfaction/artifactsetbonuses";
import { ArtifactSetBonus, IArtifact } from "@/types";

describe("Artifact Set Bonuses Satisfaction Tests", () => {
  describe("calculateArtifactSetBonusesSatisfaction()", () => {
    describe("When a four-piece set is desired", () => {
      describe("and all five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId, typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId, typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(4);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and exactly four of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId, typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(4);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and three of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: uuidv4(), typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(4);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("and no artifacts are present", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {};
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 4, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(4);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });
    });

    describe("When a two-piece set is desired", () => {
      describe("and all five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId, typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId, typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 2, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(2);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and exactly two of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId: uuidv4(), typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: uuidv4(), typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 2, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(2);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and only one of the five artifacts match the desired set", () => {
        it("should indicate that the desired set is not satisfied", () => {
          const setId = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId: uuidv4(), typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId: uuidv4(), typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: uuidv4(), typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [{ bonusCount: 2, setId }];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].desiredSetBonus.bonusCount).toBe(2);
          expect(satisfactionResult.details[0].desiredSetBonus.setId).toBe(setId);
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });
    });

    describe("When two different two-piece sets are desired", () => {
      describe("and all five artifacts match one desired set", () => {
        it("should indicate that one desired set is satisfied but not the other", () => {
          const set1Id = uuidv4();
          const set2Id = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId: set1Id, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId: set1Id, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId: set1Id, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: set1Id, typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: set1Id, typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusCount: 2, setId: set1Id },
            { bonusCount: 2, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredSetBonus.bonusCount).toBe(2);
            if (details.desiredSetBonus.setId === set1Id) {
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
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId: set1Id, typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId: set1Id, typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId: set2Id, typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: set2Id, typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusCount: 2, setId: set1Id },
            { bonusCount: 2, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredSetBonus.bonusCount).toBe(2);
            expect(details.satisfaction).toBe(true);
          }
        });
      });

      describe("and none of the five artifacts match either desired set", () => {
        it("should indicate neither desired set is satisfied", () => {
          const set1Id = uuidv4();
          const set2Id = uuidv4();
          const artifacts: Record<string, IArtifact> = {
            CIRCLET: generateArtifact({ setId: uuidv4(), typeKey: "CIRCLET" }),
            FLOWER: generateArtifact({ setId: uuidv4(), typeKey: "FLOWER" }),
            GOBLET: generateArtifact({ setId: uuidv4(), typeKey: "GOBLET" }),
            PLUME: generateArtifact({ setId: uuidv4(), typeKey: "PLUME" }),
            SANDS: generateArtifact({ setId: uuidv4(), typeKey: "SANDS" }),
          };
          const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
            { bonusCount: 2, setId: set1Id },
            { bonusCount: 2, setId: set2Id },
          ];
          const satisfactionResult = calculateArtifactSetBonusesSatisfaction({ artifacts, desiredArtifactSetBonuses });
          expect(satisfactionResult.details.length).toBe(desiredArtifactSetBonuses.length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredSetBonus.bonusCount).toBe(2);
            expect(details.satisfaction).toBe(false);
          }
        });
      });
    });
  });
});
