import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getRandomMainStat } from "@/calculation/simulation/getrandommainstat";
import { ArtifactType, StatKey } from "@/types";

describe("getRandomMainStat()", () => {
  let randomSpy: MockInstance<() => number>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("When I get a random main stat for an artifact of type ArtifactType.CIRCLET", () => {
    it("should be an appropriate stat", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.1);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.2);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.3);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.CRIT_DMG);
      randomSpy.mockReturnValue(0.4);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.CRIT_RATE);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.6);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.65);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.ELEMENTAL_MASTERY);
      randomSpy.mockReturnValue(0.7);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.HEALING_BONUS);
      randomSpy.mockReturnValue(0.8);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.9);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(StatKey.HP_PERCENT);
    });
  });

  describe("When I get a random main stat for an artifact of type ArtifactType.FLOWER", () => {
    it("should always be HP_FLAT", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(StatKey.HP_FLAT);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(StatKey.HP_FLAT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(StatKey.HP_FLAT);
    });
  });

  describe("When I get a random main stat for an artifact of type ArtifactType.GOBLET", () => {
    it("should be an appropriate stat", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.1);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.2);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.3);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.4);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_ANEMO);
      randomSpy.mockReturnValue(0.45);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_CRYO);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_DENDRO);
      randomSpy.mockReturnValue(0.55);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_ELECTRO);
      randomSpy.mockReturnValue(0.6);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_GEO);
      randomSpy.mockReturnValue(0.65);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_HYDRO);
      randomSpy.mockReturnValue(0.7);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_PHYSICAL);
      randomSpy.mockReturnValue(0.75);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.DMG_BONUS_PYRO);
      randomSpy.mockReturnValue(0.8);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.ELEMENTAL_MASTERY);
      randomSpy.mockReturnValue(0.9);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(StatKey.HP_PERCENT);
    });
  });

  describe("When I get a random main stat for an artifact of type ArtifactType.PLUME", () => {
    it("should always be ATK_FLAT", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(StatKey.ATK_FLAT);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(StatKey.ATK_FLAT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(StatKey.ATK_FLAT);
    });
  });

  describe("When I get a random main stat for an artifact of type ArtifactType.SANDS", () => {
    it("should be an appropriate stat", () => {
      randomSpy.mockReturnValue(0);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.1);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.2);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.ATK_PERCENT);
      randomSpy.mockReturnValue(0.3);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.4);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.5);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.DEF_PERCENT);
      randomSpy.mockReturnValue(0.6);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.ELEMENTAL_MASTERY);
      randomSpy.mockReturnValue(0.7);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.ENERGY_RECHARGE);
      randomSpy.mockReturnValue(0.8);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.9);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.HP_PERCENT);
      randomSpy.mockReturnValue(0.99);
      expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(StatKey.HP_PERCENT);
    });
  });
});
