export interface Character {
  ascension: number;
  eidolon: number;
  id: string;
  level: number;
  name: string;
  path: string;
  skills: {
    basic: number;
    skill: number;
    talent: number;
    ult: number;
  };
  traces: {
    ability_1: boolean;
    ability_2: boolean;
    ability_3: boolean;
    stat_1: boolean;
    stat_2: boolean;
    stat_3: boolean;
    stat_4: boolean;
    stat_5: boolean;
    stat_6: boolean;
    stat_7: boolean;
    stat_8: boolean;
    stat_9: boolean;
    stat_10: boolean;
  };
}

export const CharacterSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Character",
  additionalProperties: false,
  properties: {
    ascension: { type: "integer" },
    eidolon: { type: "integer" },
    id: { type: "string" },
    level: { type: "integer" },
    memosprite: {
      additionalProperties: false,
      properties: {
        skill: { type: "number" },
        talent: { type: "number" },
      },
      type: "object",
    },
    name: { type: "string" },
    path: {
      enum: [
        "Abundance",
        "Destruction",
        "Erudition",
        "Harmony",
        "Hunt",
        "Nihility",
        "Preservation",
        "Remembrance",
        "The Hunt",
      ],
      type: "string",
    },
    skills: {
      additionalProperties: false,
      properties: {
        basic: { type: "number" },
        skill: { type: "number" },
        talent: { type: "number" },
        ult: { type: "number" },
      },
      required: ["basic", "skill", "talent", "ult"],
      type: "object",
    },
    traces: {
      additionalProperties: false,
      properties: {
        ability_1: { type: "boolean" },
        ability_2: { type: "boolean" },
        ability_3: { type: "boolean" },
        stat_1: { type: "boolean" },
        stat_2: { type: "boolean" },
        stat_3: { type: "boolean" },
        stat_4: { type: "boolean" },
        stat_5: { type: "boolean" },
        stat_6: { type: "boolean" },
        stat_7: { type: "boolean" },
        stat_8: { type: "boolean" },
        stat_9: { type: "boolean" },
        stat_10: { type: "boolean" },
      },
      required: [
        "ability_1",
        "ability_2",
        "ability_3",
        "stat_1",
        "stat_2",
        "stat_3",
        "stat_4",
        "stat_5",
        "stat_6",
        "stat_7",
        "stat_8",
        "stat_9",
        "stat_10",
      ],
      type: "object",
    },
  },
  required: ["ascension", "eidolon", "id", "level", "name", "path", "skills", "traces"],
  type: "object",
};
