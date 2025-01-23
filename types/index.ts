import Ajv from "ajv";
import addFormats from "ajv-formats";

import {
  Artifact,
  ArtifactArraySchema,
  ArtifactSchema,
  ArtifactSetBonusSchema,
  ArtifactSetBonusTypeSchema,
  ArtifactSetSchema,
  ArtifactType,
  ArtifactTypeSchema,
  BuildArtifactsSchema,
  DesiredArtifactMainStatsSchema,
} from "./artifact";
import {
  ArtifactMetric,
  ArtifactMetricResultSchema,
  ArtifactMetricResultsSchema,
  ArtifactMetricSchema,
  ArtifactMetricsResultsSchema,
} from "./artifactmetrics";
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
export * from "./artifactmetrics";
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

ajv.addSchema(ArtifactMetricSchema);
ajv.addSchema(ArtifactMetricResultSchema);
ajv.addSchema(ArtifactMetricResultsSchema);
ajv.addSchema(ArtifactMetricsResultsSchema);

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

const initializeArtifact = ({ artifact }: { artifact: any }): void => {
  if (!artifact.lastUpdatedDate) {
    artifact.lastUpdatedDate = new Date().toISOString();
  }
  if (!artifact.metricsResults) {
    artifact.metricsResults = {};
  }
  for (const artifactMetric of Object.values(ArtifactMetric)) {
    if (!artifact.metricsResults[artifactMetric]) {
      artifact.metricsResults[artifactMetric] = {};
    }
    if (!artifact.metricsResults[artifactMetric].buildResults) {
      artifact.metricsResults[artifactMetric].buildResults = {};
    }
  }
};

export const validateArtifacts = (data: unknown): Artifact[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/ArtifactArray");

  if (!validate) {
    throw new Error("Unpexected error: validateArtifacts is not available.");
  }

  (data as any[]).forEach((artifact) => {
    initializeArtifact({ artifact });
  });

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

  (data as any[]).forEach((build) => {
    if (!build.lastUpdatedDate) {
      build.lastUpdatedDate = new Date().toISOString();
    }
    if (!build.artifacts) {
      build.artifacts = {};
    }
    for (const artifactType of Object.values(ArtifactType)) {
      if (build.artifacts[artifactType]) {
        initializeArtifact({ artifact: build.artifacts[artifactType] });
      }
    }
    if (!build.desiredOverallStats) {
      build.desiredOverallStats = [];
    }
  });

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
