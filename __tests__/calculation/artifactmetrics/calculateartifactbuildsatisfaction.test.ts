import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { calculateArtifactBuildSatisfaction } from "@/calculation/artifactmetrics/calculateartifactbuildsatisfaction";
import * as statsModule from "@/calculation/stats";
import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  Artifact,
  ArtifactMetric,
  ArtifactSet,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  Character,
  OverallStat,
  Stat,
  Weapon,
} from "@/types";

describe("calculateArtifactBuildSatisfaction()", () => {
  let artifactSet: ArtifactSet;
  let character: Character;
  let weapon: Weapon;
  const genshinDataContext: GenshinDataContext = {
    artifactSets: [],
    characters: [],
    getArtifactSet: () => artifactSet,
    getCharacter: () => character,
    getWeapon: () => weapon,
    weapons: [],
  };

  const generateArtifact = ({ setId, type }: { setId?: string; type: ArtifactType }) => {
    const artifact: Artifact = {
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      level: 0,
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
      rarity: 5,
      setId: setId || uuidv4(),
      subStats: [],
      type,
    };
    return artifact;
  };

  const generateBuild = (): Build => {
    const build: Build = {
      artifacts: {},
      characterId: uuidv4(),
      desiredArtifactMainStats: {},
      desiredArtifactSetBonuses: [],
      desiredOverallStats: [],
      lastUpdatedDate: new Date().toISOString(),
      sortOrder: 0,
    };
    return build;
  };

  const generateOverallStats = (): Record<OverallStat, number> => {
    return {
      [OverallStat.ATK]: 1000,
      [OverallStat.CRIT_DMG]: 100,
      [OverallStat.CRIT_RATE]: 100,
      [OverallStat.DEF]: 1000,
      [OverallStat.DMG_BONUS_ANEMO]: 0,
      [OverallStat.DMG_BONUS_CRYO]: 0,
      [OverallStat.DMG_BONUS_DENDRO]: 0,
      [OverallStat.DMG_BONUS_ELECTRO]: 0,
      [OverallStat.DMG_BONUS_GEO]: 0,
      [OverallStat.DMG_BONUS_HYDRO]: 0,
      [OverallStat.DMG_BONUS_PHYSICAL]: 0,
      [OverallStat.DMG_BONUS_PYRO]: 0,
      [OverallStat.ELEMENTAL_MASTERY]: 100,
      [OverallStat.ENERGY_RECHARGE]: 100,
      [OverallStat.HEALING_BONUS]: 0,
      [OverallStat.MAX_HP]: 10000,
    };
  };

  beforeEach(() => {
    artifactSet = {} as ArtifactSet;
    character = {} as Character;
    weapon = {} as Weapon;
  });

  describe("When I have a build with an existing artifact", () => {
    describe("and the existing artifact is part of the desired set bonus", () => {
      describe("and I have a new artifact that is not part of the desired set bonus", () => {
        it("should result in a satisfaction of 0", () => {
          const setId = uuidv4();

          const build = generateBuild();
          build.artifacts.CIRCLET = generateArtifact({ setId, type: ArtifactType.CIRCLET });
          build.artifacts.FLOWER = generateArtifact({ setId, type: ArtifactType.FLOWER });
          build.artifacts.GOBLET = generateArtifact({ setId, type: ArtifactType.GOBLET });
          build.artifacts.PLUME = generateArtifact({ setId, type: ArtifactType.PLUME });
          // Set the sands artifact to have a different set, so any change to the set of the other four artifacts would
          // result in a lack of satisfaction.
          build.artifacts.SANDS = generateArtifact({ type: ArtifactType.CIRCLET });
          build.desiredArtifactSetBonuses.push({
            bonusType: ArtifactSetBonusType.FOUR_PIECE,
            setId,
          });

          const artifact = generateArtifact({ type: ArtifactType.CIRCLET });

          const overallStats = generateOverallStats();
          vi.spyOn(statsModule, "calculateStats").mockReturnValue(overallStats);

          const result = calculateArtifactBuildSatisfaction({
            artifact,
            build,
            calculationType: ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
            genshinDataContext,
            iterations: 1,
          });

          expect(result).toBe(0);
        });
      });
    });
  });
});
