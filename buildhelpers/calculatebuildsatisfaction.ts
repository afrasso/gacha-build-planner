import {
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
  OverallStat,
} from "@/types";

interface ArtifactMainStatsSatisfactionResult {
  artifactMainStats: Partial<Record<ArtifactType, boolean>>;
  satisfaction: boolean;
}

interface ArtifactSetBonusesSatisfactionResult {
  satisfaction: boolean;
  setBonuses: Record<string, boolean>;
}

interface StatsSatisfactionResult {
  satisfaction: boolean;
  stats: Partial<Record<OverallStat, boolean>>;
}

export interface BuildSatisfactionResult {
  artifactMainStats: ArtifactMainStatsSatisfactionResult;
  artifactSetBonuses: ArtifactSetBonusesSatisfactionResult;
  satisfaction: boolean;
  stats: StatsSatisfactionResult;
}

export const calculateBuildSatisfaction = ({ build }: { build: Build }) => {
  const calculateArtifactMainStatSatisfaction = ({
    artifacts,
    desiredArtifactMainStats,
    type,
  }: {
    artifacts: BuildArtifacts;
    desiredArtifactMainStats: DesiredArtifactMainStats;
    type: ArtifactType;
  }): boolean => {
    if (!desiredArtifactMainStats[type]) {
      return true;
    }
    return !!(artifacts[type] && desiredArtifactMainStats[type] === artifacts[type].mainStat);
  };

  const calculateArtifactMainStatsSatisfaction = (): ArtifactMainStatsSatisfactionResult => {
    const artifactTypes = [ArtifactType.CIRCLET, ArtifactType.GOBLET, ArtifactType.SANDS];
    const artifactMainStats: Partial<Record<ArtifactType, boolean>> = artifactTypes.reduce((acc, type) => {
      acc[type] = calculateArtifactMainStatSatisfaction({
        artifacts: build.artifacts,
        desiredArtifactMainStats: build.desiredArtifactMainStats,
        type: type,
      });
      return acc;
    }, {} as Partial<Record<ArtifactType, boolean>>);

    return {
      artifactMainStats,
      satisfaction: artifactTypes.every((type) => artifactMainStats[type]),
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
    const artifactSetIds = build.desiredArtifactSetBonuses.map((setBonus) => setBonus.artifactSet.id);
    const setBonuses = build.desiredArtifactSetBonuses.reduce((acc, setBonus) => {
      acc[setBonus.artifactSet.id] = calculateArtifactSetBonusSatisfaction({ artifacts: build.artifacts, setBonus });
      return acc;
    }, {} as Record<string, boolean>);
    return {
      satisfaction: artifactSetIds.every((artifactSetId) => setBonuses[artifactSetId]),
      setBonuses,
    };
  };

  const calculateStatsSatisfaction = (): StatsSatisfactionResult => {
    return {
      satisfaction: true,
      stats: { [OverallStat.ATK]: true },
    };
  };

  const artifactMainStatsSatisfaction = calculateArtifactMainStatsSatisfaction();
  const artifactSetBonusesSatisfaction = calculateArtifactSetBonusesSatisfaction();
  const statsSatisfaction = calculateStatsSatisfaction();

  return {
    artifactMainStatsSatisfaction,
    artifactSetBonusesSatisfaction,
    satisfaction:
      artifactMainStatsSatisfaction.satisfaction && artifactSetBonusesSatisfaction.satisfaction && statsSatisfaction,
    statsSatisfaction,
  };
};
