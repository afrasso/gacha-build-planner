import { v4 as uuidv4 } from "uuid";

import {
  INITIAL_SUBSTAT_COUNT_ODDS_BY_RARITY,
  MAIN_STAT_ODDS_BY_ARTIFACT_TYPE,
  SUB_STAT_ROLL_VALUES_BY_RARITY,
  SUB_STAT_WEIGHTS,
  SUB_STATS,
} from "@/constants";
import { Artifact, ArtifactType, Stat, StatValue } from "@/types";

const getRandomValue = <T>(arr: Array<T>) => {
  if (!arr) {
    throw new Error("Unexpected error: arr cannot be null or undefined.");
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomMainStat = ({ type }: { type: ArtifactType }): Stat => {
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

const getInitialSubStatCount = ({ rarity }: { rarity: number }): number => {
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

const getRandomNewSubstat = ({ mainStat, subStats }: { mainStat: Stat; subStats: Stat[] }): Stat => {
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

const getRandomInitialSubStats = ({ mainStat, rarity }: { mainStat: Stat; rarity: number }) => {
  const subStatCount = getInitialSubStatCount({ rarity });
  const subStats: StatValue<Stat>[] = [];
  for (let i = 0; i < subStatCount; i++) {
    const subStat = getRandomNewSubstat({ mainStat, subStats: subStats.map((s) => s.stat) });
    subStats.push(rollSubStat(subStat));
  }
  return subStats;
};

const rollSubStat = (stat: Stat): StatValue<Stat> => {
  const arr = SUB_STAT_ROLL_VALUES_BY_RARITY[5][stat];
  if (!arr) {
    console.log("null array! stat=" + stat);
  }
  const value = getRandomValue(SUB_STAT_ROLL_VALUES_BY_RARITY[5][stat]!);

  return { stat, value };
};

const rollSubstats = (artifact: Artifact): StatValue<Stat>[] => {
  // Create a copy of the artifact's substats.
  const subStats = artifact.subStats.map((subStat) => ({ stat: subStat.stat, value: subStat.value }));
  // TODO: Replace with constants.
  const numRolls = Math.ceil((20 - artifact.level) / 4);

  for (let i = 0; i < numRolls; i++) {
    if (subStats.length < 4) {
      const stat = getRandomNewSubstat({ mainStat: artifact.mainStat, subStats: subStats.map((s) => s.stat) });
      const rolledSubStat = rollSubStat(stat);
      subStats.push(rolledSubStat);
    } else {
      const subStat = getRandomValue(subStats);
      const rolledSubStat = rollSubStat(subStat.stat);
      subStat.value += rolledSubStat.value;
    }
  }

  return subStats;
};

export const rollNewArtifact = ({
  rarity,
  setId,
  type,
}: {
  rarity: number;
  setId: string;
  type: ArtifactType;
}): Artifact => {
  const mainStat = getRandomMainStat({ type });
  const subStats = getRandomInitialSubStats({ mainStat, rarity });
  return rollArtifact({
    id: uuidv4(),
    level: 0,
    mainStat,
    rarity,
    setId,
    subStats,
    type,
  });
};

export const rollArtifact = (artifact: Artifact): Artifact => {
  if (artifact.rarity !== 5) {
    throw new Error("Unexpected rarity!");
    return artifact;
  }

  const rolledArtifact = { ...artifact, level: 20, subStats: rollSubstats(artifact) };

  return rolledArtifact;
};
