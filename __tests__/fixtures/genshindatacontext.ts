import { IDataContext } from "@/contexts/DataContext";
import { validateImport as validateGoodImport } from "@/dataimport/good";
import { Build } from "@/types/genshin/build";
import { Character } from "@/types/genshin/character";
import { Weapon } from "@/types/genshin/weapon";

import { mockDataContext } from "../testhelpers";

export const TEST_CHARACTER_ID = "genshin-char-1";
export const TEST_WEAPON_ID = "genshin-weapon-1";
export const TEST_SET_ID = "genshin-set-1";

export const testGenshinCharacter = new Character({
  ascensionStat: "CRIT_DMG",
  element: "PYRO",
  iconUrl: "",
  id: TEST_CHARACTER_ID,
  maxLvlStats: { ascensionStat: 19.2, ATK: 300, DEF: 800, HP: 10000 },
  name: "Test Char",
  rarity: 5,
  weaponType: "CLAYMORE",
});

export const testGenshinWeapon = new Weapon({
  iconUrl: "",
  id: TEST_WEAPON_ID,
  mainStatKey: "ATK_PERCENT",
  maxLvlStats: { ATK: 600, mainStatValue: 0 },
  name: "Test Weapon",
  rarity: 5,
  type: "CLAYMORE",
});

export function createGenshinDataContext(overrides?: Partial<IDataContext>): IDataContext {
  const testArtifactSet = {
    hasArtifactTypes: {
      CIRCLET: true,
      FLOWER: true,
      GOBLET: true,
      PLUME: true,
      SANDS: true,
    },
    iconUrl: "",
    iconUrls: {},
    id: TEST_SET_ID,
    name: "Test Set",
    rarities: [4, 5],
    setBonusCounts: [2, 4],
  };

  return mockDataContext({
    constructBuild: (args) => new Build(args),
    getArtifactMainStatMaxValue: ({ rarity }) => (rarity === 5 ? 4780 : 3570),
    getArtifactSet: (id) => {
      if (id === TEST_SET_ID) {
        return testArtifactSet;
      }
      throw new Error(`Unknown artifact set ${id}`);
    },
    getArtifactSets: () => [testArtifactSet],
    getCharacter: (id) => {
      if (id === TEST_CHARACTER_ID) {
        return testGenshinCharacter;
      }
      throw new Error(`Unknown character ${id}`);
    },
    getCharacters: () => [testGenshinCharacter],
    getWeapon: (id) => {
      if (id === TEST_WEAPON_ID) {
        return testGenshinWeapon;
      }
      throw new Error(`Unknown weapon ${id}`);
    },
    getWeapons: () => [testGenshinWeapon],
    resolvePath: (path) => path,
    validateImport: validateGoodImport,
    ...overrides,
  });
}
