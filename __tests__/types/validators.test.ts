import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { validateArtifact, validateBuild, validatePlan } from "@/types";
import { ArtifactMetric } from "@/types/artifactmetrics";

const emptyMetricResults = {
  buildResults: {},
};

const emptyMetricsResults = {
  [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: emptyMetricResults,
  [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: emptyMetricResults,
  [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: emptyMetricResults,
  [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: emptyMetricResults,
  [ArtifactMetric.PLUS_MINUS]: emptyMetricResults,
  [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: emptyMetricResults,
  [ArtifactMetric.RATING]: emptyMetricResults,
};

describe("types AJV validators", () => {
  const validArtifact = {
    _typeBrand: "ArtifactData",
    id: uuidv4(),
    isLocked: false,
    lastUpdatedDate: new Date().toISOString(),
    level: 20,
    mainStatKey: "HP_FLAT",
    metricsResults: emptyMetricsResults,
    rarity: 5,
    setId: uuidv4(),
    subStats: [],
    typeKey: "FLOWER",
  };

  const validBuild = {
    _typeBrand: "BuildData",
    artifacts: {},
    characterId: uuidv4(),
    desiredArtifactMainStats: {},
    desiredArtifactSetBonuses: [],
    desiredOverallStats: [],
    lastUpdatedDate: new Date().toISOString(),
    sortOrder: 0,
  };

  it("should accept valid artifact, build, and plan payloads", () => {
    const artifact = validateArtifact(validArtifact);
    const build = validateBuild(validBuild);
    const plan = validatePlan({ artifacts: [artifact], builds: [build] });

    expect(plan.artifacts).toHaveLength(1);
    expect(plan.builds).toHaveLength(1);
  });

  it("should reject artifacts with the wrong type brand", () => {
    expect(() => validateArtifact({ ...validArtifact, _typeBrand: "WrongBrand" })).toThrow("Data validation failed.");
  });

  it("should reject builds missing required fields", () => {
    const { characterId: _characterId, ...invalidBuild } = validBuild;
    expect(() => validateBuild(invalidBuild)).toThrow("Data validation failed.");
  });

  it("should reject plans with invalid nested builds", () => {
    expect(() =>
      validatePlan({
        artifacts: [],
        builds: [{ ...validBuild, _typeBrand: "WrongBrand" }],
      })
    ).toThrow("Data validation failed.");
  });
});
