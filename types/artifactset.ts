export interface ArtifactSet {
  category?: string;
  hasArtifactTypes: Record<string, boolean>;
  iconUrl: string;
  iconUrls: Record<string, string>;
  id: string;
  name: string;
  rarities: number[];
  setBonusCounts: number[];
}

export const ArtifactSetSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSet",
  properties: {
    category: { type: "string" },
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
    setBonusCounts: { items: { type: "integer" }, type: "array" },
  },
  required: ["hasArtifactTypes", "iconUrl", "iconUrls", "id", "name", "rarities", "setBonusCounts"],
  type: "object",
};

export interface ArtifactSetBonus {
  bonusCount: number;
  setId: string;
}

export const ArtifactSetBonusSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonus",
  additionalProperties: false,
  properties: {
    bonusCount: { type: "integer" },
    setId: { type: "string" },
  },
  required: ["bonusCount", "setId"],
  type: "object",
};

export const ArtifactSetBonusTypeSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonusType",
  enum: ["FOUR_PIECE", "TWO_PIECE"],
  type: "string",
};
