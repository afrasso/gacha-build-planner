import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomInitialSubStats } from "@/calculation/simulation/getrandominitialsubstats";
import { IDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

describe("getRandomInitialSubStats()", () => {
  let randomSpy: MockInstance<() => number>;
  let dataContext: IDataContext;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
    dataContext = {
      getArtifactSubStatRelativeLikelihood: (_) => 1,
      getInitialArtifactSubStatCountOdds: (_) => [{ count: 0, odds: 1 }],
      getPossibleArtifactSubStatRollValues: (_) => [1, 2, 3, 4],
      getPossibleArtifactSubStats: () => [
        "ATK_FLAT",
        "ATK_PERCENT",
        "DEF_FLAT",
        "DEF_PERCENT",
        "HP_FLAT",
        "HP_PERCENT",
      ],
    } as IDataContext;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validateSubStats = ({
    expectedLength,
    mainStatKey,
    rarity,
    subStats,
  }: {
    expectedLength: number;
    mainStatKey: string;
    rarity: number;
    subStats: Stat[];
  }) => {
    expect(subStats.length).toBe(expectedLength);
    for (const subStat of subStats) {
      expect(subStat.key).not.toBe(mainStatKey);
      const rollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: subStat.key });
      expect(subStat.value).toBe(rollValues[0]);
    }
  };

  describe("When I get random initial sub-stats for an artifact with a rarity of 1", () => {
    it("should not return any sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const rarity = 1;

      validateSubStats({
        expectedLength: 0,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 2", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const rarity = 2;

      dataContext.getInitialArtifactSubStatCountOdds = () => [
        { count: 0, odds: 0.8 },
        { count: 1, odds: 0.2 },
      ];

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      validateSubStats({
        expectedLength: 0,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 1,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 3", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const rarity = 3;

      dataContext.getInitialArtifactSubStatCountOdds = () => [
        { count: 1, odds: 0.8 },
        { count: 2, odds: 0.2 },
      ];

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 1,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 2,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 4", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const rarity = 4;

      dataContext.getInitialArtifactSubStatCountOdds = () => [
        { count: 2, odds: 0.8 },
        { count: 3, odds: 0.2 },
      ];

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 2,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 3,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 5", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const rarity = 5;

      dataContext.getInitialArtifactSubStatCountOdds = () => [
        { count: 3, odds: 0.8 },
        { count: 4, odds: 0.2 },
      ];

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 3,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 4,
        mainStatKey,
        rarity,
        subStats: getRandomInitialSubStats({ dataContext, mainStatKey, rarity }),
      });
    });
  });
});
