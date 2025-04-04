import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { calculateArtifactMainStatsSatisfaction } from "@/calculation/buildmetrics/satisfaction/artifactmainstats";
import { IArtifact } from "@/types";

describe("Artifact Main Stats Satisfaction Tests", () => {
  describe("calculateArtifactMainStatsSatisfaction()", () => {
    let artifacts: Record<string, IArtifact>;
    let desiredArtifactMainStats: Record<string, string[]>;

    beforeEach(() => {
      const mainStats = {
        CIRCLET: uuidv4().toString(),
        FLOWER: uuidv4().toString(),
        GOBLET: uuidv4().toString(),
        PLUME: uuidv4().toString(),
        SANDS: uuidv4().toString(),
      };

      artifacts = Object.entries(mainStats).reduce<Record<string, IArtifact>>((acc, [typeKey, mainStatKey]) => {
        const artifact = generateArtifact({ mainStatKey, typeKey });
        acc[typeKey] = artifact;
        return acc;
      }, {});

      desiredArtifactMainStats = Object.entries(mainStats).reduce<Record<string, string[]>>(
        (acc, [typeKey, mainStatKey]) => {
          acc[typeKey] = [mainStatKey];
          return acc;
        },
        {}
      );
    });

    describe("When artifacts of all types are present", () => {
      describe("and all artifact main stats match the desired main stats", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const typeKey = details.artifactTypeKey;
            expect(details.desiredMainStatKeys).toBe(desiredArtifactMainStats[typeKey]);
            expect(details.currentMainStatKey).toBe(artifacts[typeKey]?.mainStatKey);
            expect(details.satisfaction).toBe(true);
          }
        });
      });

      describe("and one artifact main stat does not match the desired main stats", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          artifacts.CIRCLET = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "CIRCLET" });
          desiredArtifactMainStats.CIRCLET = ["DEF_PERCENT"];

          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const typeKey = details.artifactTypeKey;
            if (typeKey === "CIRCLET") {
              expect(details.desiredMainStatKeys).toEqual(["DEF_PERCENT"]);
              expect(details.currentMainStatKey).toBe("ATK_PERCENT");
              expect(details.satisfaction).toBe(false);
            } else {
              expect(details.desiredMainStatKeys).toBe(desiredArtifactMainStats[typeKey]);
              expect(details.currentMainStatKey).toBe(artifacts[typeKey]?.mainStatKey);
              expect(details.satisfaction).toBe(true);
            }
          }
        });
      });

      describe("and all artifact main stats do not match the desired main stats", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          artifacts.CIRCLET = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "CIRCLET" });
          artifacts.FLOWER = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "FLOWER" });
          artifacts.GOBLET = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "GOBLET" });
          artifacts.PLUME = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "PLUME" });
          artifacts.SANDS = generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "SANDS" });
          desiredArtifactMainStats.CIRCLET = ["DEF_PERCENT"];
          desiredArtifactMainStats.FLOWER = ["DEF_PERCENT"];
          desiredArtifactMainStats.GOBLET = ["DEF_PERCENT"];
          desiredArtifactMainStats.PLUME = ["DEF_PERCENT"];
          desiredArtifactMainStats.SANDS = ["DEF_PERCENT"];

          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredMainStatKeys).toEqual(["DEF_PERCENT"]);
            expect(details.currentMainStatKey).toBe("ATK_PERCENT");
            expect(details.satisfaction).toBe(false);
          }
        });
      });

      describe("and no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({
            artifacts,
            desiredArtifactMainStats: {},
          });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });

    describe("When artifacts of some types are missing", () => {
      describe("and there is no artifact present for a desired main stat", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          delete artifacts.CIRCLET;
          delete desiredArtifactMainStats.FLOWER;
          delete desiredArtifactMainStats.GOBLET;
          delete desiredArtifactMainStats.PLUME;
          delete desiredArtifactMainStats.SANDS;
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactTypeKey).toBe("CIRCLET");
          expect(satisfactionResult.details[0].desiredMainStatKeys).toEqual(desiredArtifactMainStats["CIRCLET"]);
          expect(satisfactionResult.details[0].currentMainStatKey).toBeUndefined();
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("but artifacts for desired main stats are present", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          delete artifacts.FLOWER;
          delete artifacts.GOBLET;
          delete artifacts.PLUME;
          delete artifacts.SANDS;
          delete desiredArtifactMainStats.FLOWER;
          delete desiredArtifactMainStats.GOBLET;
          delete desiredArtifactMainStats.PLUME;
          delete desiredArtifactMainStats.SANDS;
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactTypeKey).toBe("CIRCLET");
          expect(satisfactionResult.details[0].desiredMainStatKeys).toBe(desiredArtifactMainStats["CIRCLET"]);
          expect(satisfactionResult.details[0].currentMainStatKey).toBe(artifacts["CIRCLET"]?.mainStatKey);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          delete artifacts.FLOWER;
          delete artifacts.GOBLET;
          delete artifacts.PLUME;
          delete artifacts.SANDS;
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({
            artifacts,
            desiredArtifactMainStats: {},
          });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });

    describe("When no artifacts exist", () => {
      describe("and there are desired main stats specified", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          delete desiredArtifactMainStats.FLOWER;
          delete desiredArtifactMainStats.GOBLET;
          delete desiredArtifactMainStats.PLUME;
          delete desiredArtifactMainStats.SANDS;
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({
            artifacts: {},
            desiredArtifactMainStats,
          });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactTypeKey).toBe("CIRCLET");
          expect(satisfactionResult.details[0].desiredMainStatKeys).toBe(desiredArtifactMainStats["CIRCLET"]);
          expect(satisfactionResult.details[0].currentMainStatKey).toBeUndefined();
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("but no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({
            artifacts: {},
            desiredArtifactMainStats: {},
          });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });
  });
});
