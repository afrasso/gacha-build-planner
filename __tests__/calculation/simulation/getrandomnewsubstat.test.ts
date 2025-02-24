import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomNewSubStat } from "@/calculation/simulation/getrandomnewsubstat";
import { StatKey } from "@/types";

describe("getRandomNewSubStat()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("When I get a new sub-stat", () => {
    it("should not match the artifact main stat or any of the existing sub-stats", () => {
      const mainStat = StatKey.ATK_FLAT;
      const subStats = [StatKey.ATK_PERCENT, StatKey.CRIT_DMG, StatKey.CRIT_RATE];
      randomSpy.mockReturnValue(0);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.DEF_FLAT);
      randomSpy.mockReturnValue(0.1);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.DEF_FLAT);
      randomSpy.mockReturnValue(0.2);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.DEF_FLAT);
      randomSpy.mockReturnValue(0.3);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.4);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.ELEMENTAL_MASTERY);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.ENERGY_RECHARGE);
      randomSpy.mockReturnValue(0.6);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.ENERGY_RECHARGE);
      randomSpy.mockReturnValue(0.7);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.HP_FLAT);
      randomSpy.mockReturnValue(0.8);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.HP_FLAT);
      randomSpy.mockReturnValue(0.9);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomNewSubStat({ mainStat, subStats })).toBe(StatKey.HP_PERCENT);
    });
  });
});
