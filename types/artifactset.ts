export interface ArtifactSet {
  hasArtifactTypes: Record<string, boolean>;
  iconUrl: string;
  iconUrls: Record<string, string>;
  id: string;
  name: string;
  rarities: number[];
}

export const ArtifactSetSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSet",
  properties: {
    hasArtifactTypes: {
      additionalProperties: { type: "boolean" },
      type: "object",
    },
    iconUrl: { type: "string" },
    iconUrls: {
      additionalProperties: { type: "string" },
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
