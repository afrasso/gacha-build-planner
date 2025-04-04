import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getInitialSubStatCount } from "@/calculation/simulation/getinitialsubstatcount";
import { IDataContext } from "@/contexts/DataContext";

describe("getInitialSubStatCount()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("When I get the initial number of sub-stats for an artifact", () => {
    it("should return the expected", () => {
      const dataContext = {
        getInitialArtifactSubStatCountOdds: (_) => [
          { count: 0, odds: 0.25 },
          { count: 1, odds: 0.25 },
          { count: 2, odds: 0.25 },
          { count: 3, odds: 0.25 },
        ],
      } as IDataContext;

      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(0);
      randomSpy.mockReturnValue(0.2);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(0);
      randomSpy.mockReturnValue(0.4);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(1);
      randomSpy.mockReturnValue(0.6);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(2);
      randomSpy.mockReturnValue(0.8);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(3);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ dataContext, rarity: 1 })).toBe(3);
    });
  });
});
