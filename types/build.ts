import { IDataContext } from "@/contexts/DataContext";

import { ArtifactData, IArtifact } from "./artifact";
import { ArtifactSetBonus } from "./artifactset";
import { DesiredOverallStat } from "./stat";

export interface BuildData {
  readonly _typeBrand: "BuildData";
  artifacts: Record<string, ArtifactData>;
  characterId: string;
  desiredArtifactMainStats: Record<string, string[]>;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  desiredOverallStats: DesiredOverallStat[];
  lastUpdatedDate: string;
  sortOrder: number;
  weaponId?: string;
}

export interface IBuild {
  readonly _typeBrand: "IBuild";
  artifacts: Record<string, IArtifact>;
  calculateStats: ({
    artifacts,
    dataContext,
  }: {
    artifacts?: Record<string, IArtifact>;
    dataContext: IDataContext;
  }) => Record<string, number>;
  characterId: string;
  desiredArtifactMainStats: Record<string, string[]>;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  desiredOverallStats: DesiredOverallStat[];
  lastUpdatedDate: string;
  sortOrder: number;
  toBuildData: () => BuildData;
  weaponId?: string;
}

export const BuildSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Build",
  additionalProperties: false,
  properties: {
    _typeBrand: { const: "BuildData", type: "string" },
    artifacts: {
      additionalProperties: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
      type: "object",
    },
    characterId: { type: "string" },
    desiredArtifactMainStats: {
      additionalProperties: { items: { type: "string" }, type: "array" },
      type: "object",
    },
    desiredArtifactSetBonuses: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonus" },
      type: "array",
    },
    desiredOverallStats: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/DesiredOverallStat" },
      type: "array",
    },
    lastUpdatedDate: { format: "date-time", type: "string" },
    sortOrder: { type: "integer" },
    weaponId: { type: "string" },
  },
  required: [
    "_typeBrand",
    "artifacts",
    "characterId",
    "desiredArtifactMainStats",
    "desiredArtifactSetBonuses",
    "desiredOverallStats",
    "lastUpdatedDate",
    "sortOrder",
  ],
  type: "object",
};

export const BuildArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/BuildArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Build" },
  type: "array",
};
