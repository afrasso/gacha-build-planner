import { ArtifactTier, ArtifactType, OverallStat, Stat } from "@/types";

import {
  ARTIFACT_LEVELS_PER_SUBSTAT_ROLL,
  ARTIFACT_MAX_LEVEL_BY_RARITY,
  ARTIFACT_TIER_BY_NUMERIC_RATING,
  INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY,
  MAIN_STAT_MAX_VALUES_BY_RARITY,
  MAIN_STAT_ODDS_BY_ARTIFACT_TYPE,
  MAX_SUBSTATS,
  OVERALL_STATS_ORDER,
  SUB_STAT_ROLL_VALUES_BY_RARITY,
  SUB_STAT_WEIGHTS,
} from "./constants";

export const getArtifactLevelsPerSubStatRoll = (): number => {
  return ARTIFACT_LEVELS_PER_SUBSTAT_ROLL;
};

export const getArtifactMaxLevel = ({ rarity }: { rarity: number }): number => {
  const maxLevel = ARTIFACT_MAX_LEVEL_BY_RARITY[rarity];
  if (!maxLevel) {
    throw new Error(`Unexpected rarity ${rarity} specified when retrieving max level.`);
  }
  return maxLevel;
};

export const getArtifactTier = ({ rating }: { rating: number }): ArtifactTier => {
  const adjustedRating = Math.floor(Math.max(Math.min(0, rating), 8));
  const artifactTier = ARTIFACT_TIER_BY_NUMERIC_RATING[adjustedRating];
  return artifactTier;
};

export const getInitialSubstatCountOdds = ({ rarity }: { rarity: number }): Record<number, number> => {
  const odds = INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY[rarity];
  if (!odds) {
    throw new Error(`Unexpected rarity ${rarity} specified when retrieving initial substat count odds.`);
  }
  return odds;
};

export const getMainStatMaxValue = ({ mainStat, rarity }: { mainStat: Stat; rarity: number }): number => {
  const maxValue = MAIN_STAT_MAX_VALUES_BY_RARITY[rarity][mainStat];
  if (!maxValue) {
    throw new Error(
      `Unexpected specified combination of main stat ${mainStat} and rarity ${rarity} when retrieving the main stat max value.`
    );
  }
  return maxValue;
};

export const getMainStatOdds = ({ artifactType, mainStat }: { artifactType: ArtifactType; mainStat: Stat }): number => {
  const odds = MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[artifactType][mainStat];
  if (!odds) {
    throw new Error(
      `Unexpected specified combination of artifactType ${artifactType} and main stat ${mainStat} when retrieving odds of main stat.`
    );
  }
  return odds;
};

export const getMainStats = ({ artifactType }: { artifactType: ArtifactType }): Stat[] => {
  const odds = MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[artifactType];
  return Object.entries(odds).map(([stat]) => stat as Stat);
};

export const getMaxSubStats = (): number => {
  return MAX_SUBSTATS;
};

export const getOrderedOverallStats = (): OverallStat[] => {
  return OVERALL_STATS_ORDER;
};

export const getSubStats = (): Stat[] => {
  return Object.entries(SUB_STAT_WEIGHTS).map(([stat]) => stat as Stat);
};

export const getSubStatRollValues = ({ rarity, subStat }: { rarity: number; subStat: Stat }): number[] => {
  const rollValues = SUB_STAT_ROLL_VALUES_BY_RARITY[rarity][subStat];
  if (!rollValues) {
    throw new Error(
      `Unexpected specified combination of rarity ${rarity} and sub stat ${subStat} when retrieving the main stat max value.`
    );
  }
  return rollValues;
};

export const getSubStatWeight = ({ subStat }: { subStat: Stat }): number => {
  const weight = SUB_STAT_WEIGHTS[subStat];
  if (!weight) {
    throw new Error(`Unexpected sub stat ${subStat} specified when retrieving sub stat weights.`);
  }
  return weight;
};
