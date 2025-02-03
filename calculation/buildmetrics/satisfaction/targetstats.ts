import { BuildStats, OverallStat, StatValue } from "@/types";

import { SatisfactionResult, StatSatisfactionDetails } from "./types";

export const calculateTargetStatsSatisfaction = ({
  stats,
  targetStats,
}: {
  stats: BuildStats;
  // TODO: GODDAMN IT RENAME STAT TO STAT KEY
  targetStats: StatValue<OverallStat>[];
}): SatisfactionResult<StatSatisfactionDetails> => {
  const details = targetStats.map((targetStat) => ({
    satisfaction: targetStat.value <= stats[targetStat.stat],
    statValue: stats[targetStat.stat],
    targetStat: targetStat.stat,
    targetStatValue: targetStat.value,
  }));

  return {
    details,
    satisfaction: Object.values(details).every((stat) => stat.satisfaction),
  };
};
