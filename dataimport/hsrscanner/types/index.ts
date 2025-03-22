import Ajv from "ajv";

import { IDataContext } from "@/contexts/DataContext";
import { ImportedArtifact, ImportedBuild, ImportedData, ImportedWeaponInstance } from "@/dataimport";
import { mapEnumToKey } from "@/dataimport/mapenumtokey";

import { Character, CharacterSchema } from "./character";
import { LightCone, LightConeSchema } from "./lightcone";
import { MainStat, MainStatSchema, Relic, RelicSchema, Slot, SlotSchema, SubStat, SubStatSchema } from "./relic";

export * from "./character";
export * from "./lightcone";
export * from "./relic";

const ajv = new Ajv({ allErrors: true });

ajv.addSchema(CharacterSchema);

ajv.addSchema(LightConeSchema);

ajv.addSchema(MainStatSchema);
ajv.addSchema(RelicSchema);
ajv.addSchema(SlotSchema);
ajv.addSchema(SubStatSchema);

export const HsrScannerSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/HsrScanner",
  additionalProperties: false,
  properties: {
    build: { type: "string" },
    characters: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Character",
      },
      type: "array",
    },
    light_cones: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/LightCone",
      },
      type: "array",
    },
    metadata: {
      additionalProperties: false,
      properties: {
        trailblazer: { type: "string" },
        uid: { type: ["null", "string"] },
      },
      type: "object",
    },
    relics: {
      items: {
        $ref: "https://gacha-build-planner.vercel.app/schemas/HsrScanner/Relic",
      },
      type: "array",
    },
    source: { type: "string" },
    version: { type: "integer" },
  },
  required: ["source", "version"],
  type: "object",
};

ajv.addSchema(HsrScannerSchema);

export const validateImport = ({ data, dataContext }: { data: unknown; dataContext: IDataContext }): ImportedData => {
  const { getCharacter } = dataContext;

  const getAdjustedCharacterId = (id: string): string => {
    const numericId = parseInt(id);
    if (numericId > 8000 && numericId % 2 === 0) {
      return String(numericId - 1);
    }
    return id;
  };

  const getCharacterId = (location: string): string | undefined => {
    if (location === "") {
      return undefined;
    }
    const characterId = getAdjustedCharacterId(location);
    const character = getCharacter(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found.`);
    }
    return characterId;
  };

  const getMainStat = ({ mainstat, slot }: { mainstat: MainStat; slot: Slot }): string => {
    // For some reason the HSR scanner uses slightly different keys for main stats as it does sub stats, and doesn't
    // distinguish between flat stats and percentage stats. As a result, we need to explicitly set the main stats for
    // HEAD and HAND pieces here to the appropriate strings.
    if (slot === Slot.HEAD) {
      return "HP";
    }
    if (slot === Slot.HAND) {
      return "ATK";
    }
    return mapEnumToKey(MainStat, mainstat);
  };

  const convertToImportedArtifact = (r: Relic): ImportedArtifact => {
    const characterId = getCharacterId(r.location);

    return {
      characterId,
      isLocked: r.lock,
      level: r.level,
      mainStatKey: getMainStat({ mainstat: r.mainstat, slot: r.slot }),
      rarity: r.rarity,
      setId: r.set_id,
      subStats: r.substats.map((substat) => ({
        key: mapEnumToKey(SubStat, substat.key),
        value: substat.value,
      })),
      typeKey: mapEnumToKey(Slot, r.slot),
    };
  };

  const convertToImportedBuild = (c: Character): ImportedBuild => {
    const characterId = getCharacterId(c.id);

    if (!characterId) {
      console.log(c);
      throw new Error("Unexpected error: characters must always have a specified ID.");
    }

    return {
      characterId,
    };
  };

  const convertToImportedWeaponInstance = (lc: LightCone): ImportedWeaponInstance => {
    const characterId = getCharacterId(lc.location);

    return {
      characterId,
      id: lc.id,
    };
  };

  const validate = ajv.getSchema("https://gacha-build-planner.vercel.app/schemas/HsrScanner");

  if (!validate) {
    throw new Error("Unpexected error: validateImport (HSR-Scanner) is not available.");
  }

  const valid = validate(data);

  if (!valid) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Data validation failed.");
  }

  const { characters, light_cones, relics } = data as {
    characters: Character[];
    light_cones: LightCone[];
    relics: Relic[];
  };

  return {
    artifacts: relics.map(convertToImportedArtifact),
    builds: characters.map(convertToImportedBuild),
    weaponInstances: light_cones.map(convertToImportedWeaponInstance),
  };
};
