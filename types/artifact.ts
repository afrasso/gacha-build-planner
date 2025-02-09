import { ArtifactMetricsResults } from "./artifactmetrics";
import { Stat, StatValue } from "./stat";

export interface Artifact {
  characterId?: string;
  id: string;
  isLocked: boolean;
  lastUpdatedDate: string;
  level: number;
  mainStat: Stat;
  metricsResults: ArtifactMetricsResults;
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
    characterId: { type: "string" },
    id: { type: "string" },
    isLocked: { type: "boolean" },
    lastUpdatedDate: { format: "date-time", type: "string" },
    level: { type: "integer" },
    mainStat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
    metricsResults: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricsResults" },
    rarity: { type: "integer" },
    setId: { type: "string" },
    subStats: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/StatValue" },
      type: "array",
    },
    type: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactType" },
  },
  required: [
    "id",
    "isLocked",
    "lastUpdatedDate",
    "level",
    "mainStat",
    "metricsResults",
    "rarity",
    "setId",
    "subStats",
    "type",
  ],
  type: "object",
};

export const ArtifactArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
  type: "array",
};

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

export type DesiredArtifactMainStats = Partial<Record<ArtifactType, Stat[]>>;

export const DesiredArtifactMainStatsSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/DesiredArtifactMainStats",
  additionalProperties: false,
  properties: {
    CIRCLET: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" }, type: "array" },
    FLOWER: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" }, type: "array" },
    GOBLET: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" }, type: "array" },
    PLUME: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" }, type: "array" },
    SANDS: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" }, type: "array" },
  },
  required: [],
  type: "object",
};
