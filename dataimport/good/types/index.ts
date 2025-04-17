import Ajv from "ajv";

import { IDataContext } from "@/contexts/DataContext";
import { ImportedArtifact, ImportedBuild, ImportedData, ImportedWeaponInstance } from "@/dataimport";
import { mapEnumToKey } from "@/dataimport/mapenumtokey";

import { buildArtifactSetLookup } from "../buildartifactsetlookup";
import { buildCharacterLookup } from "../buildcharacterlookup";
import { buildWeaponLookup } from "../buildweaponlookup";
import { Artifact, ArtifactSchema, Slot, SlotSchema, Stat, StatSchema } from "./artifact";
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

export const validateImport = ({ data, dataContext }: { data: unknown; dataContext: IDataContext }): ImportedData => {
  const lookupArtifactSet = buildArtifactSetLookup({ dataContext });
  const lookupCharacter = buildCharacterLookup({ dataContext });
  const lookupWeapon = buildWeaponLookup({ dataContext });

  const convertToImportedArtifact = (a: Artifact): ImportedArtifact => {
    return {
      characterId: a.location !== "" ? lookupCharacter(a.location).id : undefined,
      isLocked: a.lock,
      level: a.level,
      mainStatKey: mapEnumToKey(Stat, a.mainStatKey),
      rarity: a.rarity,
      setId: lookupArtifactSet(a.setKey).id,
      subStats: a.substats.map((substat) => ({
        key: mapEnumToKey(Stat, substat.key),
        value: substat.value,
      })),
      typeKey: mapEnumToKey(Slot, a.slotKey),
    };
  };

  const convertToImportedBuild = (c: Character): ImportedBuild => {
    return {
      characterId: lookupCharacter(c.key).id,
    };
  };

  const convertToImportedWeaponInstance = (w: Weapon): ImportedWeaponInstance => {
    return {
      characterId: w.location !== "" ? lookupCharacter(w.key).id : undefined,
      id: lookupWeapon(w.key).id,
    };
  };

  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/GOOD");

  if (!validate) {
    throw new Error("Unpexected error: validateGOOD is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    // Access the errors
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  const { artifacts, characters, weapons } = data as {
    artifacts: Artifact[];
    characters: Character[];
    weapons: Weapon[];
  };

  return {
    artifacts: (artifacts || []).map(convertToImportedArtifact),
    builds: (characters || []).map(convertToImportedBuild) || [],
    weaponInstances: (weapons || []).map(convertToImportedWeaponInstance),
  };
};
