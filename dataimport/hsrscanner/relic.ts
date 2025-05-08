export enum MainStat {
  ATK_PERCENT = "ATK",
  BREAK_EFF = "Break Effect",
  CRIT_DMG = "CRIT DMG",
  CRIT_RATE = "CRIT Rate",
  DEF_PERCENT = "DEF",
  DMG_BONUS_FIRE = "Fire DMG Boost",
  DMG_BONUS_ICE = "Ice DMG Boost",
  DMG_BONUS_IMAGINARY = "Imaginary DMG Boost",
  DMG_BONUS_LIGHTNING = "Lightning DMG Boost",
  DMG_BONUS_PHYSICAL = "Physical DMG Boost",
  DMG_BONUS_QUANTUM = "Quantum DMG Boost",
  DMG_BONUS_WIND = "Wind DMG Boost",
  EFF_HIT_RATE = "Effect Hit Rate",
  ENERGY_RECHARGE = "Energy Regeneration Rate",
  HEALING_BONUS = "Outgoing Healing Boost",
  HP_PERCENT = "HP",
  SPD = "SPD",
}

export const MainStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/MainStat",
  enum: [
    "ATK",
    "Break Effect",
    "CRIT DMG",
    "CRIT Rate",
    "DEF",
    "Fire DMG Boost",
    "Ice DMG Boost",
    "Imaginary DMG Boost",
    "Lightning DMG Boost",
    "Physical DMG Boost",
    "Quantum DMG Boost",
    "Wind DMG Boost",
    "Effect Hit Rate",
    "Energy Regeneration Rate",
    "Outgoing Healing Boost",
    "HP",
    "SPD",
  ],
  type: "string",
};

export interface Relic {
  _uid: string;
  discard: boolean;
  level: number;
  location: string;
  lock: boolean;
  mainstat: MainStat;
  name: string;
  rarity: number;
  set_id: string;
  slot: Slot;
  substats: {
    key: SubStat;
    value: number;
  }[];
}

export const RelicSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Relic",
  additionalProperties: false,
  properties: {
    _uid: { type: "string" },
    discard: { type: "boolean" },
    level: { type: "integer" },
    location: { type: "string" },
    lock: { type: "boolean" },
    mainstat: { $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/MainStat" },
    name: { type: "string" },
    rarity: { type: "integer" },
    set_id: { type: "string" },
    slot: { $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Slot" },
    substats: {
      items: {
        additionalProperties: false,
        properties: {
          count: { type: "integer" },
          key: { $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/SubStat" },
          step: { type: "integer" },
          value: { type: "number" },
        },
        required: ["key", "value"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["discard", "level", "location", "lock", "mainstat", "name", "rarity", "set_id", "slot", "substats"],
  type: "object",
};

export enum Slot {
  BODY = "Body",
  FOOT = "Feet",
  HAND = "Hands",
  HEAD = "Head",
  NECK = "Planar Sphere",
  OBJECT = "Link Rope",
}

export const SlotSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Slot",
  enum: ["Body", "Feet", "Hands", "Head", "Link Rope", "Planar Sphere"],
  type: "string",
};

export enum SubStat {
  ATK_FLAT = "ATK",
  ATK_PERCENT = "ATK_",
  BREAK_EFF = "Break Effect_",
  CRIT_DMG = "CRIT DMG_",
  CRIT_RATE = "CRIT Rate_",
  DEF_FLAT = "DEF",
  DEF_PERCENT = "DEF_",
  DMG_BONUS_FIRE = "Fire DMG Boost",
  DMG_BONUS_ICE = "Ice DMG Boost",
  DMG_BONUS_IMAGINARY = "Imaginary DMG Boost",
  DMG_BONUS_LIGHTNING = "Lightning DMG Boost",
  DMG_BONUS_PHYSICAL = "Physical DMG Boost",
  DMG_BONUS_QUANTUM = "Quantum DMG Boost",
  DMG_BONUS_WIND = "Wind DMG Boost",
  EFF_HIT_RATE = "Effect Hit Rate_",
  EFF_RES = "Effect RES_",
  ENERGY_RECHARGE = "Energy Regeneration Rate",
  HEALING_BONUS = "Outgoing Healing Boost",
  HP_FLAT = "HP",
  HP_PERCENT = "HP_",
  SPD = "SPD",
}

export const SubStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/SubStat",
  enum: [
    "ATK",
    "ATK_",
    "Break Effect_",
    "CRIT DMG_",
    "CRIT Rate_",
    "DEF",
    "DEF_",
    "Fire DMG Boost",
    "Ice DMG Boost",
    "Imaginary DMG Boost",
    "Lightning DMG Boost",
    "Physical DMG Boost",
    "Quantum DMG Boost",
    "Wind DMG Boost",
    "Effect Hit Rate_",
    "Effect RES_",
    "Energy Regeneration Rate",
    "Outgoing Healing Boost",
    "HP",
    "HP_",
    "SPD",
  ],
  type: "string",
};
