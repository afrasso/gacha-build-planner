import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { generateArtifact } from "@/__tests__/generators";
import { rollSubStats } from "@/calculation/simulation/rollsubstats";
import { IDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

describe("rollSubStats()", () => {
  let randomSpy: MockInstance<() => number>;
  let dataContext: IDataContext;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, "random");
    dataContext = {
      getArtifactLevelsPerSubStatRoll: () => 4,
      getArtifactMaxLevel: (_) => 20,
      getArtifactMaxSubStatCount: () => 4,
      getArtifactSubStatRelativeLikelihood: (_) => 1,
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

  describe("When I roll sub-stats for an artifact with a rarity of 1", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 4;

      const level = 0;
      const rarity = 1;
      const initialSubStats: Stat[] = [];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(1);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 2 with 0 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 4;

      const level = 0;
      const rarity = 2;
      const initialSubStats: Stat[] = [];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(1);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 2 with 1 initial substat", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 4;

      const level = 0;
      const rarity = 2;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const initialSubStats: Stat[] = [{ key: "ATK_PERCENT", value: atkPercentRollValues[0] }];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(2);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 3 with 1 initial substat", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 12;

      const level = 0;
      const rarity = 3;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const initialSubStats: Stat[] = [{ key: "ATK_PERCENT", value: atkPercentRollValues[0] }];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);

      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);

      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 3 with 2 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 12;

      const level = 1;
      const rarity = 3;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      const initialSubStats: Stat[] = [
        { key: "ATK_PERCENT", value: atkPercentRollValues[0] },
        { key: "ATK_FLAT", value: atkFlatRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 2)).toBeLessThan(1e-10);
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);

      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);

      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 4 with 2 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 16;

      const level = 1;
      const rarity = 4;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      const initialSubStats: Stat[] = [
        { key: "ATK_PERCENT", value: atkPercentRollValues[0] },
        { key: "ATK_FLAT", value: atkFlatRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 3)).toBeLessThan(1e-10);
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);

      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);

      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 4 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 16;

      const level = 1;
      const rarity = 4;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      const initialSubStats: Stat[] = [
        { key: "ATK_PERCENT", value: atkPercentRollValues[0] },
        { key: "ATK_FLAT", value: atkFlatRollValues[0] },
        { key: "DEF_FLAT", value: defFlatRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 4)).toBeLessThan(1e-10);
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);

      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 20;

      const level = 1;
      const rarity = 5;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      const initialSubStats: Stat[] = [
        { key: "ATK_PERCENT", value: atkPercentRollValues[0] },
        { key: "ATK_FLAT", value: atkFlatRollValues[0] },
        { key: "DEF_FLAT", value: defFlatRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 5)).toBeLessThan(1e-10);
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);

      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });

  describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
    it("should return the appropriate number of new sub-stats", () => {
      dataContext.getArtifactMaxLevel = (_) => 20;

      const level = 1;
      const rarity = 5;
      const atkPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "ATK_PERCENT",
      });
      const atkFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({ rarity, subStatKey: "ATK_FLAT" });
      const defFlatRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_FLAT",
      });
      const defPercentRollValues = dataContext.getPossibleArtifactSubStatRollValues({
        rarity,
        subStatKey: "DEF_PERCENT",
      });
      const initialSubStats: Stat[] = [
        { key: "ATK_PERCENT", value: atkPercentRollValues[0] },
        { key: "ATK_FLAT", value: atkFlatRollValues[0] },
        { key: "DEF_FLAT", value: defFlatRollValues[0] },
        { key: "DEF_PERCENT", value: defPercentRollValues[0] },
      ];
      const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

      randomSpy.mockReturnValue(0);
      const newSubStats = rollSubStats({ artifact, dataContext });
      expect(newSubStats.length).toBe(4);
      expect(newSubStats[0].key).toBe("ATK_PERCENT");
      expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 6)).toBeLessThan(1e-10);
      expect(newSubStats[1].key).toBe("ATK_FLAT");
      expect(newSubStats[1].value).toBe(atkFlatRollValues[0]);
      expect(newSubStats[2].key).toBe("DEF_FLAT");
      expect(newSubStats[2].value).toBe(defFlatRollValues[0]);
      expect(newSubStats[3].key).toBe("DEF_PERCENT");
      expect(newSubStats[3].value).toBe(defPercentRollValues[0]);
    });
  });
});
