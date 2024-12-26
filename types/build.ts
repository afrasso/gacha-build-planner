import { ArtifactSetBonus, BuildArtifacts, DesiredArtifactMainStats } from "./artifact";
import { Character } from "./character";
import { OverallStat, StatValue } from "./stat";
import { Weapon } from "./weapon";

export interface Build {
  artifacts: BuildArtifacts;
  character: Character;
  desiredArtifactMainStats: DesiredArtifactMainStats;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  desiredStats: StatValue<OverallStat>[];
  weapon: undefined | Weapon;
}

export const BuildSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Build",
  additionalProperties: false,
  properties: {
    artifacts: { $ref: "https://gacha-build-planner.vercel.app/schemas/BuildArtifacts" },
    character: { $ref: "https://gacha-build-planner.vercel.app/schemas/Character" },
    desiredArtifactMainStats: { $ref: "https://gacha-build-planner.vercel.app/schemas/DesiredArtifactMainStats" },
    desiredArtifactSetBonuses: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactSetBonus" },
      type: "array",
    },
    desiredStats: { items: { $ref: "https://gacha-build-planner.vercel.app/schemas/OverallStatValue" }, type: "array" },
    weapon: { $ref: "https://gacha-build-planner.vercel.app/schemas/Weapon" },
  },
  required: ["artifacts", "character", "desiredArtifactMainStats", "desiredArtifactSetBonuses", "desiredStats"],
  type: "object",
};

export const BuildArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/BuildArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Build" },
  type: "array",
};
