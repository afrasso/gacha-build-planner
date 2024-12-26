import Ajv from "ajv";

import {
  Artifact,
  ArtifactArraySchema,
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
import { OverallStatSchema, OverallStatValueSchema, StatSchema, StatValueSchema } from "./stat";
import { WeaponSchema, WeaponTypeSchema } from "./weapon";

export * from "./artifact";
export * from "./build";
export * from "./character";
export * from "./plan";
export * from "./stat";
export * from "./user";
export * from "./weapon";

const ajv = new Ajv({ allErrors: true });

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

  return data as Artifact[];
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

  return data as Build[];
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
