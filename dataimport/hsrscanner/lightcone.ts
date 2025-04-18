export interface LightCone {
  _uid: string;
  ascension: number;
  id: string;
  level: number;
  location: string;
  lock: boolean;
  name: string;
  superimposition: number;
}

export const LightConeSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/LightCone",
  additionalProperties: false,
  properties: {
    _uid: { type: "string" },
    ascension: { type: "integer" },
    id: { type: "string" },
    level: { type: "integer" },
    location: { type: "string" },
    lock: { type: "boolean" },
    name: { type: "string" },
    superimposition: { type: "integer" },
  },
  required: ["ascension", "id", "level", "location", "lock", "name", "superimposition"],
  type: "object",
};
