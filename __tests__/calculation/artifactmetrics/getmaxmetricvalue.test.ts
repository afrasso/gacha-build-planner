// import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";

import { getMaxMetricValue } from "@/calculation/artifactmetrics/getmaxmetricvalue";
import { ArtifactMetric, ArtifactMetricsResults } from "@/types";

describe("Max Metric Value Calculation Tests", () => {
  const results: ArtifactMetricsResults = {
    [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: {
      buildResults: {
        "10000014": { calculatedOn: "2025-01-20T23:48:03.873Z", iterations: 5, result: 1 },
        "10000064": { calculatedOn: "2025-01-20T23:48:03.872Z", iterations: 5, result: 1 },
        "10000073": { calculatedOn: "2025-01-20T23:48:03.868Z", iterations: 5, result: 1 },
        "10000090": { calculatedOn: "2025-01-20T23:48:03.871Z", iterations: 5, result: 1 },
        "10000103": { calculatedOn: "2025-01-20T23:48:03.869Z", iterations: 5, result: 1 },
      },
    },
    [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: {
      buildResults: {
        "10000002": { calculatedOn: "2025-01-20T23:48:03.882Z", iterations: 5, result: 1 },
        "10000014": { calculatedOn: "2025-01-20T23:48:03.888Z", iterations: 5, result: 1 },
        "10000016": { calculatedOn: "2025-01-20T23:48:03.885Z", iterations: 5, result: 1 },
        "10000020": { calculatedOn: "2025-01-20T23:48:03.889Z", iterations: 5, result: 1 },
        "10000023": { calculatedOn: "2025-01-20T23:48:03.879Z", iterations: 5, result: 1 },
        "10000025": { calculatedOn: "2025-01-20T23:48:03.878Z", iterations: 5, result: 1 },
        "10000030": { calculatedOn: "2025-01-20T23:48:03.881Z", iterations: 5, result: 1 },
        "10000031": { calculatedOn: "2025-01-20T23:48:03.883Z", iterations: 5, result: 1 },
        "10000032": { calculatedOn: "2025-01-20T23:48:03.881Z", iterations: 5, result: 1 },
        "10000034": { calculatedOn: "2025-01-20T23:48:03.887Z", iterations: 5, result: 1 },
        "10000038": { calculatedOn: "2025-01-20T23:48:03.888Z", iterations: 5, result: 1 },
        "10000041": { calculatedOn: "2025-01-20T23:48:03.883Z", iterations: 5, result: 1 },
        "10000042": { calculatedOn: "2025-01-20T23:48:03.887Z", iterations: 5, result: 1 },
        "10000043": { calculatedOn: "2025-01-20T23:48:03.884Z", iterations: 5, result: 1 },
        "10000044": { calculatedOn: "2025-01-20T23:48:03.889Z", iterations: 5, result: 1 },
        "10000047": { calculatedOn: "2025-01-20T23:48:03.880Z", iterations: 5, result: 1 },
        "10000049": { calculatedOn: "2025-01-20T23:48:03.886Z", iterations: 5, result: 1 },
        "10000052": { calculatedOn: "2025-01-20T23:48:03.879Z", iterations: 5, result: 1 },
        "10000059": { calculatedOn: "2025-01-20T23:48:03.888Z", iterations: 5, result: 1 },
        "10000060": { calculatedOn: "2025-01-20T23:48:03.878Z", iterations: 5, result: 1 },
        "10000064": { calculatedOn: "2025-01-20T23:48:03.886Z", iterations: 5, result: 1 },
        "10000065": { calculatedOn: "2025-01-20T23:48:03.883Z", iterations: 5, result: 1 },
        "10000069": { calculatedOn: "2025-01-20T23:48:03.885Z", iterations: 5, result: 1 },
        "10000073": { calculatedOn: "2025-01-20T23:48:03.876Z", iterations: 5, result: 1 },
        "10000078": { calculatedOn: "2025-01-20T23:48:03.876Z", iterations: 5, result: 1 },
        "10000087": { calculatedOn: "2025-01-20T23:48:03.875Z", iterations: 5, result: 1 },
        "10000089": { calculatedOn: "2025-01-20T23:48:03.877Z", iterations: 5, result: 1 },
        "10000090": { calculatedOn: "2025-01-20T23:48:03.884Z", iterations: 5, result: 1 },
        "10000092": { calculatedOn: "2025-01-20T23:48:03.882Z", iterations: 5, result: 1 },
        "10000103": { calculatedOn: "2025-01-20T23:48:03.880Z", iterations: 5, result: 1 },
      },
    },
    [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
    [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: {
      buildResults: { "10000103": { calculatedOn: "2025-01-20T23:48:03.897Z", iterations: 5, result: 0.4 } },
    },
    [ArtifactMetric.PLUS_MINUS]: {
      buildResults: {
        "10000002": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000003": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000006": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000014": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000015": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000016": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000020": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000021": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000022": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000023": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000024": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000025": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000027": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000030": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000031": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000032": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000034": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000035": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000036": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000038": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000039": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000041": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000042": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000043": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000044": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000045": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000047": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000048": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000049": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000050": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000052": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000053": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000055": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000056": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000059": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000060": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000061": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000062": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000064": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000065": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000067": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000068": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000069": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000072": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000073": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000074": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000076": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000077": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000078": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000079": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000080": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000081": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000083": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000085": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000087": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: -0.9180609180609185 },
        "10000088": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000089": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000090": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000092": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000094": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000097": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000100": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000103": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
      },
    },
    [ArtifactMetric.RATING]: {
      buildResults: {
        "10000002": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000003": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000006": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000014": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000015": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000016": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000020": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000021": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000022": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000023": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000024": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000025": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000027": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000030": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000031": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000032": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000034": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000035": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000036": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000038": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000039": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000041": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000042": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000043": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000044": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000045": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000047": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000048": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000049": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000050": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000052": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000053": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000055": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000056": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000059": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000060": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000061": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000062": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000064": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000065": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000067": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000068": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000069": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000072": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000073": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000074": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000076": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000077": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000078": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000079": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000080": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000081": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000083": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000085": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000087": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 1.8876018876018876 },
        "10000088": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000089": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000090": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000092": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000094": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
        "10000097": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000100": { calculatedOn: "2025-01-20T23:48:03.905Z", iterations: 5, result: 0 },
        "10000103": { calculatedOn: "2025-01-20T23:48:03.904Z", iterations: 5, result: 0 },
      },
    },
  };

  describe("getMaxMetricValue()", () => {
    describe("When I get the max value for the ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS metric", () => {
      it("should return the expected result", () => {
        const maxValue = getMaxMetricValue({
          metric: ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
          metricsResults: results,
        });
        expect(maxValue).toBe(1);
      });
    });

    describe("When I get the max value for the ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS metric", () => {
      it("should return the expected result", () => {
        const maxValue = getMaxMetricValue({
          metric: ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS,
          metricsResults: results,
        });
        expect(maxValue).toBe(1);
      });
    });

    describe("When I get the max value for the ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS metric", () => {
      it("should return the expected result", () => {
        const maxValue = getMaxMetricValue({
          metric: ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS,
          metricsResults: results,
        });
        expect(maxValue).toBeUndefined();
      });
    });

    describe("When I get the max value for the ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS metric", () => {
      it("should return the expected result", () => {
        const maxValue = getMaxMetricValue({
          metric: ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS,
          metricsResults: results,
        });
        expect(maxValue).toBe(0.4);
      });
    });
  });
});
