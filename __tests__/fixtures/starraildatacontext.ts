import { IDataContext } from "@/contexts/DataContext";
import { validateImport as validateHsrImport } from "@/dataimport/hsrscanner";
import { Build } from "@/types/starrail/build";
import { Character } from "@/types/starrail/character";
import { Weapon } from "@/types/starrail/weapon";

import { mockDataContext } from "../testhelpers";

export const TEST_CHARACTER_ID = "1001";
export const TEST_WEAPON_ID = "2001";
export const TEST_SET_ID = "sr-set-1";

export const testStarRailCharacter = new Character({
  combatType: "Fire",
  iconUrl: "",
  id: TEST_CHARACTER_ID,
  maxLvlStats: { ATK: 250, DEF: 500, HP: 9000, SPD: 100 },
  name: "TestTrailblazer",
  path: "Destruction",
  rarity: 5,
  statTraces: {},
});

export const testStarRailWeapon = new Weapon({
  iconUrl: "",
  id: TEST_WEAPON_ID,
  maxLvlStats: { ATK: 500, DEF: 0, HP: 0 },
  name: "TestCone",
  path: "Destruction",
  rarity: 5,
});

export function createStarRailDataContext(overrides?: Partial<IDataContext>): IDataContext {
  const testArtifactSet = {
    hasArtifactTypes: {
      BODY: true,
      FEET: true,
      HAND: true,
      HEAD: true,
      NECK: true,
    },
    iconUrl: "",
    iconUrls: {},
    id: TEST_SET_ID,
    name: "TestRelicSet",
    rarities: [4, 5],
    setBonusCounts: [2, 4],
  };

  return mockDataContext({
    constructBuild: (args) => new Build(args),
    getArtifactMainStatMaxValue: ({ rarity }) => (rarity === 5 ? 4300 : 3200),
    getArtifactSet: (id) => {
      if (id === TEST_SET_ID) {
        return testArtifactSet;
      }
      throw new Error(`Unknown artifact set ${id}`);
    },
    getArtifactSets: () => [testArtifactSet],
    getCharacter: (id) => {
      if (id === TEST_CHARACTER_ID) {
        return testStarRailCharacter;
      }
      throw new Error(`Unknown character ${id}`);
    },
    getCharacters: () => [testStarRailCharacter],
    getWeapon: (id) => {
      if (id === TEST_WEAPON_ID) {
        return testStarRailWeapon;
      }
      throw new Error(`Unknown weapon ${id}`);
    },
    getWeapons: () => [testStarRailWeapon],
    resolvePath: (path) => path,
    validateImport: validateHsrImport,
    ...overrides,
  });
}
