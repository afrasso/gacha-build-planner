import { getSubStats, getSubStatWeight } from "@/constants";
import { StatKey } from "@/types";

export const getRandomNewSubStat = ({ mainStat, subStats }: { mainStat: StatKey; subStats: StatKey[] }): StatKey => {
  const currentStats = new Set([mainStat, ...subStats]);
  const remainingStats = getSubStats().filter((subStat) => !currentStats.has(subStat));
  const remainingSubStatWeights: [StatKey, number][] = remainingStats.map((stat) => {
    const weight = getSubStatWeight({ subStat: stat });
    return [stat, weight];
  });
  const total = remainingSubStatWeights.reduce((sum, [, weight]) => sum + weight, 0);
  const random = Math.random() * total;
  let current = 0;
  for (const [key, value] of remainingSubStatWeights) {
    if (random < current + value) {
      return key as StatKey;
    }
    current += value;
  }
  throw new Error("Unexpected error: value greater than total substat weights.");
};
