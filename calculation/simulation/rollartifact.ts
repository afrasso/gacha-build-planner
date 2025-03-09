import { IDataContext } from "@/contexts/DataContext";
import { Artifact, IArtifact } from "@/types";

import { rollSubStats } from "./rollsubstats";

export const rollArtifact = ({
  artifact,
  dataContext,
}: {
  artifact: IArtifact;
  dataContext: IDataContext;
}): IArtifact => {
  const { getArtifactMaxLevel } = dataContext;

  const rolledArtifact = new Artifact({
    ...artifact.toArtifactData(),
    level: getArtifactMaxLevel({ rarity: artifact.rarity }),
    subStats: rollSubStats({ artifact, dataContext }),
  });

  return rolledArtifact;
};
