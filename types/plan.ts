import { ArtifactData } from "./artifact";
import { BuildData } from "./build";

export interface Plan {
  artifacts: ArtifactData[];
  builds: BuildData[];
  id?: string;
  userId?: string;
}

export const PlanSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Plan",
  additionalProperties: false,
  properties: {
    artifacts: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactArray" },
    builds: { $ref: "https://gacha-build-planner.vercel.app/schemas/BuildArray" },
    id: { type: "string" },
    userId: { type: "string" },
  },
  required: ["artifacts", "builds"],
  type: "object",
};
