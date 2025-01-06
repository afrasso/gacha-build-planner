import Ajv from "ajv";

import { Artifact, ArtifactSchema, SlotSchema, StatSchema } from "./artifact";
import { Character, CharacterSchema } from "./character";
import { Weapon, WeaponSchema } from "./weapon";

export * from "./artifact";
export * from "./character";
export * from "./weapon";

const ajv = new Ajv({ allErrors: true });

ajv.addSchema(ArtifactSchema);
ajv.addSchema(SlotSchema);
ajv.addSchema(StatSchema);

ajv.addSchema(CharacterSchema);

ajv.addSchema(WeaponSchema);

export const GOODSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/GOOD",
  additionalProperties: false,
  properties: {
    artifacts: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Artifact",
      },
      type: "array",
    },
    characters: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Character",
      },
      type: "array",
    },
    format: { enum: ["GOOD"], type: "string" },
    source: { type: "string" },
    version: { type: "integer" },
    weapons: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/GOOD/Weapon",
      },
      type: "array",
    },
  },
  required: ["format", "version"],
  type: "object",
};

ajv.addSchema(GOODSchema);

export const validateGOOD = (data: unknown): { artifacts: Artifact[]; characters: Character[]; weapons: Weapon[] } => {
  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/GOOD");

  if (!validate) {
    throw new Error("Unpexected error: validateGOOD is not available.");
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

  const validatedData = data as { artifacts: Artifact[]; characters: Character[]; weapons: Weapon[] };

  return {
    artifacts: validatedData.artifacts || [],
    characters: validatedData.characters || [],
    weapons: validatedData.weapons || [],
  };
};
