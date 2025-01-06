import { ArtifactSetBonus, BuildArtifacts, DesiredArtifactMainStats } from "./artifact";
import { OverallStat, StatValue } from "./stat";

export interface Build {
  artifacts: BuildArtifacts;
  characterId: string;
  desiredArtifactMainStats: DesiredArtifactMainStats;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
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
    desiredStats: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStatValue" }, type: "array" },
    weaponId: { type: "string" },
  },
  required: ["artifacts", "characterId", "desiredArtifactMainStats", "desiredArtifactSetBonuses", "desiredStats"],
  type: "object",
};

export const BuildArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/BuildArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Build" },
  type: "array",
};
