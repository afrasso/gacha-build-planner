import { IDataContext } from "@/contexts/DataContext";
import { ArtifactSetBonus, IArtifact } from "@/types";

import calculateOddsOfOnSetPieces from "./calculateoddsofonsetpieces";
import getArtifactTypeCombinations from "./getartifacttypecombinations";

const getWeightedArtifactSetBonusFactor = ({
  artifact,
  dataContext,
  desiredArtifactMainStats,
  desiredArtifactSetBonuses,
}: {
  artifact: IArtifact;
  dataContext: IDataContext;
  desiredArtifactMainStats: Record<string, string[]>;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
}): number => {
  const { getArtifactTypes } = dataContext;

  // If there are no desired set bonuses, the odds of getting an artifact with a set we're happy with is 1.
  if (!desiredArtifactSetBonuses || desiredArtifactSetBonuses.length === 0) {
    return 1;
  }

  // If the artifact matches one of the sets that's required, we don't then the factor is 1.
  if (desiredArtifactSetBonuses.map((bonus) => bonus.setId).includes(artifact.setId)) {
    return 1;
  }

  // First, determine how many pieces are needed to be on set.
  const onSetArtifactCount = desiredArtifactSetBonuses.reduce((result, bonus) => {
    result += bonus.bonusCount;
    return result;
  }, 0);

  // Get all of combinations of artifacts that must be on set to meet the artifact set bonus criteria.
  const combinations = getArtifactTypeCombinations({
    artifactTypeKeys: getArtifactTypes().map((type) => type.key),
    count: onSetArtifactCount,
  });

  // Calculate the odds that each particular combination is what would meet the artifact set bonus criteria, and add it
  // to the total weighted odds, and the weighted odds only if the specified artifact is one that needs to meet the set
  // bonus.
  let totalWeight = 0;
  let artifactWeight = 0;
  for (const combination of combinations) {
    const weight = calculateOddsOfOnSetPieces({ artifactTypeKeys: combination, dataContext, desiredArtifactMainStats });
    totalWeight += weight;
    if (!combination.includes(artifact.typeKey)) {
      artifactWeight += weight;
    }
  }

  return artifactWeight / totalWeight;
};

export default getWeightedArtifactSetBonusFactor;
