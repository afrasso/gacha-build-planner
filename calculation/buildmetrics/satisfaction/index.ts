import { IDataContext } from "@/contexts/DataContext";
import { DesiredOverallStat, IArtifact, IBuild, Stat } from "@/types";

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
  stats: Record<string, number>;
}): Stat[] => {
  return desiredOverallStats.map((desiredOverallStat) => ({
    key: desiredOverallStat.stat.key,
    value: stats[desiredOverallStat.stat.key],
  }));
};

export const calculateBuildSatisfaction = ({
  artifacts,
  build,
  dataContext,
  targetStatsStrategy = TargetStatsStrategy.DESIRED,
}: {
  artifacts?: Record<string, IArtifact>;
  build: IBuild;
  dataContext: IDataContext;
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

  const stats = build.calculateStats({ artifacts, dataContext });
  const targetStats =
    targetStatsStrategy === TargetStatsStrategy.CURRENT
      ? getTargetStats({ desiredOverallStats: build.desiredOverallStats, stats })
      : build.desiredOverallStats.map((desiredStat) => desiredStat.stat);
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
