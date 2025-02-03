export interface Weapon {
  ascension: number;
  key: string;
  level: number;
  location: string;
  lock: boolean;
  refinement: number;
}

export const WeaponSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD/Weapon",
  additionalProperties: false,
  properties: {
    ascension: { type: "integer" },
    key: { type: "string" },
    level: { type: "integer" },
    location: { type: "string" },
    lock: { type: "boolean" },
    refinement: { type: "integer" },
  },
  required: ["ascension", "key", "level", "location", "lock", "refinement"],
  type: "object",
};
