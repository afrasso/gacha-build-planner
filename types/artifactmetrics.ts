export enum ArtifactMetric {
  CURRENT_STATS_CURRENT_ARTIFACTS = "CURRENT_STATS_CURRENT_ARTIFACTS",
  CURRENT_STATS_RANDOM_ARTIFACTS = "CURRENT_STATS_RANDOM_ARTIFACTS",
  DESIRED_STATS_CURRENT_ARTIFACTS = "DESIRED_STATS_CURRENT_ARTIFACTS",
  DESIRED_STATS_RANDOM_ARTIFACTS = "DESIRED_STATS_RANDOM_ARTIFACTS",
  PLUS_MINUS = "PLUS_MINUS",
  RATING = "RATING",
}

export const ArtifactMetricSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricSchema",
  enum: [
    "CURRENT_STATS_CURRENT_ARTIFACTS",
    "CURRENT_STATS_RANDOM_ARTIFACTS",
    "DESIRED_STATS_CURRENT_ARTIFACTS",
    "DESIRED_STATS_RANDOM_ARTIFACTS",
    "PLUS_MINUS",
    "RATING",
  ],
  type: "string",
};

export interface ArtifactMetricResult {
  calculatedOn: string;
  iterations: number;
  result: number;
}

export const ArtifactMetricResultSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResult",
  additionalProperties: false,
  properties: {
    calculatedOn: { format: "date-time", type: "string" },
    iterations: { type: "number" },
    result: { type: "number" },
  },
  required: ["calculatedOn", "iterations", "result"],
  type: "object",
};

export interface ArtifactMetricResults {
  buildResults: Record<string, ArtifactMetricResult>;
  maxValue?: number;
}

export const ArtifactMetricResultsSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults",
  additionalProperties: false,
  properties: {
    buildResults: {
      additionalProperties: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResult",
      },
      type: "object",
    },
    maxValue: { type: "number" },
  },
  required: ["buildResults"],
  type: "object",
};

export type ArtifactMetricsResults = Record<ArtifactMetric, ArtifactMetricResults>;

export const ArtifactMetricsResultsSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricsResults",
  additionalProperties: false,
  properties: {
    CURRENT_STATS_CURRENT_ARTIFACTS: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
    CURRENT_STATS_RANDOM_ARTIFACTS: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
    DESIRED_STATS_CURRENT_ARTIFACTS: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
    DESIRED_STATS_RANDOM_ARTIFACTS: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
    PLUS_MINUS: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
    RATING: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricResults" },
  },
  required: [
    "CURRENT_STATS_CURRENT_ARTIFACTS",
    "CURRENT_STATS_RANDOM_ARTIFACTS",
    "DESIRED_STATS_CURRENT_ARTIFACTS",
    "DESIRED_STATS_RANDOM_ARTIFACTS",
    "PLUS_MINUS",
    "RATING",
  ],
  type: "object",
};

export enum ArtifactTier {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  F = "F",
  S = "S",
  SS = "SS",
  SSS = "SSS",
  SSS_PLUS = "SSS_PLUS",
}

export type SatisfactionCalculationType =
  | ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS
  | ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS
  | ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS
  | ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS;
