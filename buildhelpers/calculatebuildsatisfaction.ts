import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  BuildArtifacts,
  OverallStat,
  Stat,
} from "@/types";

import { calculateStats } from "./calculatestats";

export interface ArtifactMainStatsSatisfactionResult {
  artifactMainStats: Record<
    ArtifactType,
    {
      desiredMainStat: Stat;
      satisfaction: boolean;
    }
  >;
  satisfaction: boolean;
}

export interface ArtifactSetBonusesSatisfactionResult {
  satisfaction: boolean;
  setBonuses: {
    desiredBonusType: ArtifactSetBonusType;
    desiredSetId: string;
    satisfaction: boolean;
  }[];
}

export interface StatsSatisfactionResult {
  satisfaction: boolean;
  stats: Record<OverallStat, { actualStatValue: number; desiredStatValue: number; satisfaction: boolean }>;
}

export interface BuildSatisfactionResult {
  artifactMainStatsSatisfaction: ArtifactMainStatsSatisfactionResult;
  artifactSetBonusesSatisfaction: ArtifactSetBonusesSatisfactionResult;
  overallSatisfaction: boolean;
  statsSatisfaction: StatsSatisfactionResult;
}

export const calculateBuildSatisfaction = ({
  build,
  genshinDataContext,
  relaxSetCriteria = false,
}: {
  build: Build;
  genshinDataContext: GenshinDataContext;
  relaxSetCriteria?: boolean;
}): BuildSatisfactionResult => {
  const calculateArtifactMainStatsSatisfaction = (): ArtifactMainStatsSatisfactionResult => {
    const artifactMainStats = [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS].reduce(
      (acc, artifactType) => {
        if (build.desiredArtifactMainStats[artifactType]) {
          acc[artifactType] = {
            desiredMainStat: build.desiredArtifactMainStats[artifactType],
            satisfaction: build.desiredArtifactMainStats[artifactType] === build.artifacts[artifactType]?.mainStat,
          };
        }
        return acc;
      },
      {} as ArtifactMainStatsSatisfactionResult["artifactMainStats"]
    );

    return {
      artifactMainStats,
      satisfaction: Object.values(artifactMainStats).every((result) => result.satisfaction),
    };
  };

  const calculateArtifactSetBonusSatisfaction = ({
    artifacts,
    setBonus,
  }: {
    artifacts: BuildArtifacts;
    setBonus: ArtifactSetBonus;
  }): boolean => {
    const matchingArtifacts = Object.values(artifacts).filter((artifact) => artifact.setId === setBonus.setId);
    if (matchingArtifacts.length >= 4 || (relaxSetCriteria && matchingArtifacts.length >= 3)) {
      return true;
    }
    return (
      setBonus.bonusType === ArtifactSetBonusType.TWO_PIECE &&
      (matchingArtifacts.length >= 2 || (relaxSetCriteria && matchingArtifacts.length >= 1))
    );
  };

  const calculateArtifactSetBonusesSatisfaction = (): ArtifactSetBonusesSatisfactionResult => {
    const setBonuses = build.desiredArtifactSetBonuses.map((setBonus) => ({
      desiredBonusType: setBonus.bonusType,
      desiredSetId: setBonus.setId,
      satisfaction: calculateArtifactSetBonusSatisfaction({ artifacts: build.artifacts, setBonus }),
    }));

    return {
      satisfaction: setBonuses.every((setBonus) => setBonus.satisfaction),
      setBonuses,
    };
  };

  const calculateStatsSatisfaction = (): StatsSatisfactionResult => {
    const calculatedStats = calculateStats({ build, genshinDataContext });
    const stats = build.desiredStats.reduce((acc, stat) => {
      acc[stat.stat] = {
        actualStatValue: calculatedStats[stat.stat],
        desiredStatValue: stat.value,
        satisfaction: stat.value <= calculatedStats[stat.stat],
      };
      return acc;
    }, {} as StatsSatisfactionResult["stats"]);

    return {
      satisfaction: Object.values(stats).every((stat) => stat.satisfaction),
      stats,
    };
  };

  const artifactMainStatsSatisfaction = calculateArtifactMainStatsSatisfaction();
  const artifactSetBonusesSatisfaction = calculateArtifactSetBonusesSatisfaction();
  const statsSatisfaction = calculateStatsSatisfaction();

  return {
    artifactMainStatsSatisfaction,
    artifactSetBonusesSatisfaction,
    overallSatisfaction:
      artifactMainStatsSatisfaction.satisfaction &&
      artifactSetBonusesSatisfaction.satisfaction &&
      statsSatisfaction.satisfaction,
    statsSatisfaction,
  };
};
