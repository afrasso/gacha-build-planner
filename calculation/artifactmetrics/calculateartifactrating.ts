import { SUB_STAT_ROLL_VALUES_BY_RARITY } from "@/constants";
import { rollArtifact } from "@/simulation/artifact";
import { Artifact, Build, DesiredOverallStat, OverallStat, Stat } from "@/types";

import { getWeightedArtifactSetBonusFactor } from "./setbonusfactor";

const PRIORITY_WEIGHTS: Record<number, number> = {
  1: 0.25,
  2: 0.5,
  3: 1,
};

const calculateSubstatRating = ({
  artifact,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  desiredOverallStat,
}: {
  artifact: Artifact;
  desiredOverallStat: DesiredOverallStat;
}): number => {
  let rating = 0;

  const calculateSubstatRollValue = ({ overallStat, stat }: { overallStat: OverallStat; stat: Stat }) => {
    if (desiredOverallStat.stat !== overallStat) {
      return;
    }
    const subStat = artifact.subStats.find((subStat) => subStat.stat === stat);
    if (!subStat) {
      return;
    }
    const maxRoll = Math.max(...SUB_STAT_ROLL_VALUES_BY_RARITY[5][subStat.stat]!);
    rating += (PRIORITY_WEIGHTS[desiredOverallStat.priority] * subStat.value) / maxRoll;
  };

  // For now, let's ignore flat stats, since while they do have some value, they certainly don't have full value, and
  // worse, the value of a flat substat relative to a percent substat is going to depend on the build.
  // calculateSubstatRollValue({ overallStat: OverallStat.ATK, stat: Stat.ATK_FLAT });
  // calculateSubstatRollValue({ overallStat: OverallStat.DEF, stat: Stat.DEF_FLAT });
  // calculateSubstatRollValue({ overallStat: OverallStat.HP, stat: Stat.HP_FLAT });

  calculateSubstatRollValue({ overallStat: OverallStat.ATK, stat: Stat.ATK_PERCENT });
  calculateSubstatRollValue({ overallStat: OverallStat.CRIT_DMG, stat: Stat.CRIT_DMG });
  calculateSubstatRollValue({ overallStat: OverallStat.CRIT_RATE, stat: Stat.CRIT_RATE });
  calculateSubstatRollValue({ overallStat: OverallStat.DEF, stat: Stat.DEF_PERCENT });
  calculateSubstatRollValue({ overallStat: OverallStat.ELEMENTAL_MASTERY, stat: Stat.ELEMENTAL_MASTERY });
  calculateSubstatRollValue({ overallStat: OverallStat.ENERGY_RECHARGE, stat: Stat.ENERGY_RECHARGE });
  calculateSubstatRollValue({ overallStat: OverallStat.HEALING_BONUS, stat: Stat.HEALING_BONUS });
  calculateSubstatRollValue({ overallStat: OverallStat.MAX_HP, stat: Stat.HP_PERCENT });

  return rating;
};

const calculateRating = ({ artifact, build }: { artifact: Artifact; build: Build }): number => {
  // If the build requires a specific main stat, and the current artifact doesn't have it, the artifact has no value.
  if (
    build.desiredArtifactMainStats[artifact.type] &&
    build.desiredArtifactMainStats[artifact.type] !== artifact.mainStat
  ) {
    return 0;
  }

  const rolledArtifact = rollArtifact({ artifact });

  // TODO: The max rating is actually based on the build criteria. At some point we can make the rating relative to max
  // possible rating given the build's desired stats.
  const initialRating = 1;
  return build.desiredOverallStats.reduce((total, desiredOverallStat) => {
    total += calculateSubstatRating({ artifact: rolledArtifact, desiredOverallStat });
    return total;
  }, initialRating);
};

export interface ArtifactRatingMetricsResults {
  plusMinus: number;
  positivePlusMinusOdds: number;
  rating: number;
}

export const calculateArtifactRatingMetrics = ({
  artifact,
  build,
  iterations,
}: {
  artifact: Artifact;
  build: Build;
  iterations: number;
}): ArtifactRatingMetricsResults => {
  const weightedFactor = getWeightedArtifactSetBonusFactor({
    artifact,
    desiredArtifactMainStats: build.desiredArtifactMainStats,
    desiredArtifactSetBonuses: build.desiredArtifactSetBonuses,
  });

  let totalRating = 0;
  let totalPlusMinus = 0;
  let positivePlusMinusCount = 0;
  for (let i = 0; i < iterations; i++) {
    const artifactRating = calculateRating({ artifact, build });
    const buildArtifact = build.artifacts[artifact.type];
    const buildArtifactRating = buildArtifact ? calculateRating({ artifact: buildArtifact, build }) : 0;
    totalRating += artifactRating;
    totalPlusMinus += artifactRating - buildArtifactRating;
    positivePlusMinusCount += artifactRating > buildArtifactRating ? 1 : 0;
  }

  return {
    plusMinus: (weightedFactor * totalPlusMinus) / iterations,
    positivePlusMinusOdds: (weightedFactor * positivePlusMinusCount) / iterations,
    rating: (weightedFactor * totalRating) / iterations,
  };
};
