import { getSubStats, getSubStatWeight } from "@/constants";
import { Stat } from "@/types";

export const getRandomNewSubStat = ({ mainStat, subStats }: { mainStat: Stat; subStats: Stat[] }): Stat => {
  const currentStats = new Set([mainStat, ...subStats]);
  const remainingStats = getSubStats().filter((subStat) => !currentStats.has(subStat));
  const remainingSubStatWeights: [Stat, number][] = remainingStats.map((stat) => {
    const weight = getSubStatWeight({ subStat: stat });
    return [stat, weight];
  });
  const total = remainingSubStatWeights.reduce((sum, [, weight]) => sum + weight, 0);
  const random = Math.random() * total;
  let current = 0;
  for (const [key, value] of remainingSubStatWeights) {
    if (random < current + value) {
      return key as Stat;
    }
    current += value;
  }
  throw new Error("Unexpected error: value greater than total substat weights.");
};
