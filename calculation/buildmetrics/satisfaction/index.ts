import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build, BuildArtifacts, DesiredOverallStat, OverallStatKey, Stat } from "@/types";

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
  stats: Record<OverallStatKey, number>;
}): Stat<OverallStatKey>[] => {
  return desiredOverallStats.map((desiredOverallStat) => ({
    key: desiredOverallStat.stat.key,
    value: stats[desiredOverallStat.stat.key],
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
