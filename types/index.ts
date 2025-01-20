import Ajv from "ajv";
import addFormats from "ajv-formats";

import {
  Artifact,
  ArtifactArraySchema,
  ArtifactMetric,
  ArtifactSchema,
  ArtifactSetBonusSchema,
  ArtifactSetBonusTypeSchema,
  ArtifactSetSchema,
  ArtifactTypeSchema,
  BuildArtifactsSchema,
  DesiredArtifactMainStatsSchema,
} from "./artifact";
import { Build, BuildArraySchema, BuildSchema } from "./build";
import { CharacterSchema, ElementSchema } from "./character";
import { Plan, PlanSchema } from "./plan";
import {
  DesiredOverallStatSchema,
  OverallStatSchema,
  OverallStatValueSchema,
  StatSchema,
  StatValueSchema,
} from "./stat";
import { WeaponSchema, WeaponTypeSchema } from "./weapon";

export * from "./artifact";
export * from "./build";
export * from "./character";
export * from "./plan";
export * from "./stat";
export * from "./user";
export * from "./weapon";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

ajv.addSchema(ArtifactSchema);
ajv.addSchema(ArtifactArraySchema);
ajv.addSchema(ArtifactSetSchema);
ajv.addSchema(ArtifactSetBonusSchema);
ajv.addSchema(ArtifactSetBonusTypeSchema);
ajv.addSchema(ArtifactTypeSchema);
ajv.addSchema(BuildArtifactsSchema);
ajv.addSchema(DesiredArtifactMainStatsSchema);

ajv.addSchema(BuildSchema);
ajv.addSchema(BuildArraySchema);

ajv.addSchema(CharacterSchema);
ajv.addSchema(ElementSchema);

ajv.addSchema(PlanSchema);

ajv.addSchema(DesiredOverallStatSchema);
ajv.addSchema(OverallStatSchema);
ajv.addSchema(OverallStatValueSchema);
ajv.addSchema(StatSchema);
ajv.addSchema(StatValueSchema);

ajv.addSchema(WeaponSchema);
ajv.addSchema(WeaponTypeSchema);

export const validateArtifacts = (data: unknown): Artifact[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/ArtifactArray");

  if (!validate) {
    throw new Error("Unpexected error: validateArtifacts is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  const artifacts = data as Artifact[];

  artifacts.forEach((artifact) => {
    artifact.lastUpdatedDate = artifact.lastUpdatedDate ?? new Date().toISOString();
    artifact.metricResults = artifact.metricResults ?? {
      [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: {},
      [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: {},
      [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: {},
      [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: {},
      [ArtifactMetric.PLUS_MINUS]: {},
      [ArtifactMetric.RATING]: {},
    };
  });

  return artifacts;
};

export const validateBuilds = (data: unknown): Build[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/BuildArray");

  if (!validate) {
    throw new Error("Unpexected error: validateBuilds is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  const builds = data as Build[];

  builds.forEach((build) => {
    build.desiredOverallStats = build.desiredOverallStats ?? [];
  });

  return builds;
};

export const validatePlan = (data: unknown): Plan => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/Plan");

  if (!validate) {
    throw new Error("Unpexected error: validatePlan is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as Plan;
};
