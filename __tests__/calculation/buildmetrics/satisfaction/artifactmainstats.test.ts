import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { getRandomEnumValue } from "@/__tests__/testhelpers";
import { calculateArtifactMainStatsSatisfaction } from "@/calculation/buildmetrics/satisfaction/artifactmainstats";
import { Artifact, ArtifactMetric, ArtifactType, BuildArtifacts, DesiredArtifactMainStats, Stat } from "@/types";

describe("Artifact Main Stats Satisfaction Tests", () => {
  const generateArtifact = ({ mainStat, type }: { mainStat: Stat; type: ArtifactType }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      lastUpdatedDate: new Date().toISOString(),
      level: 20,
      mainStat,
      metricResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: {},
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: {},
        [ArtifactMetric.PLUS_MINUS]: {},
        [ArtifactMetric.RATING]: {},
      },
      rarity: 5,
      setId: uuidv4(),
      subStats: [],
      type,
    };
    return artifact;
  };

  describe("calculateArtifactMainStatsSatisfaction()", () => {
    describe("When artifacts of all types are present", () => {
      describe("and all artifact main stats match the desired main stats", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: getRandomEnumValue(Stat),
              type: ArtifactType.CIRCLET,
            }),
            [ArtifactType.FLOWER]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.SANDS }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: artifacts[ArtifactType.CIRCLET]?.mainStat,
            [ArtifactType.FLOWER]: artifacts[ArtifactType.FLOWER]?.mainStat,
            [ArtifactType.GOBLET]: artifacts[ArtifactType.GOBLET]?.mainStat,
            [ArtifactType.PLUME]: artifacts[ArtifactType.PLUME]?.mainStat,
            [ArtifactType.SANDS]: artifacts[ArtifactType.SANDS]?.mainStat,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const artifactType = details.artifactType;
            expect(details.desiredMainStat).toBe(desiredArtifactMainStats[artifactType]);
            expect(details.mainStat).toBe(artifacts[artifactType]?.mainStat);
            expect(details.satisfaction).toBe(true);
          }
        });
      });

      describe("and one artifact main stat does not match the desired main stats", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.SANDS }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: Stat.DEF_PERCENT,
            [ArtifactType.FLOWER]: artifacts[ArtifactType.FLOWER]?.mainStat,
            [ArtifactType.GOBLET]: artifacts[ArtifactType.GOBLET]?.mainStat,
            [ArtifactType.PLUME]: artifacts[ArtifactType.PLUME]?.mainStat,
            [ArtifactType.SANDS]: artifacts[ArtifactType.SANDS]?.mainStat,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const artifactType = details.artifactType;
            if (artifactType === ArtifactType.CIRCLET) {
              expect(details.desiredMainStat).toBe(Stat.DEF_PERCENT);
              expect(details.mainStat).toBe(Stat.ATK_PERCENT);
              expect(details.satisfaction).toBe(false);
            } else {
              expect(details.desiredMainStat).toBe(desiredArtifactMainStats[artifactType]);
              expect(details.mainStat).toBe(artifacts[artifactType]?.mainStat);
              expect(details.satisfaction).toBe(true);
            }
          }
        });
      });

      describe("and all artifact main stats do not match the desired main stats", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.CIRCLET }),
            [ArtifactType.FLOWER]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ mainStat: Stat.ATK_PERCENT, type: ArtifactType.SANDS }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: Stat.DEF_PERCENT,
            [ArtifactType.FLOWER]: Stat.DEF_PERCENT,
            [ArtifactType.GOBLET]: Stat.DEF_PERCENT,
            [ArtifactType.PLUME]: Stat.DEF_PERCENT,
            [ArtifactType.SANDS]: Stat.DEF_PERCENT,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredMainStat).toBe(Stat.DEF_PERCENT);
            expect(details.mainStat).toBe(Stat.ATK_PERCENT);
            expect(details.satisfaction).toBe(false);
          }
        });
      });

      describe("and no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: getRandomEnumValue(Stat),
              type: ArtifactType.CIRCLET,
            }),
            [ArtifactType.FLOWER]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.SANDS }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {};
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });

    describe("When artifacts of some types are missing", () => {
      describe("and there is no artifact present for a desired main stat", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.FLOWER]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.FLOWER }),
            [ArtifactType.GOBLET]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.GOBLET }),
            [ArtifactType.PLUME]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.PLUME }),
            [ArtifactType.SANDS]: generateArtifact({ mainStat: getRandomEnumValue(Stat), type: ArtifactType.SANDS }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: Stat.ATK_PERCENT,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStat).toBe(Stat.ATK_PERCENT);
          expect(satisfactionResult.details[0].mainStat).toBeUndefined();
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("but artifacts for desired main stats are present", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: getRandomEnumValue(Stat),
              type: ArtifactType.CIRCLET,
            }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: artifacts[ArtifactType.CIRCLET]?.mainStat,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStat).toBe(desiredArtifactMainStats[ArtifactType.CIRCLET]);
          expect(satisfactionResult.details[0].mainStat).toBe(artifacts[ArtifactType.CIRCLET]?.mainStat);
          expect(satisfactionResult.details[0].satisfaction).toBe(true);
        });
      });

      describe("and no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: getRandomEnumValue(Stat),
              type: ArtifactType.CIRCLET,
            }),
          };
          const desiredArtifactMainStats: DesiredArtifactMainStats = {};
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });

    describe("When no artifacts exist", () => {
      describe("and there are desired main stats specified", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          const artifacts: BuildArtifacts = {};
          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: Stat.ATK_PERCENT,
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStat).toBe(desiredArtifactMainStats[ArtifactType.CIRCLET]);
          expect(satisfactionResult.details[0].mainStat).toBeUndefined();
          expect(satisfactionResult.details[0].satisfaction).toBe(false);
        });
      });

      describe("but no desired main stats are specified", () => {
        it("should indicate that the desired main stats are satisfied", () => {
          const artifacts: BuildArtifacts = {};
          const desiredArtifactMainStats: DesiredArtifactMainStats = {};
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(0);
        });
      });
    });
  });
});
