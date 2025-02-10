import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, BuildArtifacts, DesiredOverallStat, OverallStat, StatValue } from "@/types";

import { calculateStats } from "../../stats";
import { calculateArtifactMainStatsSatisfaction } from "./artifactmainstats";
import { calculateArtifactSetBonusesSatisfaction } from "./artifactsetbonuses";
import { calculateTargetStatsSatisfaction } from "./targetstats";
import { BuildSatisfactionResult, TargetStatsStrategy } from "./types";

export * from "./types";

const getTargetStats = ({
  desiredOverallStats,
  stats,
}: {
  desiredOverallStats: DesiredOverallStat[];
  stats: Record<OverallStat, number>;
}): StatValue<OverallStat>[] => {
  return desiredOverallStats.map((desiredOverallStat) => ({
    stat: desiredOverallStat.stat,
    value: stats[desiredOverallStat.stat],
  }));
};

export const calculateBuildSatisfaction = ({
  artifacts,
  build,
  genshinDataContext,
  targetStatsStrategy = TargetStatsStrategy.CURRENT,
}: {
  artifacts?: BuildArtifacts;
  build: Build;
  genshinDataContext: GenshinDataContext;
  targetStatsStrategy?: TargetStatsStrategy;
}): BuildSatisfactionResult => {
  const artifactMainStatsSatisfaction = calculateArtifactMainStatsSatisfaction({
    artifacts: artifacts || build.artifacts,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
  });

  const artifactSetBonusesSatisfaction = calculateArtifactSetBonusesSatisfaction({
    artifacts: artifacts || build.artifacts,
    desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
  });

  const stats = calculateStats({ artifacts, build, genshinDataContext });
  const targetStats =
    targetStatsStrategy === TargetStatsStrategy.CURRENT
      ? getTargetStats({ desiredOverallStats: build.desiredOverallStats, stats })
      : build.desiredOverallStats;
  const statsSatisfaction = calculateTargetStatsSatisfaction({ stats, targetStats });

  return {
    artifactMainStatsSatisfaction,
    artifactSetBonusesSatisfaction,
    overallSatisfaction:
      artifactMainStatsSatisfaction.satisfaction &&
      (!artifactSetBonusesSatisfaction || artifactSetBonusesSatisfaction.satisfaction) &&
      statsSatisfaction.satisfaction,
    statsSatisfaction,
  };
};
