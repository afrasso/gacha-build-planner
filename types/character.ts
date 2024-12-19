import { WeaponType } from "./weapon";

export interface Character {
  element: Element;
  iconUrl: string;
  id: string;
  name: string;
  rarity: number;
  weaponType: WeaponType;
}

export const CharacterSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Character",
  additionalProperties: false,
  properties: {
    element: { $ref: "https://gacha-build-planner.vercel.app/schemas/Element" },
    iconUrl: { type: "string" },
    id: { type: "string" },
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
