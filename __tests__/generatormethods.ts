import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { MAIN_STATS_BY_ARTIFACT_TYPE, SUB_STATS } from "@/constants";
import {
  Artifact,
  ArtifactSet,
  ArtifactSetBonus,
  ArtifactSetBonusType,
  ArtifactType,
  Build,
  OverallStat,
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
    stat: getRandomElement(SUB_STATS),
    value: Math.random(),
  }));
};

export const generateArtifact = (type: ArtifactType): Artifact => {
  return {
    id: uuidv4(),
    level: Math.random(),
    mainStat: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[type]),
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
    [ArtifactType.CIRCLET]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET]),
    [ArtifactType.GOBLET]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET]),
    [ArtifactType.SANDS]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.SANDS]),
  };
  const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
    {
      bonusType: getRandomEnumValue(ArtifactSetBonusType),
      setId: uuidv4(),
    },
  ];
  const desiredStats = Object.values(OverallStat).map((stat) => ({ stat, value: Math.random() }));
  const weaponId = uuidv4();
  return { artifacts, characterId, desiredArtifactMainStats, desiredArtifactSetBonuses, desiredStats, weaponId };
};

export const generatePlan = ({ planId, userId }: { planId: string; userId: string }): Plan => {
  return { artifacts: [], builds: _.times(3, generateBuild), id: planId, userId };
};
