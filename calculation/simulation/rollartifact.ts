import { getArtifactMaxLevel } from "@/constants";
import { Artifact } from "@/types";

import { rollSubStats } from "./rollsubstats";

export const rollArtifact = ({ artifact }: { artifact: Artifact }): Artifact => {
  const rolledArtifact = {
    ...artifact,
    level: getArtifactMaxLevel({ rarity: artifact.rarity }),
    subStats: rollSubStats({ artifact }),
  };
  return rolledArtifact;
};
