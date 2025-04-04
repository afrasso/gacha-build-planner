import { Stat } from "@/types";

import { SatisfactionResult, StatSatisfactionDetails } from "./types";

export const calculateTargetStatsSatisfaction = ({
  stats,
  targetStats,
}: {
  stats: Record<string, number>;
  targetStats: Stat[];
}): SatisfactionResult<StatSatisfactionDetails> => {
  const details = targetStats.map((targetStat) => ({
    currentStatValue: stats[targetStat.key],
    satisfaction: targetStat.value <= stats[targetStat.key],
    statKey: targetStat.key,
    targetStatValue: targetStat.value,
  }));

  return {
    details,
    satisfaction: Object.values(details).every((stat) => stat.satisfaction),
  };
};
