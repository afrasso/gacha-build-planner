import { getSubStatRollValues } from "@/constants";
import { Artifact, Build, DesiredOverallStat, OverallStatKey, StatKey } from "@/types";

import { rollArtifact } from "../simulation";
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

  const calculateSubstatRollValue = ({
    overallStatKey,
    statKey,
  }: {
    overallStatKey: OverallStatKey;
    statKey: StatKey;
  }) => {
    if (desiredOverallStat.stat.key !== overallStatKey) {
      return;
    }
    const subStatValue = artifact.subStats.find((subStat) => subStat.key === statKey);
    if (!subStatValue) {
      return;
    }
    const maxRoll = Math.max(...getSubStatRollValues({ rarity: artifact.rarity, statKey: subStatValue.key }));
    rating += (PRIORITY_WEIGHTS[desiredOverallStat.priority] * subStatValue.value) / maxRoll;
  };

  // For now, let's ignore flat stats, since while they do have some value, they certainly don't have full value, and
  // worse, the value of a flat substat relative to a percent substat is going to depend on the build.
  // calculateSubstatRollValue({ overallStat: OverallStat.ATK, stat: Stat.ATK_FLAT });
  // calculateSubstatRollValue({ overallStat: OverallStat.DEF, stat: Stat.DEF_FLAT });
  // calculateSubstatRollValue({ overallStat: OverallStat.HP, stat: Stat.HP_FLAT });

  calculateSubstatRollValue({ overallStatKey: OverallStatKey.ATK, statKey: StatKey.ATK_PERCENT });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.CRIT_DMG, statKey: StatKey.CRIT_DMG });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.CRIT_RATE, statKey: StatKey.CRIT_RATE });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.DEF, statKey: StatKey.DEF_PERCENT });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.ELEMENTAL_MASTERY, statKey: StatKey.ELEMENTAL_MASTERY });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.ENERGY_RECHARGE, statKey: StatKey.ENERGY_RECHARGE });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.HEALING_BONUS, statKey: StatKey.HEALING_BONUS });
  calculateSubstatRollValue({ overallStatKey: OverallStatKey.MAX_HP, statKey: StatKey.HP_PERCENT });

  return rating;
};

const calculateRating = ({ artifact, build }: { artifact: Artifact; build: Build }): number => {
  // If the build requires a specific main stat, and the current artifact doesn't have it, the artifact has no value.
  if (
    build.desiredArtifactMainStats[artifact.type] &&
    !build.desiredArtifactMainStats[artifact.type]?.includes(artifact.mainStat)
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
