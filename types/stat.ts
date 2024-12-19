export enum OverallStat {
  ATK = "ATK",
  CRIT_DMG = "CRIT_DMG",
  CRIT_RATE = "CRIT_RATE",
  DEF = "DEF",
  DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO",
  DMG_BONUS_CRYO = "DMG_BONUS_CRYO",
  DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO",
  DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO",
  DMG_BONUS_GEO = "DMG_BONUS_GEO",
  DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO",
  DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL",
  DMG_BONUS_PYRO = "DMG_BONUS_PYRO",
  ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE = "ENERGY_RECHARGE",
  HEALING_BONUS = "HEALING_BONUS",
  MAX_HP = "MAX_HP",
}

export const OverallStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/OverallStat",
  enum: [
    "ATK",
    "CRIT_DMG",
    "CRIT_RATE",
    "DEF",
    "DMG_BONUS_ANEMO",
    "DMG_BONUS_CRYO",
    "DMG_BONUS_DENDRO",
    "DMG_BONUS_ELECTRO",
    "DMG_BONUS_GEO",
    "DMG_BONUS_HYDRO",
    "DMG_BONUS_PHYSICAL",
    "DMG_BONUS_PYRO",
    "ELEMENTAL_MASTERY",
    "ENERGY_RECHARGE",
    "HEALING_BONUS",
    "MAX_HP",
  ],
  type: "string",
};

export enum Stat {
  ATK_FLAT = "ATK",
  ATK_PERCENT = "ATK_PERCENT",
  CRIT_DMG = "CRIT_DMG",
  CRIT_RATE = "CRIT_RATE",
  DEF_FLAT = "DEF_FLAT",
  DEF_PERCENT = "DEF_PERCENT",
  DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO",
  DMG_BONUS_CRYO = "DMG_BONUS_CRYO",
  DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO",
  DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO",
  DMG_BONUS_GEO = "DMG_BONUS_GEO",
  DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO",
  DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL",
  DMG_BONUS_PYRO = "DMG_BONUS_PYRO",
  ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE = "ENERGY_RECHARGE",
  HEALING_BONUS = "HEALING_BONUS",
  HP_FLAT = "HP_FLAT",
  HP_PERCENT = "HP_PERCENT",
}

export const StatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Stat",
  enum: [
    "ATK",
    "ATK_PERCENT",
    "CRIT_DMG",
    "CRIT_RATE",
    "DEF_FLAT",
    "DEF_PERCENT",
    "DMG_BONUS_ANEMO",
    "DMG_BONUS_CRYO",
    "DMG_BONUS_DENDRO",
    "DMG_BONUS_ELECTRO",
    "DMG_BONUS_GEO",
    "DMG_BONUS_HYDRO",
    "DMG_BONUS_PHYSICAL",
    "DMG_BONUS_PYRO",
    "ELEMENTAL_MASTERY",
    "ENERGY_RECHARGE",
    "HEALING_BONUS",
    "HP_FLAT",
    "HP_PERCENT",
  ],
  type: "string",
};

export interface StatValue<T extends OverallStat | Stat> {
  stat: T;
  value: number;
}

export const OverallStatValueSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/OverallStatValue",
  additionalProperties: false,
  properties: {
    stat: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStat" },
    value: { type: "number" },
  },
  required: [],
  type: "object",
};

export const StatValueSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/StatValue",
  additionalProperties: false,
  properties: {
    stat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    value: { type: "number" },
  },
  required: [],
  type: "object",
};
