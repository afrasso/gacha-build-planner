import Ajv from "ajv";

import {
  ArtifactSchema,
  ArtifactSetBonusSchema,
  ArtifactSetBonusTypeSchema,
  ArtifactSetSchema,
  ArtifactTypeSchema,
  BuildArtifactsSchema,
  DesiredArtifactMainStatsSchema,
} from "./artifact";
import { Build, BuildSchema, BuildSetSchema } from "./build";
import { CharacterSchema, ElementSchema } from "./character";
import { PlanSchema } from "./plan";
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
ajv.addSchema(ArtifactSetSchema);
ajv.addSchema(ArtifactSetBonusSchema);
ajv.addSchema(ArtifactSetBonusTypeSchema);
ajv.addSchema(ArtifactTypeSchema);
ajv.addSchema(BuildArtifactsSchema);
ajv.addSchema(DesiredArtifactMainStatsSchema);

ajv.addSchema(BuildSchema);
ajv.addSchema(BuildSetSchema);

ajv.addSchema(CharacterSchema);
ajv.addSchema(ElementSchema);

ajv.addSchema(PlanSchema);

ajv.addSchema(OverallStatSchema);
ajv.addSchema(OverallStatValueSchema);
ajv.addSchema(StatSchema);
ajv.addSchema(StatValueSchema);

ajv.addSchema(WeaponSchema);
ajv.addSchema(WeaponTypeSchema);

export const validateBuilds = (data: unknown): Build[] => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/BuildSet");

  if (!validate) {
    throw new Error("Unpexected error: validateBuilds is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    // Access the errors
    console.error("Validation errors:", validate.errors);

    // Optionally, format the errors for better readability
    const formattedErrors = ajv.errorsText(validate.errors, { separator: "\n" });
    console.error("Formatted Errors:\n", formattedErrors);

    throw new Error("Data validation failed.");
  }

  return (data as { builds: Build[] }).builds;
};
