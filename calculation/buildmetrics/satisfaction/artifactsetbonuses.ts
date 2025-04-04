import { ArtifactSetBonus, IArtifact } from "@/types";

import { ArtifactSetBonusSatisfactionDetails, SatisfactionResult } from "./types";

const calculateArtifactSetBonusSatisfaction = ({
  artifacts,
  setBonus,
}: {
  artifacts: Record<string, IArtifact>;
  setBonus: ArtifactSetBonus;
}): boolean => {
  const matchingArtifacts = Object.values(artifacts).filter((artifact) => artifact.setId === setBonus.setId);
  return setBonus.bonusCount <= matchingArtifacts.length;
};

export const calculateArtifactSetBonusesSatisfaction = ({
  artifacts,
  desiredArtifactSetBonuses,
}: {
  artifacts: Record<string, IArtifact>;
  desiredArtifactSetBonuses: ArtifactSetBonus[];
}): SatisfactionResult<ArtifactSetBonusSatisfactionDetails> => {
  const details = desiredArtifactSetBonuses.map((desiredSetBonus) => ({
    desiredSetBonus,
    satisfaction: calculateArtifactSetBonusSatisfaction({ artifacts, setBonus: desiredSetBonus }),
  }));

  return {
    details,
    satisfaction: details.every((x) => x.satisfaction),
  };
};
