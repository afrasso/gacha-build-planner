import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomInitialSubStats } from "@/calculation/simulation/getrandominitialsubstats";
import { getSubStatRollValues } from "@/constants";
import { Stat, StatValue } from "@/types";

describe("getRandomInitialSubStats()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validateSubStats = ({
    expectedLength,
    mainStat,
    rarity,
    subStatValues,
  }: {
    expectedLength: number;
    mainStat: Stat;
    rarity: number;
    subStatValues: StatValue<Stat>[];
  }) => {
    expect(subStatValues.length).toBe(expectedLength);
    for (const subStatValue of subStatValues) {
      expect(subStatValue.stat).not.toBe(mainStat);
      const rollValues = getSubStatRollValues({ rarity, subStat: subStatValue.stat });
      expect(subStatValue.value).toBe(rollValues[0]);
    }
  };

  describe("When I get random initial sub-stats for an artifact with a rarity of 1", () => {
    it("should not return any sub-stats", () => {
      const mainStat = Stat.ATK_FLAT;
      const rarity = 1;
      validateSubStats({
        expectedLength: 0,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 2", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStat = Stat.ATK_FLAT;
      const rarity = 2;

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      validateSubStats({
        expectedLength: 0,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 1,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 3", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStat = Stat.ATK_FLAT;
      const rarity = 3;

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 1,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 2,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 4", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStat = Stat.ATK_FLAT;
      const rarity = 4;

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 2,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 3,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });
    });
  });

  describe("When I get random initial sub-stats for an artifact with a rarity of 5", () => {
    it("should return the appropriate number of distinct sub-stats", () => {
      const mainStat = Stat.ATK_FLAT;
      const rarity = 5;

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 3,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });

      // For determining the sub-stat count.
      randomSpy.mockReturnValueOnce(0.9);
      // For determining the sub-stat values.
      randomSpy.mockReturnValue(0);
      validateSubStats({
        expectedLength: 4,
        mainStat,
        rarity,
        subStatValues: getRandomInitialSubStats({ mainStat, rarity }),
      });
    });
  });
});
