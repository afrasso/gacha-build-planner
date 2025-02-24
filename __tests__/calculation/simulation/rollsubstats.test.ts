import { v4 as uuidv4 } from "uuid";
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { rollSubStats } from "@/calculation/simulation/rollsubstats";
import { getSubStatRollValues } from "@/constants";
import { Artifact, ArtifactMetric, ArtifactType, StatKey, Stat } from "@/types";

describe("rollSubStats()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const generateArtifact = ({
    level,
    rarity,
    subStats,
  }: {
    level: number;
    rarity: number;
    subStats: Stat<StatKey>[];
  }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      level,
      mainStat: StatKey.ATK_FLAT,
      metricsResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
        [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
        [ArtifactMetric.RATING]: { buildResults: {} },
      },
      rarity,
      setId: uuidv4(),
      subStats,
      type: ArtifactType.FLOWER,
    };
    return artifact;
  };

  describe("When I roll sub-stats for an artifact with a rarity of 1", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 1;
      const initialSubStats: Stat<StatKey>[] = [];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(1);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 2 with 0 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 2;
      const initialSubStats: Stat<StatKey>[] = [];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(1);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 2 with 1 initial substat", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 2;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const initialSubStats: Stat<StatKey>[] = [{ stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] }];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(2);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 3 with 1 initial substat", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 3;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const initialSubStats: Stat<StatKey>[] = [{ stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] }];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);

      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 3 with 2 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 3;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      const initialSubStats: Stat<StatKey>[] = [
        { stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] },
        { stat: StatKey.CRIT_DMG, value: critDmgRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 2)).toBeLessThan(1e-10);
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);

      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 4 with 2 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 4;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      const initialSubStats: Stat<StatKey>[] = [
        { stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] },
        { stat: StatKey.CRIT_DMG, value: critDmgRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 3)).toBeLessThan(1e-10);
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);

      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 4 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 4;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      const initialSubStats: Stat<StatKey>[] = [
        { stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] },
        { stat: StatKey.CRIT_DMG, value: critDmgRollValues[0] },
        { stat: StatKey.CRIT_RATE, value: critRateRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 4)).toBeLessThan(1e-10);
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);

      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 5;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      const initialSubStats: Stat<StatKey>[] = [
        { stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] },
        { stat: StatKey.CRIT_DMG, value: critDmgRollValues[0] },
        { stat: StatKey.CRIT_RATE, value: critRateRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 5)).toBeLessThan(1e-10);
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);

      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      const level = 1;
      const rarity = 5;
      const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: StatKey.ATK_PERCENT });
      const critDmgRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_DMG });
      const critRateRollValues = getSubStatRollValues({ rarity, subStat: StatKey.CRIT_RATE });
      const defFlatRollValues = getSubStatRollValues({ rarity, subStat: StatKey.DEF_FLAT });
      const initialSubStats: Stat<StatKey>[] = [
        { stat: StatKey.ATK_PERCENT, value: atkPercentRollValues[0] },
        { stat: StatKey.CRIT_DMG, value: critDmgRollValues[0] },
        { stat: StatKey.CRIT_RATE, value: critRateRollValues[0] },
        { stat: StatKey.DEF_FLAT, value: defFlatRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].stat).toBe(StatKey.ATK_PERCENT);
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 6)).toBeLessThan(1e-10);
      expect(newSubStats[1].stat).toBe(StatKey.CRIT_DMG);
      expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
      expect(newSubStats[2].stat).toBe(StatKey.CRIT_RATE);
      expect(newSubStats[2].value).toBe(critRateRollValues[0]);
      expect(newSubStats[3].stat).toBe(StatKey.DEF_FLAT);
      expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
    });
  });
});
