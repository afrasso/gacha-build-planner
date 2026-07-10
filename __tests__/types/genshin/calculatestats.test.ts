import { describe, expect, it } from "vitest";

import { createGenshinDataContext, TEST_CHARACTER_ID, TEST_WEAPON_ID } from "@/__tests__/fixtures/genshindatacontext";
import { Build } from "@/types/genshin/build";
import { calculateStats } from "@/types/genshin/stats";

describe("types/genshin/stats calculateStats", () => {
  it("should calculate base character and weapon stats without artifacts", () => {
    const dataContext = createGenshinDataContext();
    const build = new Build({
      characterId: TEST_CHARACTER_ID,
      weaponId: TEST_WEAPON_ID,
    });

    const stats = calculateStats({
      artifacts: {},
      build,
      dataContext,
      overallStatKeys: ["MAX_HP", "ATK", "DEF", "CRIT_RATE", "CRIT_DMG", "ENERGY_RECHARGE"],
    });

    expect(stats.MAX_HP).toBe(10000);
    expect(stats.ATK).toBe(900);
    expect(stats.DEF).toBe(800);
    expect(stats.CRIT_RATE).toBe(5);
    expect(stats.CRIT_DMG).toBe(19.2);
    expect(stats.ENERGY_RECHARGE).toBe(100);
  });
});
