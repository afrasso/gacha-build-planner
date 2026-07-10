import { describe, expect, it } from "vitest";

import { expectedGenshinImportIds, goodImportFixture } from "@/__tests__/fixtures/dataimport";
import { createGenshinDataContext, TEST_CHARACTER_ID } from "@/__tests__/fixtures/genshindatacontext";
import { updatePlan } from "@/dataimport";
import { Plan } from "@/types";
import { Build } from "@/types/genshin/build";

describe("dataimport updatePlan", () => {
  it("should merge GOOD import into an empty plan", () => {
    const dataContext = createGenshinDataContext();
    const plan: Plan = { artifacts: [], builds: [] };

    updatePlan({ data: goodImportFixture, dataContext, plan });

    expect(plan.builds).toHaveLength(1);
    expect(plan.builds[0].characterId).toBe(TEST_CHARACTER_ID);
    expect(plan.builds[0].weaponId).toBe(expectedGenshinImportIds.weaponId);
    expect(plan.artifacts).toHaveLength(1);
    expect(plan.builds[0].artifacts.HEAD).toBeUndefined();
    expect(plan.builds[0].artifacts.FLOWER).toBeDefined();
  });

  it("should preserve existing artifact metrics when re-importing a matching artifact", () => {
    const dataContext = createGenshinDataContext();
    const existingBuild = new Build({ characterId: TEST_CHARACTER_ID }).toBuildData();
    const imported = dataContext.validateImport({ data: goodImportFixture, dataContext });
    const firstPassPlan: Plan = { artifacts: [], builds: [existingBuild] };
    updatePlan({ data: goodImportFixture, dataContext, plan: firstPassPlan });
    expect(imported.artifacts).toHaveLength(1);
    const existingMetrics = firstPassPlan.artifacts[0].metricsResults;

    const secondPassPlan: Plan = {
      artifacts: [...firstPassPlan.artifacts],
      builds: [...firstPassPlan.builds],
    };
    updatePlan({ data: goodImportFixture, dataContext, plan: secondPassPlan });

    expect(secondPassPlan.artifacts[0].metricsResults).toBe(existingMetrics);
    expect(secondPassPlan.builds[0].weaponId).toBe(expectedGenshinImportIds.weaponId);
    expect(secondPassPlan.builds[0].artifacts.FLOWER).toBeDefined();
  });
});
