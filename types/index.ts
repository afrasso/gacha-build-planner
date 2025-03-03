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
  OverallStatKeySchema,
  OverallStatSchema,
  StatKey,
  StatKeySchema,
  StatSchema,
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
ajv.addSchema(OverallStatKeySchema);
ajv.addSchema(OverallStatSchema);
ajv.addSchema(StatKeySchema);
ajv.addSchema(StatSchema);

ajv.addSchema(WeaponSchema);
ajv.addSchema(WeaponTypeSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeArtifact = ({ artifact }: { artifact: any }): void => {
  if (artifact.isLocked === undefined) {
    console.log("Artifact missing isLocked field.");
    artifact.isLocked = false;
  }
  if (!artifact.lastUpdatedDate) {
    console.log("Artifact missing lastUpdatedDate field.");
    artifact.lastUpdatedDate = new Date().toISOString();
  }
  if (artifact.mainStat === "ATK") {
    console.log("Artifact has main stat of ATK (not ATK_FLAT).");
    artifact.mainStat = StatKey.ATK_FLAT;
  }
  if (!artifact.metricsResults) {
    console.log("Artifact missing metricsResults field.");
    artifact.metricsResults = {};
  }
  for (const subStat of artifact.subStats) {
    if (!subStat.key) {
      console.log(`Artifact ${artifact.id} missing subStat key field.`);
      subStat.key = subStat.stat;
      delete subStat.stat;
    }
  }
  for (const artifactMetric of Object.values(ArtifactMetric)) {
    if (!artifact.metricsResults[artifactMetric]) {
      console.log(`Artifact missing field for metric ${artifactMetric}.`);
      artifact.metricsResults[artifactMetric] = {};
    }
    if (!artifact.metricsResults[artifactMetric].buildResults) {
      console.log(`Artifact missing buildResults for metric ${artifactMetric}.`);
      artifact.metricsResults[artifactMetric].buildResults = {};
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeBuild = ({ build }: { build: any }): void => {
  if (!build.artifacts) {
    console.log("Build missing artifacts field.");
    build.artifacts = {};
  }
  if (!build.lastUpdatedDate) {
    console.log("Build missing lastUpdatedDate field.");
    build.lastUpdatedDate = new Date().toISOString();
  }
  for (const artifactType of Object.values(ArtifactType)) {
    if (build.artifacts[artifactType]) {
      initializeArtifact({ artifact: build.artifacts[artifactType] });
    }
  }
  if (build.desiredArtifactMainStats) {
    for (const artifactType of Object.values(ArtifactType)) {
      if (
        build.desiredArtifactMainStats[artifactType] &&
        !Array.isArray(build.desiredArtifactMainStats[artifactType])
      ) {
        console.log(`Build has desiredArtifactMainStats for ${artifactType} as not an array.`);
        build.desiredArtifactMainStats[artifactType] = [build.desiredArtifactMainStats[artifactType]];
      }
    }
  }
  if (build.desiredStats) {
    console.log("Build has desiredStats field.");
    delete build.desiredStats;
  }
  if (!build.desiredOverallStats) {
    console.log("Build missing desiredOverallStats field.");
    build.desiredOverallStats = [];
  }
  for (const desiredOverallStat of build.desiredOverallStats) {
    if (typeof desiredOverallStat.stat === "string") {
      console.log("Build has desiredOverallStat.stat as a string");
      desiredOverallStat.stat = { key: desiredOverallStat.stat, value: desiredOverallStat.value };
      delete desiredOverallStat.value;
    }
  }
  if (build.sortOrder === undefined) {
    console.log("Build missing sortOrder field.");
    build.sortOrder = -1;
  }
};

export const validateArtifact = (data: unknown): Artifact => {
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

  return data as Artifact;
};

export const validateArtifacts = (data: unknown): Artifact[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/ArtifactArray");

  if (!validate) {
    throw new Error("Unpexected error: validateArtifacts is not available.");
  }

  (data as unknown[]).forEach((artifact) => {
    initializeArtifact({ artifact });
  });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as Artifact[];
};

export const validateBuild = (data: unknown): Build => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/Build");

  if (!validate) {
    throw new Error("Unpexected error: validateBuild is not available.");
  }

  initializeBuild({ build: data });

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  return data as Build;
};

export const validateBuilds = (data: unknown): Build[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/BuildArray");

  if (!validate) {
    throw new Error("Unpexected error: validateBuilds is not available.");
  }

  (data as unknown[]).forEach((build) => {
    initializeBuild({ build });
  });

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
