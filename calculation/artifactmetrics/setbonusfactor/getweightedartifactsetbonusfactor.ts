import { Artifact, ArtifactSetBonus, ArtifactSetBonusType, ArtifactType, DesiredArtifactMainStats } from "@/types";

import calculateOddsOfOnSetPieces from "./calculateoddsofonsetpieces";
import getArtifactTypeCombinations from "./getartifacttypecombinations";

const getWeightedArtifactSetBonusFactor = ({
  artifact,
  desiredArtifactMainStats,
  desiredArtifactSetBonuses,
}: {
  artifact: Artifact;
  desiredArtifactMainStats: DesiredArtifactMainStats;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
}): number => {
  // If the artifact matches one of the sets that's required, we also don't need to reduce the factor.
  if (desiredArtifactSetBonuses.map((bonus) => bonus.setId).includes(artifact.setId)) {
    return 1;
  }

  if (desiredArtifactSetBonuses.length === 0) {
    return 1;
  }

  // First, determine how many pieces are needed to be on set.
  const onSetArtifactCount = desiredArtifactSetBonuses.reduce((result, bonus) => {
    result += bonus.bonusType === ArtifactSetBonusType.FOUR_PIECE ? 4 : 2;
    return result;
  }, 0);

  const artifactTypes = Object.values(ArtifactType);

  // Get all of combinations of artifacts that must be on set to meet the artifact set bonus criteria.
  const combinations = getArtifactTypeCombinations({ artifactTypes, count: onSetArtifactCount });

  // Calculate the odds that each particular combination is what would meet the artifact set bonus criteria, and add it
  // to the total weighted odds, and the weighted odds only if the specified artifact is one that needs to meet the set
  // bonus.
  let totalWeight = 0;
  let artifactWeight = 0;
  for (const combination of combinations) {
    const weight = calculateOddsOfOnSetPieces({ artifactTypes: combination, desiredArtifactMainStats });
    totalWeight += weight;
    if (!combination.includes(artifact.type)) {
      artifactWeight += weight;
    }
  }

  return artifactWeight / totalWeight;
};

export default getWeightedArtifactSetBonusFactor;
