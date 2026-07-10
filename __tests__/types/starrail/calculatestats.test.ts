import { describe, expect, it } from "vitest";

import { createStarRailDataContext, TEST_CHARACTER_ID, TEST_WEAPON_ID } from "@/__tests__/fixtures/starraildatacontext";
import { Build } from "@/types/starrail/build";
import { calculateStats } from "@/types/starrail/stats";

describe("types/starrail/stats calculateStats", () => {
  it("should calculate base character and weapon stats without relics", () => {
    const dataContext = createStarRailDataContext();
    const build = new Build({
      characterId: TEST_CHARACTER_ID,
      weaponId: TEST_WEAPON_ID,
    });

    const stats = calculateStats({
      artifacts: {},
      build,
      dataContext,
      overallStatKeys: ["MAX_HP", "ATK", "DEF", "SPD", "CRIT_RATE", "CRIT_DMG"],
    });

    expect(stats.MAX_HP).toBe(9000);
    expect(stats.ATK).toBe(750);
    expect(stats.DEF).toBe(500);
    expect(stats.SPD).toBe(100);
    expect(stats.CRIT_RATE).toBe(5);
    expect(stats.CRIT_DMG).toBe(50);
  });
});
