import { Build } from "./build";

export interface Plan {
  builds: Build[];
  id: string;
  userId: string;
}

export const PlanSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Plan",
  additionalProperties: false,
  properties: {
    builds: { $ref: "https://gacha-build-planner.vercel.app/schemas/Builds" },
    id: { type: "string" },
    userId: { type: "string" },
  },
  required: ["builds", "id", "userId"],
  type: "object",
};
