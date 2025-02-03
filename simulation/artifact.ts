import { v4 as uuidv4 } from "uuid";

import {
  ARTIFACT_MAX_LEVEL_BY_RARITY,
  INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY,
  MAIN_STAT_ODDS_BY_ARTIFACT_TYPE,
  SUB_STAT_ROLL_VALUES_BY_RARITY,
  SUB_STAT_WEIGHTS,
  SUB_STATS,
} from "@/constants";
import { Artifact, ArtifactMetric, ArtifactType, Stat, StatValue } from "@/types";

const getRandomValue = <T>(arr: Array<T>) => {
  if (!arr) {
    throw new Error("Unexpected error: arr cannot be null or undefined.");
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getInitialSubStatCount = ({ rarity }: { rarity: number }): number => {
  const random = Math.random();
  let current = 0;
  for (const [count, value] of Object.entries(INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY[rarity])) {
    if (random < current + value) {
      return Number(count);
    }
    current += value;
  }
  throw new Error(
    `Unexpected error: the odds for the number of sub stats the artifact rarity ${rarity} are greater than one: ${current}.`
  );
};

export const getRandomInitialSubStats = ({ mainStat, rarity }: { mainStat: Stat; rarity: number }) => {
  const subStatCount = getInitialSubStatCount({ rarity });
  const subStats: StatValue<Stat>[] = [];
  for (let i = 0; i < subStatCount; i++) {
    const subStat = getRandomNewSubStat({ mainStat, subStats: subStats.map((s) => s.stat) });
    subStats.push(rollSubStat({ rarity, stat: subStat }));
  }
  return subStats;
};

export const getRandomMainStat = ({ type }: { type: ArtifactType }): Stat => {
  const random = Math.random();
  let current = 0;
  for (const [key, value] of Object.entries(MAIN_STAT_ODDS_BY_ARTIFACT_TYPE[type])) {
    if (random < current + value) {
      return key as Stat;
    }
    current += value;
  }
  throw new Error(
    `Unexpected error: the odds for the main stat for the artifact type ${type} are greater than one: ${current}.`
  );
};

export const getRandomNewSubStat = ({ mainStat, subStats }: { mainStat: Stat; subStats: Stat[] }): Stat => {
  const currentStats = new Set([mainStat, ...subStats]);
  const remainingStats = SUB_STATS.filter((subStat) => !currentStats.has(subStat));
  const remainingSubStatWeights: [Stat, number][] = remainingStats.map((stat) => {
    const weight = SUB_STAT_WEIGHTS[stat]!;
    return [stat, weight];
  });
  const total = remainingSubStatWeights.reduce((sum, [, weight]) => sum + weight, 0);
  const random = Math.random() * total;
  let current = 0;
  for (const [key, value] of remainingSubStatWeights) {
    if (random < current + value) {
      return key as Stat;
    }
    current += value;
  }
  throw new Error("Unexpected error: value greater than total substat weights.");
};

export const rollArtifact = ({ artifact }: { artifact: Artifact }): Artifact => {
  const rolledArtifact = {
    ...artifact,
    level: ARTIFACT_MAX_LEVEL_BY_RARITY[artifact.rarity],
    subStats: rollSubStats({ artifact }),
  };
  return rolledArtifact;
};

export const rollNewArtifact = ({
  level,
  mainStat,
  rarity,
  setId,
  type,
}: {
  level: number;
  mainStat?: Stat;
  rarity: number;
  setId: string;
  type: ArtifactType;
}): Artifact => {
  const actualMainStat = mainStat || getRandomMainStat({ type });
  const subStats = getRandomInitialSubStats({ mainStat: actualMainStat, rarity });
  return {
    id: uuidv4(),
    isLocked: false,
    lastUpdatedDate: new Date().toISOString(),
    level,
    mainStat: actualMainStat,
    metricsResults: {
      [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
      [ArtifactMetric.RATING]: { buildResults: {} },
    },
    rarity,
    setId,
    subStats,
    type,
  };
};

const rollSubStat = ({ rarity, stat }: { rarity: number; stat: Stat }): StatValue<Stat> => {
  if (!SUB_STAT_ROLL_VALUES_BY_RARITY[rarity]) {
    throw new Error(`Unexpected error: could not find sub-stat roll values for rarity ${rarity}.`);
  }
  if (!SUB_STAT_ROLL_VALUES_BY_RARITY[rarity][stat]) {
    throw new Error(`Unexpected error: could not find sub-stat roll values for rarity ${rarity} and stat ${stat}.`);
  }
  const value = getRandomValue(SUB_STAT_ROLL_VALUES_BY_RARITY[rarity][stat]);

  return { stat, value };
};

export const rollSubStats = ({ artifact }: { artifact: Artifact }): StatValue<Stat>[] => {
  // Create a copy of the artifact's substats.
  const subStats = artifact.subStats.map((subStat) => ({ stat: subStat.stat, value: subStat.value }));
  // TODO: Replace with constants.
  const numRolls = Math.ceil((ARTIFACT_MAX_LEVEL_BY_RARITY[artifact.rarity] - artifact.level) / 4);

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < 4) {
      const stat = getRandomNewSubStat({ mainStat: artifact.mainStat, subStats: subStats.map((s) => s.stat) });
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, stat });
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat({ rarity: artifact.rarity, stat: subStat.stat });
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};
