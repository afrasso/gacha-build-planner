import { describe, expect, it } from "vitest";

import { hsrScannerImportFixture } from "@/__tests__/fixtures/dataimport";
import { createStarRailDataContext, TEST_CHARACTER_ID, TEST_SET_ID, TEST_WEAPON_ID } from "@/__tests__/fixtures/starraildatacontext";
import { validateImport } from "@/dataimport/hsrscanner";

describe("dataimport/hsrscanner validateImport", () => {
  it("should parse HSR-Scanner export into imported builds, relics, and light cones", () => {
    const dataContext = createStarRailDataContext();
    const result = validateImport({ data: hsrScannerImportFixture, dataContext });

    expect(result.builds).toEqual([{ characterId: TEST_CHARACTER_ID }]);
    expect(result.weaponInstances).toEqual([{ characterId: TEST_CHARACTER_ID, id: TEST_WEAPON_ID }]);
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0]).toMatchObject({
      characterId: TEST_CHARACTER_ID,
      isLocked: false,
      level: 15,
      mainStatKey: "HP",
      rarity: 5,
      setId: TEST_SET_ID,
      typeKey: "HEAD",
    });
    expect(result.artifacts[0].subStats).toEqual([{ key: "ATK_FLAT", value: 50 }]);
  });

  it("should reject invalid HSR-Scanner data", () => {
    const dataContext = createStarRailDataContext();
    expect(() => validateImport({ data: { source: "test" }, dataContext })).toThrow();
  });
});
