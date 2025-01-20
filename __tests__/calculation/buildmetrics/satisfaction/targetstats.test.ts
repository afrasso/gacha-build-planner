import { describe, expect, it } from "vitest";

import { calculateTargetStatsSatisfaction } from "@/calculation/buildmetrics/satisfaction/targetstats";
import { BuildStats, OverallStat, StatValue } from "@/types";

describe("Target Stats Satisfaction Tests", () => {
  describe("calculateTargetStatsSatisfaction()", () => {
    describe("When two target stats are desired", () => {
      describe("and the build's stats meet those target stats", () => {
        it("should indicate that the target stats are satisfied", () => {
          const stats: BuildStats = {
            [OverallStat.ATK]: 100,
            [OverallStat.CRIT_DMG]: 100,
            [OverallStat.CRIT_RATE]: 100,
            [OverallStat.DEF]: 100,
            [OverallStat.DMG_BONUS_ANEMO]: 100,
            [OverallStat.DMG_BONUS_CRYO]: 100,
            [OverallStat.DMG_BONUS_DENDRO]: 100,
            [OverallStat.DMG_BONUS_ELECTRO]: 100,
            [OverallStat.DMG_BONUS_GEO]: 100,
            [OverallStat.DMG_BONUS_HYDRO]: 100,
            [OverallStat.DMG_BONUS_PHYSICAL]: 100,
            [OverallStat.DMG_BONUS_PYRO]: 100,
            [OverallStat.ELEMENTAL_MASTERY]: 100,
            [OverallStat.ENERGY_RECHARGE]: 100,
            [OverallStat.HEALING_BONUS]: 100,
            [OverallStat.MAX_HP]: 100,
          };
          const targetStats: StatValue<OverallStat>[] = [
            { stat: OverallStat.ATK, value: 50 },
            { stat: OverallStat.CRIT_DMG, value: 50 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            expect(details.satisfaction).toBe(true);
            expect(details.statValue).toBe(stats[details.targetStat]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.stat === details.targetStat)?.value
            );
          }
        });
      });

      describe("and the build's stats do not meet those target stats", () => {
        it("should indicate that the target stats are not satisfied", () => {
          const stats: BuildStats = {
            [OverallStat.ATK]: 100,
            [OverallStat.CRIT_DMG]: 100,
            [OverallStat.CRIT_RATE]: 100,
            [OverallStat.DEF]: 100,
            [OverallStat.DMG_BONUS_ANEMO]: 100,
            [OverallStat.DMG_BONUS_CRYO]: 100,
            [OverallStat.DMG_BONUS_DENDRO]: 100,
            [OverallStat.DMG_BONUS_ELECTRO]: 100,
            [OverallStat.DMG_BONUS_GEO]: 100,
            [OverallStat.DMG_BONUS_HYDRO]: 100,
            [OverallStat.DMG_BONUS_PHYSICAL]: 100,
            [OverallStat.DMG_BONUS_PYRO]: 100,
            [OverallStat.ELEMENTAL_MASTERY]: 100,
            [OverallStat.ENERGY_RECHARGE]: 100,
            [OverallStat.HEALING_BONUS]: 100,
            [OverallStat.MAX_HP]: 100,
          };
          const targetStats: StatValue<OverallStat>[] = [
            { stat: OverallStat.ATK, value: 200 },
            { stat: OverallStat.CRIT_DMG, value: 200 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            expect(details.satisfaction).toBe(false);
            expect(details.statValue).toBe(stats[details.targetStat]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.stat === details.targetStat)?.value
            );
          }
        });
      });

      describe("and the only some of the build's stats meet the target stats", () => {
        it("should indicate that the target stats are not satisfied", () => {
          const stats: BuildStats = {
            [OverallStat.ATK]: 100,
            [OverallStat.CRIT_DMG]: 100,
            [OverallStat.CRIT_RATE]: 100,
            [OverallStat.DEF]: 100,
            [OverallStat.DMG_BONUS_ANEMO]: 100,
            [OverallStat.DMG_BONUS_CRYO]: 100,
            [OverallStat.DMG_BONUS_DENDRO]: 100,
            [OverallStat.DMG_BONUS_ELECTRO]: 100,
            [OverallStat.DMG_BONUS_GEO]: 100,
            [OverallStat.DMG_BONUS_HYDRO]: 100,
            [OverallStat.DMG_BONUS_PHYSICAL]: 100,
            [OverallStat.DMG_BONUS_PYRO]: 100,
            [OverallStat.ELEMENTAL_MASTERY]: 100,
            [OverallStat.ENERGY_RECHARGE]: 100,
            [OverallStat.HEALING_BONUS]: 100,
            [OverallStat.MAX_HP]: 100,
          };
          const targetStats: StatValue<OverallStat>[] = [
            { stat: OverallStat.ATK, value: 50 },
            { stat: OverallStat.CRIT_DMG, value: 200 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            if (details.targetStat === OverallStat.ATK) {
              expect(details.satisfaction).toBe(true);
            } else {
              expect(details.satisfaction).toBe(false);
            }
            expect(details.statValue).toBe(stats[details.targetStat]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.stat === details.targetStat)?.value
            );
          }
        });
      });
    });

    describe("When no target stats are desired", () => {
      it("should indicate that the target stats are satisfied", () => {
        const stats: BuildStats = {
          [OverallStat.ATK]: 100,
          [OverallStat.CRIT_DMG]: 100,
          [OverallStat.CRIT_RATE]: 100,
          [OverallStat.DEF]: 100,
          [OverallStat.DMG_BONUS_ANEMO]: 100,
          [OverallStat.DMG_BONUS_CRYO]: 100,
          [OverallStat.DMG_BONUS_DENDRO]: 100,
          [OverallStat.DMG_BONUS_ELECTRO]: 100,
          [OverallStat.DMG_BONUS_GEO]: 100,
          [OverallStat.DMG_BONUS_HYDRO]: 100,
          [OverallStat.DMG_BONUS_PHYSICAL]: 100,
          [OverallStat.DMG_BONUS_PYRO]: 100,
          [OverallStat.ELEMENTAL_MASTERY]: 100,
          [OverallStat.ENERGY_RECHARGE]: 100,
          [OverallStat.HEALING_BONUS]: 100,
          [OverallStat.MAX_HP]: 100,
        };
        const targetStats: StatValue<OverallStat>[] = [];
        const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
        expect(satisfactionResult.satisfaction).toBe(true);
        expect(satisfactionResult.details.length).toBe(0);
      });
    });
  });
});
