import { ArtifactSetBonus, ArtifactSetBonusType, BuildArtifacts } from "@/types";

import { ArtifactSetBonusSatisfactionDetails, SatisfactionResult } from "./types";

const calculateArtifactSetBonusSatisfaction = ({
  artifacts,
  setBonus,
}: {
  artifacts: BuildArtifacts;
  setBonus: ArtifactSetBonus;
}): boolean => {
  const matchingArtifacts = Object.values(artifacts).filter((artifact) => artifact.setId === setBonus.setId);
  if (matchingArtifacts.length >= 4) {
    return true;
  }
  return setBonus.bonusType === ArtifactSetBonusType.TWO_PIECE && matchingArtifacts.length >= 2;
};

export const calculateArtifactSetBonusesSatisfaction = ({
  artifacts,
  desiredArtifactSetBonuses,
}: {
  artifacts: BuildArtifacts;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
}): SatisfactionResult<ArtifactSetBonusSatisfactionDetails> => {
  const details = desiredArtifactSetBonuses.map((setBonus) => ({
    desiredBonusType: setBonus.bonusType,
    desiredSetId: setBonus.setId,
    satisfaction: calculateArtifactSetBonusSatisfaction({ artifacts, setBonus }),
  }));

  return {
    details,
    satisfaction: details.every((x) => x.satisfaction),
  };
};
