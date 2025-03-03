export type DesiredOverallStat = {
  excessUseful: boolean;
  priority: number;
  stat: Stat<OverallStatKey>;
};

export const DesiredOverallStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/DesiredOverallStat",
  additionalProperties: false,
  properties: {
    excessUseful: { type: "boolean" },
    priority: { type: "number" },
    stat: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStat" },
  },
  required: ["excessUseful", "priority", "stat"],
  type: "object",
};

export enum OverallStatKey {
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

export const OverallStatKeySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/OverallStatKey",
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

export const OverallStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/OverallStat",
  additionalProperties: false,
  properties: {
    key: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStatKey" },
    value: { type: "number" },
  },
  required: [],
  type: "object",
};

export interface Stat<T extends OverallStatKey | StatKey> {
  key: T;
  value: number;
}

export const StatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Stat",
  additionalProperties: false,
  properties: {
    key: { $ref: "https://gacha-build-planner.vercel.app/schemas/StatKey" },
    value: { type: "number" },
  },
  required: [],
  type: "object",
};

export enum StatKey {
  ATK_FLAT = "ATK_FLAT",
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

export const StatKeySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/StatKey",
  enum: [
    "ATK_FLAT",
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
