import { v4 as uuidv4 } from "uuid";
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { getArtifactMaxLevel, getSubStatRollValues } from "@/constants";
import {
  getInitialSubStatCount,
  getRandomInitialSubStats,
  getRandomMainStat,
  getRandomNewSubStat,
  rollArtifact,
  rollSubStats,
} from "@/simulation/artifact";
import { Artifact, ArtifactMetric, ArtifactType, Stat, StatValue } from "@/types";

describe("Artifact Simulation Tests", () => {
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
    subStats: StatValue<Stat>[];
  }): Artifact => {
    const artifact: Artifact = {
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      level,
      mainStat: Stat.ATK_FLAT,
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

  describe("getInitialSubStatCount()", () => {
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

  describe("getRandomInitialSubStats()", () => {
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

  describe("getRandomMainStat()", () => {
    describe("When I get a random main stat for an artifact of type ArtifactType.CIRCLET", () => {
      it("should be an appropriate stat", () => {
        randomSpy.mockReturnValue(0);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.1);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.2);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.3);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.CRIT_DMG);
        randomSpy.mockReturnValue(0.4);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.CRIT_RATE);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.6);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.65);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.ELEMENTAL_MASTERY);
        randomSpy.mockReturnValue(0.7);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.HEALING_BONUS);
        randomSpy.mockReturnValue(0.8);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.9);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomMainStat({ type: ArtifactType.CIRCLET })).toBe(Stat.HP_PERCENT);
      });
    });

    describe("When I get a random main stat for an artifact of type ArtifactType.FLOWER", () => {
      it("should always be HP_FLAT", () => {
        randomSpy.mockReturnValue(0);
        expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(Stat.HP_FLAT);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(Stat.HP_FLAT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomMainStat({ type: ArtifactType.FLOWER })).toBe(Stat.HP_FLAT);
      });
    });

    describe("When I get a random main stat for an artifact of type ArtifactType.GOBLET", () => {
      it("should be an appropriate stat", () => {
        randomSpy.mockReturnValue(0);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.1);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.2);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.3);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.4);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_ANEMO);
        randomSpy.mockReturnValue(0.45);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_CRYO);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_DENDRO);
        randomSpy.mockReturnValue(0.55);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_ELECTRO);
        randomSpy.mockReturnValue(0.6);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_GEO);
        randomSpy.mockReturnValue(0.65);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_HYDRO);
        randomSpy.mockReturnValue(0.7);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_PHYSICAL);
        randomSpy.mockReturnValue(0.75);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.DMG_BONUS_PYRO);
        randomSpy.mockReturnValue(0.8);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.ELEMENTAL_MASTERY);
        randomSpy.mockReturnValue(0.9);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomMainStat({ type: ArtifactType.GOBLET })).toBe(Stat.HP_PERCENT);
      });
    });

    describe("When I get a random main stat for an artifact of type ArtifactType.PLUME", () => {
      it("should always be ATK_FLAT", () => {
        randomSpy.mockReturnValue(0);
        expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(Stat.ATK_FLAT);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(Stat.ATK_FLAT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomMainStat({ type: ArtifactType.PLUME })).toBe(Stat.ATK_FLAT);
      });
    });

    describe("When I get a random main stat for an artifact of type ArtifactType.SANDS", () => {
      it("should be an appropriate stat", () => {
        randomSpy.mockReturnValue(0);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.1);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.2);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.ATK_PERCENT);
        randomSpy.mockReturnValue(0.3);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.4);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.6);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.ELEMENTAL_MASTERY);
        randomSpy.mockReturnValue(0.7);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.ENERGY_RECHARGE);
        randomSpy.mockReturnValue(0.8);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.9);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomMainStat({ type: ArtifactType.SANDS })).toBe(Stat.HP_PERCENT);
      });
    });
  });

  describe("getRandomNewSubStat()", () => {
    describe("When I get a new sub-stat", () => {
      it("should not match the artifact main stat or any of the existing sub-stats", () => {
        const mainStat = Stat.ATK_FLAT;
        const subStats = [Stat.ATK_PERCENT, Stat.CRIT_DMG, Stat.CRIT_RATE];
        randomSpy.mockReturnValue(0);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.DEF_FLAT);
        randomSpy.mockReturnValue(0.1);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.DEF_FLAT);
        randomSpy.mockReturnValue(0.2);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.DEF_FLAT);
        randomSpy.mockReturnValue(0.3);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.DEF_PERCENT);
        randomSpy.mockReturnValue(0.4);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.ELEMENTAL_MASTERY);
        randomSpy.mockReturnValue(0.5);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.ENERGY_RECHARGE);
        randomSpy.mockReturnValue(0.6);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.ENERGY_RECHARGE);
        randomSpy.mockReturnValue(0.7);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.HP_FLAT);
        randomSpy.mockReturnValue(0.8);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.HP_FLAT);
        randomSpy.mockReturnValue(0.9);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.HP_PERCENT);
        randomSpy.mockReturnValue(0.99);
        expect(getRandomNewSubStat({ mainStat, subStats })).toBe(Stat.HP_PERCENT);
      });
    });
  });

  describe("rollArtifact()", () => {
    describe("When I roll an artifact", () => {
      it("should have all of the same values except for the level and sub-stats", () => {
        const level = 1;
        const rarity = 1;
        const subStats: StatValue<Stat>[] = [];
        const artifact = generateArtifact({ level, rarity, subStats });
        const rolledArtifact = rollArtifact({ artifact });
        expect(rolledArtifact.id).toBe(artifact.id);
        expect(rolledArtifact.lastUpdatedDate).toBe(rolledArtifact.lastUpdatedDate);
        expect(rolledArtifact.level).toBe(getArtifactMaxLevel({ rarity }));
        expect(rolledArtifact.mainStat).toBe(artifact.mainStat);
        expect(rolledArtifact.rarity).toBe(artifact.rarity);
        expect(rolledArtifact.setId).toBe(artifact.setId);
        expect(rolledArtifact.type).toBe(artifact.type);
      });
    });
  });

  describe("rollSubStats()", () => {
    describe("When I roll sub-stats for an artifact with a rarity of 1", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 1;
        const initialSubStats: StatValue<Stat>[] = [];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(1);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 2 with 0 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 2;
        const initialSubStats: StatValue<Stat>[] = [];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(1);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 2 with 1 initial substat", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 2;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const initialSubStats: StatValue<Stat>[] = [{ stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] }];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(2);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 3 with 1 initial substat", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 3;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const initialSubStats: StatValue<Stat>[] = [{ stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] }];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(newSubStats[0].value).toBe(atkPercentRollValues[0]);

        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);

        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 3 with 2 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 3;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        const initialSubStats: StatValue<Stat>[] = [
          { stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] },
          { stat: Stat.CRIT_DMG, value: critDmgRollValues[0] },
        ];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 2)).toBeLessThan(1e-10);
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);

        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 4 with 2 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 4;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        const initialSubStats: StatValue<Stat>[] = [
          { stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] },
          { stat: Stat.CRIT_DMG, value: critDmgRollValues[0] },
        ];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 3)).toBeLessThan(1e-10);
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);

        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);

        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 4 with 3 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 4;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        const initialSubStats: StatValue<Stat>[] = [
          { stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] },
          { stat: Stat.CRIT_DMG, value: critDmgRollValues[0] },
          { stat: Stat.CRIT_RATE, value: critRateRollValues[0] },
        ];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 4)).toBeLessThan(1e-10);
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);

        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 5;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        const initialSubStats: StatValue<Stat>[] = [
          { stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] },
          { stat: Stat.CRIT_DMG, value: critDmgRollValues[0] },
          { stat: Stat.CRIT_RATE, value: critRateRollValues[0] },
        ];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 5)).toBeLessThan(1e-10);
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);

        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });

    describe("When I roll sub-stats for an artifact with a rarity of 5 with 3 initial substats", () => {
      it("should return the appropriate number of new sub-stats", () => {
        const level = 1;
        const rarity = 5;
        const atkPercentRollValues = getSubStatRollValues({ rarity, subStat: Stat.ATK_PERCENT });
        const critDmgRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_DMG });
        const critRateRollValues = getSubStatRollValues({ rarity, subStat: Stat.CRIT_RATE });
        const defFlatRollValues = getSubStatRollValues({ rarity, subStat: Stat.DEF_FLAT });
        const initialSubStats: StatValue<Stat>[] = [
          { stat: Stat.ATK_PERCENT, value: atkPercentRollValues[0] },
          { stat: Stat.CRIT_DMG, value: critDmgRollValues[0] },
          { stat: Stat.CRIT_RATE, value: critRateRollValues[0] },
          { stat: Stat.DEF_FLAT, value: defFlatRollValues[0] },
        ];
        const artifact = generateArtifact({ level, rarity, subStats: initialSubStats });

        randomSpy.mockReturnValue(0);
        const newSubStats = rollSubStats({ artifact });
        expect(newSubStats.length).toBe(4);
        expect(newSubStats[0].stat).toBe(Stat.ATK_PERCENT);
        expect(Math.abs(newSubStats[0].value - atkPercentRollValues[0] * 6)).toBeLessThan(1e-10);
        expect(newSubStats[1].stat).toBe(Stat.CRIT_DMG);
        expect(newSubStats[1].value).toBe(critDmgRollValues[0]);
        expect(newSubStats[2].stat).toBe(Stat.CRIT_RATE);
        expect(newSubStats[2].value).toBe(critRateRollValues[0]);
        expect(newSubStats[3].stat).toBe(Stat.DEF_FLAT);
        expect(newSubStats[3].value).toBe(defFlatRollValues[0]);
      });
    });
  });
});
