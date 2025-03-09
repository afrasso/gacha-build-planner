export type DesiredOverallStat = {
  excessUseful: boolean;
  priority: number;
  stat: Stat;
};

export const DesiredOverallStatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/DesiredOverallStat",
  additionalProperties: false,
  properties: {
    excessUseful: { type: "boolean" },
    priority: { type: "number" },
    stat: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
  },
  required: ["excessUseful", "priority", "stat"],
  type: "object",
};

export interface Stat {
  key: string;
  value: number;
}

export const StatSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Stat",
  additionalProperties: false,
  properties: {
    key: { type: "string" },
    value: { type: "number" },
  },
  required: ["key", "value"],
  type: "object",
};
