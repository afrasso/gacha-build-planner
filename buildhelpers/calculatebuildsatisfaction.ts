import {
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
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
    desiredSetId: string;
    desiredBonusType: ArtifactSetBonusType;
    satisfaction: boolean;
  }[];
}

export interface StatsSatisfactionResult {
  satisfaction: boolean;
  stats: Record<OverallStat, { desiredStatValue: number; satisfaction: boolean }>;
}

export interface BuildSatisfactionResult {
  artifactMainStatsSatisfaction: ArtifactMainStatsSatisfactionResult;
  artifactSetBonusesSatisfaction: ArtifactSetBonusesSatisfactionResult;
  overallSatisfaction: boolean;
  statsSatisfaction: StatsSatisfactionResult;
}

export const calculateBuildSatisfaction = ({ build }: { build: Build }): BuildSatisfactionResult => {
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
      satisfaction: Object.values(artifactMainStats).every((result) => result),
    };
  };

  const calculateArtifactSetBonusSatisfaction = ({
    artifacts,
    setBonus,
  }: {
    artifacts: BuildArtifacts;
    setBonus: ArtifactSetBonus;
  }): boolean => {
    const matchingArtifacts = Object.values(artifacts).filter(
      (artifact) => artifact.set.id === setBonus.artifactSet.id
    );
    if (matchingArtifacts.length >= 4) {
      return true;
    }
    return setBonus.bonusType === ArtifactSetBonusType.TWO_PIECE && matchingArtifacts.length >= 2;
  };

  const calculateArtifactSetBonusesSatisfaction = (): ArtifactSetBonusesSatisfactionResult => {
    const setBonuses = build.desiredArtifactSetBonuses.map((setBonus) => ({
      desiredSetId: setBonus.artifactSet.id,
      desiredBonusType: setBonus.bonusType,
      satisfaction: calculateArtifactSetBonusSatisfaction({ artifacts: build.artifacts, setBonus }),
    }));

    return {
      satisfaction: setBonuses.every((setBonus) => setBonus.satisfaction),
      setBonuses,
    };
  };

  const calculateStatsSatisfaction = (): StatsSatisfactionResult => {
    const calculatedStats = calculateStats({ build });
    const stats = build.desiredStats.reduce((acc, stat) => {
      acc[stat.stat] = {
        desiredStatValue: stat.value,
        satisfaction: stat.value <= calculatedStats[stat.stat],
      };
      return acc;
    }, {} as StatsSatisfactionResult["stats"]);

    return {
      satisfaction: Object.values(stats).every((result) => result),
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
