import { StatKey } from "./stat";

export interface Weapon {
  iconUrl: string;
  id: string;
  mainStat: StatKey;
  maxLvlStats: {
    ATK: number;
    mainStat: number;
  };
  name: string;
  rarity: number;
  type: WeaponType;
}

export const WeaponSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Weapon",
  additionalProperties: false,
  properties: {
    iconUrl: { type: "string" },
    id: { type: "string" },
    mainStat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    maxLvlStats: {
      properties: {
        ATK: { type: "number" },
        mainStat: { type: "number" },
      },
      type: "object",
    },
    name: { type: "string" },
    rarity: { type: "number" },
    type: { $ref: "https://gacha-build-planner.vercel.app/schemas/WeaponType" },
  },
  required: ["iconUrl", "id", "name", "rarity", "type"],
  type: "object",
};

export enum WeaponType {
  BOW = "WEAPON_BOW",
  CATALYST = "WEAPON_CATALYST",
  CLAYMORE = "WEAPON_CLAYMORE",
  POLEARM = "WEAPON_POLE",
  SWORD = "WEAPON_SWORD_ONE_HAND",
}

export const WeaponTypeSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/WeaponType",
  enum: ["WEAPON_BOW", "WEAPON_CATALYST", "WEAPON_CLAYMORE", "WEAPON_POLE", "WEAPON_SWORD_ONE_HAND"],
  type: "string",
};
