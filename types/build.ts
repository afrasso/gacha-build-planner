import { ArtifactSetBonus, BuildArtifacts, DesiredArtifactMainStats } from "./artifact";
import { DesiredOverallStat, OverallStat, StatValue } from "./stat";

export interface Build {
  artifacts: BuildArtifacts;
  characterId: string;
  desiredArtifactMainStats: DesiredArtifactMainStats;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  desiredOverallStats: DesiredOverallStat[];
  desiredStats: StatValue<OverallStat>[];
  lastUpdatedDate?: Date;
  weaponId?: string;
}

export const BuildSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Build",
  additionalProperties: false,
  properties: {
    artifacts: { $ref: "https://gacha-build-planner.vercel.app/schemas/BuildArtifacts" },
    characterId: { type: "string" },
    desiredArtifactMainStats: { $ref: "https://gacha-build-planner.vercel.app/schemas/DesiredArtifactMainStats" },
    desiredArtifactSetBonuses: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonus" },
      type: "array",
    },
    desiredOverallStats: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/DesiredOverallStat" },
      type: "array",
    },
    desiredStats: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStatValue" }, type: "array" },
    lastUpdatedDate: { format: "date-time", type: "string" },
    weaponId: { type: "string" },
  },
  required: ["characterId"],
  type: "object",
};

export const BuildArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/BuildArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Build" },
  type: "array",
};
