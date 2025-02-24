import { StatKey } from "./stat";
import { WeaponType } from "./weapon";

export interface Character {
  ascensionStat: StatKey;
  element: Element;
  iconUrl: string;
  id: string;
  maxLvlStats: {
    ascensionStat: number;
    ATK: number;
    DEF: number;
    HP: number;
  };
  name: string;
  rarity: number;
  weaponType: WeaponType;
}

export const CharacterSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Character",
  additionalProperties: false,
  properties: {
    ascensionStat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    element: { $ref: "https://gacha-build-planner.vercel.app/schemas/Element" },
    iconUrl: { type: "string" },
    id: { type: "string" },
    maxLvlStats: {
      properties: {
        ascensionStat: { type: "number" },
        ATK: { type: "number" },
        DEF: { type: "number" },
        HP: { type: "number" },
      },
      type: "object",
    },
    name: { type: "string" },
    rarity: { type: "number" },
    weaponType: { $ref: "https://gacha-build-planner.vercel.app/schemas/WeaponType" },
  },
  required: ["element", "iconUrl", "id", "name", "rarity", "weaponType"],
  type: "object",
};

export enum Element {
  ANEMO = "ELEMENT_ANEMO",
  CRYO = "ELEMENT_CRYO",
  DENDRO = "ELEMENT_DENDRO",
  ELECTRO = "ELEMENT_ELECTRO",
  GEO = "ELEMENT_GEO",
  HYDRO = "ELEMENT_HYDRO",
  NONE = "ELEMENT_NONE",
  PYRO = "ELEMENT_PYRO",
}

export const ElementSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Element",
  enum: [
    "ELEMENT_ANEMO",
    "ELEMENT_CRYO",
    "ELEMENT_DENDRO",
    "ELEMENT_ELECTRO",
    "ELEMENT_GEO",
    "ELEMENT_HYDRO",
    "ELEMENT_NONE",
    "ELEMENT_PYRO",
  ],
  type: "string",
};
