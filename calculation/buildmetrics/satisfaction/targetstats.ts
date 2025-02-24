import { OverallStatKey, Stat } from "@/types";

import { SatisfactionResult, StatSatisfactionDetails } from "./types";

export const calculateTargetStatsSatisfaction = ({
  stats,
  targetStats,
}: {
  stats: Record<OverallStatKey, number>;
  targetStats: Stat<OverallStatKey>[];
}): SatisfactionResult<StatSatisfactionDetails> => {
  const details = targetStats.map((targetStat) => ({
    satisfaction: targetStat.value <= stats[targetStat.key],
    statValue: stats[targetStat.key],
    targetStatKey: targetStat.key,
    targetStatValue: targetStat.value,
  }));

  return {
    details,
    satisfaction: Object.values(details).every((stat) => stat.satisfaction),
  };
};
