import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomNewSubStat } from "@/calculation/simulation/getrandomnewsubstat";
import { IDataContext } from "@/contexts/DataContext";

describe("getRandomNewSubStat()", () => {
  let randomSpy: MockInstance<() => number>;
  let dataContext: IDataContext;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
    dataContext = {
      getArtifactSubStatRelativeLikelihood: (_) => 1,
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

  describe("When I get a new sub-stat", () => {
    it("should not match the artifact main stat or any of the existing sub-stats", () => {
      const mainStatKey = "ATK_FLAT";
      const subStatKeys = ["ATK_PERCENT"];
      randomSpy.mockReturnValue(0);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_FLAT");
      randomSpy.mockReturnValue(0.1);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_FLAT");
      randomSpy.mockReturnValue(0.2);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_FLAT");
      randomSpy.mockReturnValue(0.3);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_PERCENT");
      randomSpy.mockReturnValue(0.4);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_PERCENT");
      randomSpy.mockReturnValue(0.48);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("DEF_PERCENT");
      randomSpy.mockReturnValue(0.52);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_FLAT");
      randomSpy.mockReturnValue(0.6);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_FLAT");
      randomSpy.mockReturnValue(0.7);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_FLAT");
      randomSpy.mockReturnValue(0.8);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_PERCENT");
      randomSpy.mockReturnValue(0.9);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_PERCENT");
      randomSpy.mockReturnValue(0.99);
      expect(getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys })).toBe("HP_PERCENT");
    });
  });
});
