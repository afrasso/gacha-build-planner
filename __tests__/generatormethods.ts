import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { getMainStats, getSubStats } from "@/constants";
import {
  Artifact,
  ArtifactMetric,
  ArtifactSet,
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  DesiredOverallStat,
  Plan,
  Stat,
  StatValue,
} from "@/types";

import { getRandomElement, getRandomEnumValue } from "./testhelpers";

export const generateArtifactSet = (): ArtifactSet => {
  return {
    hasArtifactTypes: {
      [ArtifactType.CIRCLET]: true,
      [ArtifactType.FLOWER]: true,
      [ArtifactType.GOBLET]: true,
      [ArtifactType.PLUME]: true,
      [ArtifactType.SANDS]: true,
    },
    iconUrl: uuidv4(),
    iconUrls: {
      [ArtifactType.CIRCLET]: uuidv4(),
      [ArtifactType.FLOWER]: uuidv4(),
      [ArtifactType.GOBLET]: uuidv4(),
      [ArtifactType.PLUME]: uuidv4(),
      [ArtifactType.SANDS]: uuidv4(),
    },
    id: uuidv4(),
    name: uuidv4(),
    rarities: [Math.random()],
  };
};

export const generateSubStats = (): StatValue<Stat>[] => {
  return _.times(4, () => ({
    stat: getRandomElement(getSubStats()),
    value: Math.random(),
  }));
};

export const generateArtifact = (type: ArtifactType): Artifact => {
  return {
    id: uuidv4(),
    isLocked: false,
    lastUpdatedDate: new Date().toISOString(),
    level: Math.random(),
    mainStat: getRandomElement(getMainStats({ artifactType: type })),
    metricsResults: {
      [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
      [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
      [ArtifactMetric.RATING]: { buildResults: {} },
    },
    rarity: Math.random(),
    setId: uuidv4(),
    subStats: generateSubStats(),
    type,
  };
};

export const generateBuild = (): Build => {
  const artifacts = {
    [ArtifactType.CIRCLET]: generateArtifact(ArtifactType.CIRCLET),
    [ArtifactType.GOBLET]: generateArtifact(ArtifactType.GOBLET),
    [ArtifactType.SANDS]: generateArtifact(ArtifactType.SANDS),
  };
  const characterId = uuidv4();
  const desiredArtifactMainStats = {
    [ArtifactType.CIRCLET]: [getRandomElement(getMainStats({ artifactType: ArtifactType.CIRCLET }))],
    [ArtifactType.GOBLET]: [getRandomElement(getMainStats({ artifactType: ArtifactType.GOBLET }))],
    [ArtifactType.SANDS]: [getRandomElement(getMainStats({ artifactType: ArtifactType.SANDS }))],
  };
  const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
    {
      bonusType: getRandomEnumValue(ArtifactSetBonusType),
      setId: uuidv4(),
    },
  ];
  const desiredOverallStats: DesiredOverallStat[] = [];
  const lastUpdatedDate = new Date().toISOString();
  const sortOrder = 0;
  const weaponId = uuidv4();
  return {
    artifacts,
    characterId,
    desiredArtifactMainStats,
    desiredArtifactSetBonuses,
    desiredOverallStats,
    lastUpdatedDate,
    sortOrder,
    weaponId,
  };
};

export const generatePlan = ({ planId, userId }: { planId: string; userId: string }): Plan => {
  return { artifacts: [], builds: _.times(3, generateBuild), id: planId, userId };
};
