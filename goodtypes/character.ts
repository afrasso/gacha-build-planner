export interface Character {
  ascension: number;
  constellation: number;
  key: string;
  level: number;
  talent: {
    auto: number;
    burst: number;
    skill: number;
  };
}

export const CharacterSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD/Character",
  additionalProperties: false,
  properties: {
    ascension: { type: "integer" },
    constellation: { type: "integer" },
    key: { type: "string" },
    level: { type: "integer" },
    talent: {
      additionalProperties: false,
      properties: {
        auto: { type: "number" },
        burst: { type: "number" },
        skill: { type: "number" },
      },
      required: ["auto", "burst", "skill"],
      type: "object",
    },
  },
  required: ["ascension", "constellation", "key", "level", "talent"],
  type: "object",
};
