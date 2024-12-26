import { Artifact } from "./artifact";
import { Build } from "./build";

export interface Plan {
  artifacts: Artifact[];
  builds: Build[];
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
