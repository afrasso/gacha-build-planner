export interface Artifact {
  level: number;
  location: string;
  lock: boolean;
  mainStatKey: Stat;
  rarity: number;
  setKey: string;
  slotKey: Slot;
  substats: {
    key: Stat;
    value: number;
  }[];
}

export const ArtifactSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD/Artifact",
  additionalProperties: false,
  properties: {
    level: { type: "integer" },
    location: { type: "string" },
    lock: { type: "boolean" },
    mainStatKey: { $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Stat" },
    rarity: { type: "integer" },
    setKey: { type: "string" },
    slotKey: { $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Slot" },
    substats: {
      items: {
        additionalProperties: false,
        properties: {
          key: { $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Stat" },
          value: { type: "number" },
        },
        required: ["key", "value"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["level", "location", "lock", "mainStatKey", "rarity", "setKey", "slotKey", "substats"],
  type: "object",
};

export enum Slot {
  CIRCLET = "circlet",
  FLOWER = "flower",
  GOBLET = "goblet",
  PLUME = "plume",
  SANDS = "sands",
}

export const SlotSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD/Slot",
  enum: ["circlet", "flower", "goblet", "plume", "sands"],
  type: "string",
};

export enum Stat {
  ATK_FLAT = "atk",
  ATK_PERCENT = "atk_",
  CRIT_DMG = "critDMG_",
  CRIT_RATE = "critRate_",
  DEF_FLAT = "def",
  DEF_PERCENT = "def_",
  DMG_BONUS_ANEMO = "anemo_dmg_",
  DMG_BONUS_CRYO = "cryo_dmg_",
  DMG_BONUS_DENDRO = "dendro_dmg_",
  DMG_BONUS_ELECTRO = "electro_dmg_",
  DMG_BONUS_GEO = "geo_dmg_",
  DMG_BONUS_HYDRO = "hydro_dmg_",
  DMG_BONUS_PHYSICAL = "physical_dmg_",
  DMG_BONUS_PYRO = "pyro_dmg_",
  ELEMENTAL_MASTERY = "eleMas",
  ENERGY_RECHARGE = "enerRech_",
  HEALING_BONUS = "heal_",
  HP_FLAT = "hp",
  HP_PERCENT = "hp_",
}

export const StatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD/Stat",
  enum: [
    "atk",
    "atk_",
    "critDMG_",
    "critRate_",
    "def",
    "def_",
    "anemo_dmg_",
    "cryo_dmg_",
    "dendro_dmg_",
    "electro_dmg_",
    "geo_dmg_",
    "hydro_dmg_",
    "physical_dmg_",
    "pyro_dmg_",
    "eleMas",
    "enerRech_",
    "heal_",
    "hp",
    "hp_",
  ],
  type: "string",
};
