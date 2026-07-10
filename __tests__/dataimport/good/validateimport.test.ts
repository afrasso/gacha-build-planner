import { describe, expect, it } from "vitest";

import { expectedGenshinImportIds, goodImportFixture } from "@/__tests__/fixtures/dataimport";
import { createGenshinDataContext } from "@/__tests__/fixtures/genshindatacontext";
import { validateImport } from "@/dataimport/good";

describe("dataimport/good validateImport", () => {
  it("should parse GOOD export into imported builds, artifacts, and weapons", () => {
    const dataContext = createGenshinDataContext();
    const result = validateImport({ data: goodImportFixture, dataContext });

    expect(result.builds).toEqual([{ characterId: expectedGenshinImportIds.characterId }]);
    expect(result.weaponInstances).toEqual([
      { characterId: expectedGenshinImportIds.characterId, id: expectedGenshinImportIds.weaponId },
    ]);
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0]).toMatchObject({
      characterId: expectedGenshinImportIds.characterId,
      isLocked: false,
      level: 20,
      mainStatKey: "HP_FLAT",
      rarity: 5,
      setId: expectedGenshinImportIds.setId,
      typeKey: "FLOWER",
    });
    expect(result.artifacts[0].subStats).toEqual([{ key: "ATK_FLAT", value: 16 }]);
  });

  it("should reject invalid GOOD data", () => {
    const dataContext = createGenshinDataContext();
    expect(() => validateImport({ data: { format: "GOOD" }, dataContext })).toThrow("Data validation failed.");
  });
});
