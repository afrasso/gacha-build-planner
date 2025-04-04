import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomMainStat } from "@/calculation/simulation/getrandommainstat";
import { IDataContext } from "@/contexts/DataContext";

describe("getRandomMainStat()", () => {
  let randomSpy: MockInstance<() => number>;
  let dataContext: IDataContext;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
    dataContext = {
      getArtifactMainStatOdds: (_) => 1 / 6,
      getPossibleArtifactMainStats: (_) => [
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

  describe("When I get a random main stat for an artifact of type ArtifactType.CIRCLET", () => {
    it("should be an appropriate stat", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("ATK_FLAT");
      randomSpy.mockReturnValue(0.1);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("ATK_FLAT");
      randomSpy.mockReturnValue(0.2);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("ATK_PERCENT");
      randomSpy.mockReturnValue(0.3);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("ATK_PERCENT");
      randomSpy.mockReturnValue(0.4);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("DEF_FLAT");
      randomSpy.mockReturnValue(0.48);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("DEF_FLAT");
      randomSpy.mockReturnValue(0.52);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("DEF_PERCENT");
      randomSpy.mockReturnValue(0.6);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("DEF_PERCENT");
      randomSpy.mockReturnValue(0.7);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("HP_FLAT");
      randomSpy.mockReturnValue(0.8);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("HP_FLAT");
      randomSpy.mockReturnValue(0.9);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("HP_PERCENT");
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ artifactTypeKey: "CIRCLET", dataContext })).toBe("HP_PERCENT");
    });
  });
});
