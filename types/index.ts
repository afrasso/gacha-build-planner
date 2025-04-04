import Ajv from "ajv";
import addFormats from "ajv-formats";

import { ArtifactArraySchema, ArtifactData, ArtifactSchema } from "./artifact";
import {
  ArtifactMetricResultSchema,
  ArtifactMetricResultsSchema,
  ArtifactMetricSchema,
  ArtifactMetricsResultsSchema,
} from "./artifactmetrics";
import { ArtifactSetBonusSchema, ArtifactSetBonusTypeSchema, ArtifactSetSchema } from "./artifactset";
import { BuildArraySchema, BuildData, BuildSchema } from "./build";
import { Plan, PlanSchema } from "./plan";
import { DesiredOverallStatSchema, StatSchema } from "./stat";

export * from "./artifact";
export * from "./artifactmetrics";
export * from "./artifactset";
export * from "./build";
export * from "./character";
export * from "./misc";
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

ajv.addSchema(ArtifactMetricSchema);
ajv.addSchema(ArtifactMetricResultSchema);
ajv.addSchema(ArtifactMetricResultsSchema);
ajv.addSchema(ArtifactMetricsResultsSchema);

ajv.addSchema(BuildSchema);
ajv.addSchema(BuildArraySchema);

ajv.addSchema(PlanSchema);

ajv.addSchema(DesiredOverallStatSchema);
ajv.addSchema(StatSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const initializeArtifact = ({ artifact }: { artifact: any }): void => {
  // Initialization logic goes here.
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const initializeBuild = ({ build }: { build: any }): void => {
  // Initialization logic goes here.
  for (const artifact of Object.values(build.artifacts)) {
    initializeArtifact({ artifact });
  }
};

export const validateArtifact = (data: unknown): ArtifactData => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/Artifact");

  if (!validate) {
    throw new Error("Unexpected error: validateArtifact is not available.");
  }

  initializeArtifact({ artifact: data });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as ArtifactData;
};

export const validateArtifacts = (data: unknown): ArtifactData[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/ArtifactArray");

  if (!validate) {
    throw new Error("Unexpected error: validateArtifacts is not available.");
  }

  (data as unknown[]).forEach((artifact) => {
    initializeArtifact({ artifact });
  });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as ArtifactData[];
};

export const validateBuild = (data: unknown): BuildData => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/Build");

  if (!validate) {
    throw new Error("Unexpected error: validateBuild is not available.");
  }

  initializeBuild({ build: data });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as BuildData;
};

export const validateBuilds = (data: unknown): BuildData[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/BuildArray");

  if (!validate) {
    throw new Error("Unexpected error: validateBuilds is not available.");
  }

  (data as unknown[]).forEach((build) => {
    initializeBuild({ build });
  });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as BuildData[];
};

export const validatePlan = (data: unknown): Plan => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/Plan");

  if (!validate) {
    throw new Error("Unexpected error: validatePlan is not available.");
  }

  (data as { artifacts: unknown[] }).artifacts.forEach((artifact) => {
    initializeArtifact({ artifact });
  });

  (data as { builds: unknown[] }).builds.forEach((build) => {
    initializeBuild({ build });
  });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as Plan;
};
