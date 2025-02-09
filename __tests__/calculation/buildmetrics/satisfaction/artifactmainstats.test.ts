import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { getRandomEnumValue } from "@/__tests__/testhelpers";
import { calculateArtifactMainStatsSatisfaction } from "@/calculation/buildmetrics/satisfaction/artifactmainstats";
import { Artifact, ArtifactMetric, ArtifactType, BuildArtifacts, DesiredArtifactMainStats, Stat } from "@/types";

describe("Artifact Main Stats Satisfaction Tests", () => {
  const generateArtifact = ({ mainStat, type }: { mainStat: Stat; type: ArtifactType }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      level: 20,
      mainStat,
      metricsResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
        [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
        [ArtifactMetric.RATING]: { buildResults: {} },
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
          const mainStats = {
            [ArtifactType.CIRCLET]: getRandomEnumValue(Stat),
            [ArtifactType.FLOWER]: getRandomEnumValue(Stat),
            [ArtifactType.GOBLET]: getRandomEnumValue(Stat),
            [ArtifactType.PLUME]: getRandomEnumValue(Stat),
            [ArtifactType.SANDS]: getRandomEnumValue(Stat),
          };

          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: mainStats[ArtifactType.CIRCLET],
              type: ArtifactType.CIRCLET,
            }),
            [ArtifactType.FLOWER]: generateArtifact({
              mainStat: mainStats[ArtifactType.FLOWER],
              type: ArtifactType.FLOWER,
            }),
            [ArtifactType.GOBLET]: generateArtifact({
              mainStat: mainStats[ArtifactType.GOBLET],
              type: ArtifactType.GOBLET,
            }),
            [ArtifactType.PLUME]: generateArtifact({
              mainStat: mainStats[ArtifactType.PLUME],
              type: ArtifactType.PLUME,
            }),
            [ArtifactType.SANDS]: generateArtifact({
              mainStat: mainStats[ArtifactType.SANDS],
              type: ArtifactType.SANDS,
            }),
          };

          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: [mainStats[ArtifactType.CIRCLET]],
            [ArtifactType.FLOWER]: [mainStats[ArtifactType.FLOWER]],
            [ArtifactType.GOBLET]: [mainStats[ArtifactType.GOBLET]],
            [ArtifactType.PLUME]: [mainStats[ArtifactType.PLUME]],
            [ArtifactType.SANDS]: [mainStats[ArtifactType.SANDS]],
          };

          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const artifactType = details.artifactType;
            expect(details.desiredMainStats).toBe(desiredArtifactMainStats[artifactType]);
            expect(details.mainStat).toBe(artifacts[artifactType]?.mainStat);
            expect(details.satisfaction).toBe(true);
          }
        });
      });

      describe("and one artifact main stat does not match the desired main stats", () => {
        it("should indicate that the desired main stats are not satisfied", () => {
          const mainStats = {
            [ArtifactType.CIRCLET]: Stat.ATK_PERCENT,
            [ArtifactType.FLOWER]: getRandomEnumValue(Stat),
            [ArtifactType.GOBLET]: getRandomEnumValue(Stat),
            [ArtifactType.PLUME]: getRandomEnumValue(Stat),
            [ArtifactType.SANDS]: getRandomEnumValue(Stat),
          };

          const artifacts: BuildArtifacts = {
            [ArtifactType.CIRCLET]: generateArtifact({
              mainStat: mainStats[ArtifactType.CIRCLET],
              type: ArtifactType.CIRCLET,
            }),
            [ArtifactType.FLOWER]: generateArtifact({
              mainStat: mainStats[ArtifactType.FLOWER],
              type: ArtifactType.FLOWER,
            }),
            [ArtifactType.GOBLET]: generateArtifact({
              mainStat: mainStats[ArtifactType.GOBLET],
              type: ArtifactType.GOBLET,
            }),
            [ArtifactType.PLUME]: generateArtifact({
              mainStat: mainStats[ArtifactType.PLUME],
              type: ArtifactType.PLUME,
            }),
            [ArtifactType.SANDS]: generateArtifact({
              mainStat: mainStats[ArtifactType.SANDS],
              type: ArtifactType.SANDS,
            }),
          };

          const desiredArtifactMainStats: DesiredArtifactMainStats = {
            [ArtifactType.CIRCLET]: [Stat.DEF_PERCENT],
            [ArtifactType.FLOWER]: [mainStats[ArtifactType.FLOWER]],
            [ArtifactType.GOBLET]: [mainStats[ArtifactType.GOBLET]],
            [ArtifactType.PLUME]: [mainStats[ArtifactType.PLUME]],
            [ArtifactType.SANDS]: [mainStats[ArtifactType.SANDS]],
          };

          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            const artifactType = details.artifactType;
            if (artifactType === ArtifactType.CIRCLET) {
              expect(details.desiredMainStats).toEqual([Stat.DEF_PERCENT]);
              expect(details.mainStat).toBe(Stat.ATK_PERCENT);
              expect(details.satisfaction).toBe(false);
            } else {
              expect(details.desiredMainStats).toBe(desiredArtifactMainStats[artifactType]);
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
            [ArtifactType.CIRCLET]: [Stat.DEF_PERCENT],
            [ArtifactType.FLOWER]: [Stat.DEF_PERCENT],
            [ArtifactType.GOBLET]: [Stat.DEF_PERCENT],
            [ArtifactType.PLUME]: [Stat.DEF_PERCENT],
            [ArtifactType.SANDS]: [Stat.DEF_PERCENT],
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          for (const details of satisfactionResult.details) {
            expect(details.desiredMainStats).toEqual([Stat.DEF_PERCENT]);
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
            [ArtifactType.CIRCLET]: [Stat.ATK_PERCENT],
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStats).toEqual([Stat.ATK_PERCENT]);
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
            [ArtifactType.CIRCLET]: artifacts[ArtifactType.CIRCLET]?.mainStat
              ? [artifacts[ArtifactType.CIRCLET]?.mainStat]
              : [],
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(1);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStats).toBe(desiredArtifactMainStats[ArtifactType.CIRCLET]);
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
            [ArtifactType.CIRCLET]: [Stat.ATK_PERCENT],
          };
          const satisfactionResult = calculateArtifactMainStatsSatisfaction({ artifacts, desiredArtifactMainStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(Object.values(desiredArtifactMainStats).length);
          expect(satisfactionResult.details[0].artifactType).toBe(ArtifactType.CIRCLET);
          expect(satisfactionResult.details[0].desiredMainStats).toBe(desiredArtifactMainStats[ArtifactType.CIRCLET]);
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
