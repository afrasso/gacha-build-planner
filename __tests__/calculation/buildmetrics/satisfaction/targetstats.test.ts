import { describe, expect, it } from "vitest";

import { calculateTargetStatsSatisfaction } from "@/calculation/buildmetrics/satisfaction/targetstats";
import { OverallStatKey, Stat } from "@/types";

describe("Target Stats Satisfaction Tests", () => {
  describe("calculateTargetStatsSatisfaction()", () => {
    describe("When two target stats are desired", () => {
      describe("and the build's stats meet those target stats", () => {
        it("should indicate that the target stats are satisfied", () => {
          const stats: Record<OverallStatKey, number> = {
            [OverallStatKey.ATK]: 100,
            [OverallStatKey.CRIT_DMG]: 100,
            [OverallStatKey.CRIT_RATE]: 100,
            [OverallStatKey.DEF]: 100,
            [OverallStatKey.DMG_BONUS_ANEMO]: 100,
            [OverallStatKey.DMG_BONUS_CRYO]: 100,
            [OverallStatKey.DMG_BONUS_DENDRO]: 100,
            [OverallStatKey.DMG_BONUS_ELECTRO]: 100,
            [OverallStatKey.DMG_BONUS_GEO]: 100,
            [OverallStatKey.DMG_BONUS_HYDRO]: 100,
            [OverallStatKey.DMG_BONUS_PHYSICAL]: 100,
            [OverallStatKey.DMG_BONUS_PYRO]: 100,
            [OverallStatKey.ELEMENTAL_MASTERY]: 100,
            [OverallStatKey.ENERGY_RECHARGE]: 100,
            [OverallStatKey.HEALING_BONUS]: 100,
            [OverallStatKey.MAX_HP]: 100,
          };
          const targetStats: Stat<OverallStatKey>[] = [
            { key: OverallStatKey.ATK, value: 50 },
            { key: OverallStatKey.CRIT_DMG, value: 50 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(true);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            expect(details.satisfaction).toBe(true);
            expect(details.currentStatValue).toBe(stats[details.statKey]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.key === details.statKey)?.value
            );
          }
        });
      });

      describe("and the build's stats do not meet those target stats", () => {
        it("should indicate that the target stats are not satisfied", () => {
          const stats: Record<OverallStatKey, number> = {
            [OverallStatKey.ATK]: 100,
            [OverallStatKey.CRIT_DMG]: 100,
            [OverallStatKey.CRIT_RATE]: 100,
            [OverallStatKey.DEF]: 100,
            [OverallStatKey.DMG_BONUS_ANEMO]: 100,
            [OverallStatKey.DMG_BONUS_CRYO]: 100,
            [OverallStatKey.DMG_BONUS_DENDRO]: 100,
            [OverallStatKey.DMG_BONUS_ELECTRO]: 100,
            [OverallStatKey.DMG_BONUS_GEO]: 100,
            [OverallStatKey.DMG_BONUS_HYDRO]: 100,
            [OverallStatKey.DMG_BONUS_PHYSICAL]: 100,
            [OverallStatKey.DMG_BONUS_PYRO]: 100,
            [OverallStatKey.ELEMENTAL_MASTERY]: 100,
            [OverallStatKey.ENERGY_RECHARGE]: 100,
            [OverallStatKey.HEALING_BONUS]: 100,
            [OverallStatKey.MAX_HP]: 100,
          };
          const targetStats: Stat<OverallStatKey>[] = [
            { key: OverallStatKey.ATK, value: 200 },
            { key: OverallStatKey.CRIT_DMG, value: 200 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            expect(details.satisfaction).toBe(false);
            expect(details.currentStatValue).toBe(stats[details.statKey]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.key === details.statKey)?.value
            );
          }
        });
      });

      describe("and the only some of the build's stats meet the target stats", () => {
        it("should indicate that the target stats are not satisfied", () => {
          const stats: Record<OverallStatKey, number> = {
            [OverallStatKey.ATK]: 100,
            [OverallStatKey.CRIT_DMG]: 100,
            [OverallStatKey.CRIT_RATE]: 100,
            [OverallStatKey.DEF]: 100,
            [OverallStatKey.DMG_BONUS_ANEMO]: 100,
            [OverallStatKey.DMG_BONUS_CRYO]: 100,
            [OverallStatKey.DMG_BONUS_DENDRO]: 100,
            [OverallStatKey.DMG_BONUS_ELECTRO]: 100,
            [OverallStatKey.DMG_BONUS_GEO]: 100,
            [OverallStatKey.DMG_BONUS_HYDRO]: 100,
            [OverallStatKey.DMG_BONUS_PHYSICAL]: 100,
            [OverallStatKey.DMG_BONUS_PYRO]: 100,
            [OverallStatKey.ELEMENTAL_MASTERY]: 100,
            [OverallStatKey.ENERGY_RECHARGE]: 100,
            [OverallStatKey.HEALING_BONUS]: 100,
            [OverallStatKey.MAX_HP]: 100,
          };
          const targetStats: Stat<OverallStatKey>[] = [
            { key: OverallStatKey.ATK, value: 50 },
            { key: OverallStatKey.CRIT_DMG, value: 200 },
          ];
          const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
          expect(satisfactionResult.satisfaction).toBe(false);
          expect(satisfactionResult.details.length).toBe(targetStats.length);
          for (const details of satisfactionResult.details) {
            if (details.statKey === OverallStatKey.ATK) {
              expect(details.satisfaction).toBe(true);
            } else {
              expect(details.satisfaction).toBe(false);
            }
            expect(details.currentStatValue).toBe(stats[details.statKey]);
            expect(details.targetStatValue).toBe(
              targetStats.find((statValue) => statValue.key === details.statKey)?.value
            );
          }
        });
      });
    });

    describe("When no target stats are desired", () => {
      it("should indicate that the target stats are satisfied", () => {
        const stats: Record<OverallStatKey, number> = {
          [OverallStatKey.ATK]: 100,
          [OverallStatKey.CRIT_DMG]: 100,
          [OverallStatKey.CRIT_RATE]: 100,
          [OverallStatKey.DEF]: 100,
          [OverallStatKey.DMG_BONUS_ANEMO]: 100,
          [OverallStatKey.DMG_BONUS_CRYO]: 100,
          [OverallStatKey.DMG_BONUS_DENDRO]: 100,
          [OverallStatKey.DMG_BONUS_ELECTRO]: 100,
          [OverallStatKey.DMG_BONUS_GEO]: 100,
          [OverallStatKey.DMG_BONUS_HYDRO]: 100,
          [OverallStatKey.DMG_BONUS_PHYSICAL]: 100,
          [OverallStatKey.DMG_BONUS_PYRO]: 100,
          [OverallStatKey.ELEMENTAL_MASTERY]: 100,
          [OverallStatKey.ENERGY_RECHARGE]: 100,
          [OverallStatKey.HEALING_BONUS]: 100,
          [OverallStatKey.MAX_HP]: 100,
        };
        const targetStats: Stat<OverallStatKey>[] = [];
        const satisfactionResult = calculateTargetStatsSatisfaction({ stats, targetStats });
        expect(satisfactionResult.satisfaction).toBe(true);
        expect(satisfactionResult.details.length).toBe(0);
      });
    });
  });
});
