import { TEST_CHARACTER_ID as GENSHIN_CHARACTER_ID, TEST_SET_ID as GENSHIN_SET_ID, TEST_WEAPON_ID as GENSHIN_WEAPON_ID } from "./genshindatacontext";
import { TEST_CHARACTER_ID as HSR_CHARACTER_ID, TEST_SET_ID as HSR_SET_ID, TEST_WEAPON_ID as HSR_WEAPON_ID } from "./starraildatacontext";

export const goodImportFixture = {
  artifacts: [
    {
      level: 20,
      location: "TestChar",
      lock: false,
      mainStatKey: "hp",
      rarity: 5,
      setKey: "TestSet",
      slotKey: "flower",
      substats: [{ key: "atk", value: 16 }],
    },
  ],
  characters: [
    {
      ascension: 6,
      constellation: 0,
      key: "TestChar",
      level: 90,
      talent: { auto: 1, burst: 1, skill: 1 },
    },
  ],
  format: "GOOD",
  source: "test",
  version: 5,
  weapons: [
    {
      ascension: 6,
      key: "TestWeapon",
      level: 90,
      location: "TestChar",
      lock: false,
      refinement: 1,
    },
  ],
};

export const hsrScannerImportFixture = {
  build: "test",
  characters: [
    {
      ascension: 6,
      eidolon: 0,
      id: HSR_CHARACTER_ID,
      level: 80,
      name: "TestTrailblazer",
      path: "Destruction",
      skills: { basic: 1, skill: 1, talent: 1, ult: 1 },
      traces: {
        ability_1: false,
        ability_2: false,
        ability_3: false,
        stat_1: false,
        stat_2: false,
        stat_3: false,
        stat_4: false,
        stat_5: false,
        stat_6: false,
        stat_7: false,
        stat_8: false,
        stat_9: false,
        stat_10: false,
      },
    },
  ],
  light_cones: [
    {
      ascension: 6,
      id: HSR_WEAPON_ID,
      level: 80,
      location: HSR_CHARACTER_ID,
      lock: false,
      name: "TestCone",
      superimposition: 1,
    },
  ],
  metadata: { trailblazer: "Destruction", uid: null },
  relics: [
    {
      _uid: "relic-1",
      discard: false,
      level: 15,
      location: HSR_CHARACTER_ID,
      lock: false,
      mainstat: "HP",
      name: "Test Relic",
      rarity: 5,
      set_id: HSR_SET_ID,
      slot: "Head",
      substats: [{ key: "ATK", value: 50 }],
    },
  ],
  source: "test",
  version: 1,
};

export const expectedGenshinImportIds = {
  characterId: GENSHIN_CHARACTER_ID,
  setId: GENSHIN_SET_ID,
  weaponId: GENSHIN_WEAPON_ID,
};
