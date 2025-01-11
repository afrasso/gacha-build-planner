import { Stat, StatValue } from "./stat";

export interface Artifact {
  id: string;
  lastUpdatedDate?: Date;
  level: number;
  mainStat: Stat;
  metrics?: ArtifactMetrics;
  rarity: number;
  setId: string;
  subStats: StatValue<Stat>[];
  type: ArtifactType;
}

export const ArtifactSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Artifact",
  // TODO: Fix this
  // additionalProperties: false
  properties: {
    id: { type: "string" },
    lastUpdatedDate: { format: "date-time", type: "string" },
    level: { type: "integer" },
    mainStat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    metrics: { type: "object" },
    rarity: { type: "integer" },
    setId: { type: "string" },
    subStats: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/StatValue" },
      type: "array",
    },
    type: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactType" },
  },
  required: ["id", "level", "mainStat", "rarity", "setId", "subStats", "type"],
  type: "object",
};

export const ArtifactArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
  type: "array",
};

export enum ArtifactMetric {
  CURRENT_STATS_CURRENT_ARTIFACTS = "CURRENT_STATS_CURRENT_ARTIFACTS",
  CURRENT_STATS_RANDOM_ARTIFACTS = "CURRENT_STATS_RANDOM_ARTIFACTS",
  DESIRED_STATS_CURRENT_ARTIFACTS = "DESIRED_STATS_CURRENT_ARTIFACTS",
  DESIRED_STATS_RANDOM_ARTIFACTS = "DESIRED_STATS_RANDOM_ARTIFACTS",
  ROLL_PLUS_MINUS = "ROLL_PLUS_MINUS",
  TIER_RATING = "TIER_RATING",
}

export interface ArtifactMetricResult<T> {
  calculatedOn: Date;
  result: T;
}

export interface ArtifactMetricResultMap {
  [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: number;
  [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: number;
  [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: number;
  [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: number;
  [ArtifactMetric.ROLL_PLUS_MINUS]: number;
  [ArtifactMetric.TIER_RATING]: ArtifactTier;
}

export interface ArtifactMetrics {
  [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: Record<string, ArtifactMetricResult<number>>;
  [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: Record<string, ArtifactMetricResult<number>>;
  [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: Record<string, ArtifactMetricResult<number>>;
  [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: Record<string, ArtifactMetricResult<number>>;
  [ArtifactMetric.ROLL_PLUS_MINUS]: Record<string, ArtifactMetricResult<number>>;
  [ArtifactMetric.TIER_RATING]: Record<string, ArtifactMetricResult<ArtifactTier>>;
}

export interface ArtifactSet {
  hasArtifactTypes: Record<ArtifactType, boolean>;
  iconUrl: string;
  iconUrls: Record<ArtifactType, string>;
  id: string;
  name: string;
  rarities: number[];
}

export const ArtifactSetSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSet",
  // TODO: Fix this
  // additionalProperties: false,
  properties: {
    hasArtifactTypes: {
      properties: {
        CIRCLET: { type: "boolean" },
        FLOWER: { type: "boolean" },
        GOBLET: { type: "boolean" },
        PLUME: { type: "boolean" },
        SANDS: { type: "boolean" },
      },
      type: "object",
    },
    iconUrl: { type: "string" },
    iconUrls: {
      properties: {
        CIRCLET: { type: "string" },
        FLOWER: { type: "string" },
        GOBLET: { type: "string" },
        PLUME: { type: "string" },
        SANDS: { type: "string" },
      },
      type: "object",
    },
    id: { type: "string" },
    name: { type: "string" },
    rarities: { items: { type: "integer" }, type: "array" },
  },
  required: ["hasArtifactTypes", "iconUrl", "iconUrls", "id", "name", "rarities"],
  type: "object",
};

export interface ArtifactSetBonus {
  bonusType: ArtifactSetBonusType;
  setId: string;
}

export const ArtifactSetBonusSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonus",
  additionalProperties: false,
  properties: {
    bonusType: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonusType" },
    setId: { type: "string" },
  },
  required: ["bonusType", "setId"],
  type: "object",
};

export enum ArtifactSetBonusType {
  FOUR_PIECE = "FOUR_PIECE",
  TWO_PIECE = "TWO_PIECE",
}

export const ArtifactSetBonusTypeSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonusType",
  enum: ["FOUR_PIECE", "TWO_PIECE"],
  type: "string",
};

export enum ArtifactTier {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  F = "F",
  S = "S",
  SS = "SS",
  SSS = "SSS",
  SSS_PLUS = "SSS_PLUS",
}

export enum ArtifactType {
  CIRCLET = "CIRCLET",
  FLOWER = "FLOWER",
  GOBLET = "GOBLET",
  PLUME = "PLUME",
  SANDS = "SANDS",
}

export const ArtifactTypeSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactType",
  enum: ["CIRCLET", "FLOWER", "GOBLET", "PLUME", "SANDS"],
  type: "string",
};

export type BuildArtifacts = Partial<Record<ArtifactType, Artifact>>;

export const BuildArtifactsSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/BuildArtifacts",
  additionalProperties: false,
  properties: {
    CIRCLET: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
    FLOWER: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
    GOBLET: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
    PLUME: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
    SANDS: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
  },
  required: [],
  type: "object",
};

export type DesiredArtifactMainStats = Partial<Record<ArtifactType, Stat>>;

export const DesiredArtifactMainStatsSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/DesiredArtifactMainStats",
  additionalProperties: false,
  properties: {
    CIRCLET: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    FLOWER: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    GOBLET: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    PLUME: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    SANDS: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
  },
  required: [],
  type: "object",
};

export type SatisfactionCalculationType =
  | ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS
  | ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS
  | ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  | ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS;
