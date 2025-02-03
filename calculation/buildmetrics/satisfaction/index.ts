import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, BuildArtifacts, OverallStat, StatValue } from "@/types";

import { calculateStats } from "../../stats";
import { calculateArtifactMainStatsSatisfaction } from "./artifactmainstats";
import { calculateArtifactSetBonusesSatisfaction } from "./artifactsetbonuses";
import { calculateTargetStatsSatisfaction } from "./targetstats";
import { BuildSatisfactionResult, TargetStatsStrategy } from "./types";

export * from "./types";

const getTargetStats = ({
  desiredStats,
  stats,
}: {
  desiredStats: StatValue<OverallStat>[];
  stats: Record<OverallStat, number>;
}): StatValue<OverallStat>[] => {
  return desiredStats.map((desiredStat) => ({
    stat: desiredStat.stat,
    value: stats[desiredStat.stat],
  }));
};

export const calculateBuildSatisfaction = ({
  artifacts,
  build,
  genshinDataContext,
  ignoreSetBonuses = false,
  targetStatsStrategy = TargetStatsStrategy.CURRENT,
}: {
  artifacts?: BuildArtifacts;
  build: Build;
  genshinDataContext: GenshinDataContext;
  ignoreSetBonuses?: boolean;
  targetStatsStrategy?: TargetStatsStrategy;
}): BuildSatisfactionResult => {
  const artifactMainStatsSatisfaction = calculateArtifactMainStatsSatisfaction({
    artifacts: artifacts || build.artifacts,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
  });

  const artifactSetBonusesSatisfaction = ignoreSetBonuses
    ? undefined
    : calculateArtifactSetBonusesSatisfaction({
        artifacts: artifacts || build.artifacts,
        desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
      });

  const stats = calculateStats({ artifacts, build, genshinDataContext });
  const targetStats =
    targetStatsStrategy === TargetStatsStrategy.CURRENT
      ? getTargetStats({ desiredStats: build.desiredStats, stats })
      : build.desiredStats;
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
