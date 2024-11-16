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
  Element,
  OverallStat,
  Plan,
  Stat,
  StatValue,
  WeaponType,
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
    iconUrl: uuidv4(),
    level: Math.random(),
    mainStat: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[type]),
    rarity: Math.random(),
    set: generateArtifactSet(),
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
  const character = {
    element: getRandomEnumValue(Element),
    iconUrl: uuidv4(),
    id: uuidv4(),
    name: uuidv4(),
    rarity: Math.random(),
    weaponType: getRandomEnumValue(WeaponType),
  };
  const desiredArtifactMainStats = {
    [ArtifactType.CIRCLET]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.CIRCLET]),
    [ArtifactType.GOBLET]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.GOBLET]),
    [ArtifactType.SANDS]: getRandomElement(MAIN_STATS_BY_ARTIFACT_TYPE[ArtifactType.SANDS]),
  };
  const desiredArtifactSetBonuses: ArtifactSetBonus[] = [
    {
      artifactSet: generateArtifactSet(),
      bonusType: getRandomEnumValue(ArtifactSetBonusType),
    },
  ];
  const desiredStats = Object.values(OverallStat).map((stat) => ({ stat, value: Math.random() }));
  const weapon = {
    iconUrl: uuidv4(),
    id: uuidv4(),
    name: uuidv4(),
    rarity: Math.random(),
    type: getRandomEnumValue(WeaponType),
  };
  return { artifacts, character, desiredArtifactMainStats, desiredArtifactSetBonuses, desiredStats, weapon };
};

export const generatePlan = ({ planId, userId }: { planId: string; userId: string }): Plan => {
  return { builds: _.times(3, generateBuild), id: planId, userId };
};
