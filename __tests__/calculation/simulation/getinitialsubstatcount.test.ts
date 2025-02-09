import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getInitialSubStatCount } from "@/calculation/simulation/getinitialsubstatcount";

describe("getInitialSubStatCount()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("When I get the initial number of sub-stats for an artifact with a rarity of 1", () => {
    it("should always have 0 sub stats", () => {
      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ rarity: 1 })).toBe(0);
      randomSpy.mockReturnValue(0.5);
      expect(getInitialSubStatCount({ rarity: 1 })).toBe(0);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ rarity: 1 })).toBe(0);
    });
  });

  describe("When I get the initial number of sub-stats for an artifact with a rarity of 2", () => {
    it("should always have an appropriate number of sub stats", () => {
      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ rarity: 2 })).toBe(0);
      randomSpy.mockReturnValue(0.5);
      expect(getInitialSubStatCount({ rarity: 2 })).toBe(0);
      randomSpy.mockReturnValue(0.75);
      expect(getInitialSubStatCount({ rarity: 2 })).toBe(0);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ rarity: 2 })).toBe(1);
    });
  });

  describe("When I get the initial number of sub-stats for an artifact with a rarity of 3", () => {
    it("should always have an appropriate number of sub stats", () => {
      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ rarity: 3 })).toBe(1);
      randomSpy.mockReturnValue(0.5);
      expect(getInitialSubStatCount({ rarity: 3 })).toBe(1);
      randomSpy.mockReturnValue(0.75);
      expect(getInitialSubStatCount({ rarity: 3 })).toBe(1);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ rarity: 3 })).toBe(2);
    });
  });

  describe("When I get the initial number of sub-stats for an artifact with a rarity of 4", () => {
    it("should always have an appropriate number of sub stats", () => {
      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ rarity: 4 })).toBe(2);
      randomSpy.mockReturnValue(0.5);
      expect(getInitialSubStatCount({ rarity: 4 })).toBe(2);
      randomSpy.mockReturnValue(0.75);
      expect(getInitialSubStatCount({ rarity: 4 })).toBe(2);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ rarity: 4 })).toBe(3);
    });
  });

  describe("When I get the initial number of sub-stats for an artifact with a rarity of 5", () => {
    it("should always have an appropriate number of sub stats", () => {
      randomSpy.mockReturnValue(0);
      expect(getInitialSubStatCount({ rarity: 5 })).toBe(3);
      randomSpy.mockReturnValue(0.5);
      expect(getInitialSubStatCount({ rarity: 5 })).toBe(3);
      randomSpy.mockReturnValue(0.75);
      expect(getInitialSubStatCount({ rarity: 5 })).toBe(3);
      randomSpy.mockReturnValue(0.99);
      expect(getInitialSubStatCount({ rarity: 5 })).toBe(4);
    });
  });
});
