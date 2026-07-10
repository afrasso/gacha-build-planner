import { describe, expect, it } from "vitest";

import { createGenshinDataContext, TEST_CHARACTER_ID } from "@/__tests__/fixtures/genshindatacontext";
import { generateArtifact } from "@/__tests__/generators";
import { calculateBuildSatisfaction } from "@/calculation/buildmetrics/satisfaction";
import { Build } from "@/types/genshin/build";

describe("calculateBuildSatisfaction orchestrator", () => {
  it("should compose stat calculation and satisfaction sub-modules", () => {
    const dataContext = createGenshinDataContext();
    const artifacts = {
      CIRCLET: generateArtifact({ mainStatKey: "CRIT_RATE", typeKey: "CIRCLET" }),
      FLOWER: generateArtifact({ mainStatKey: "HP_FLAT", typeKey: "FLOWER" }),
      GOBLET: generateArtifact({ mainStatKey: "DMG_BONUS_PYRO", typeKey: "GOBLET" }),
      PLUME: generateArtifact({ mainStatKey: "ATK_FLAT", typeKey: "PLUME" }),
      SANDS: generateArtifact({ mainStatKey: "ATK_PERCENT", typeKey: "SANDS" }),
    };
    const build = new Build({
      artifacts: Object.fromEntries(
        Object.entries(artifacts).map(([typeKey, artifact]) => [typeKey, artifact.toArtifactData()])
      ),
      characterId: TEST_CHARACTER_ID,
      desiredArtifactMainStats: {
        CIRCLET: ["CRIT_RATE"],
        FLOWER: ["HP_FLAT"],
        GOBLET: ["DMG_BONUS_PYRO"],
        PLUME: ["ATK_FLAT"],
        SANDS: ["ATK_PERCENT"],
      },
      desiredArtifactSetBonuses: [],
      desiredOverallStats: [
        { excessUseful: false, priority: 1, stat: { key: "ATK", value: 50000 } },
        { excessUseful: false, priority: 2, stat: { key: "MAX_HP", value: 50000 } },
      ],
      weaponId: undefined,
    });

    const result = calculateBuildSatisfaction({ build, dataContext });

    expect(result.artifactMainStatsSatisfaction?.satisfaction).toBe(true);
    expect(result.statsSatisfaction?.satisfaction).toBe(false);
    expect(result.overallSatisfaction).toBe(false);
    expect(result.statsSatisfaction?.details.length).toBe(2);
  });
});
