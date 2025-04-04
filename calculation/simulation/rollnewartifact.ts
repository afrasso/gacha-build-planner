import { IDataContext } from "@/contexts/DataContext";
import { Artifact, IArtifact } from "@/types";

import { getRandomInitialSubStats } from "./getrandominitialsubstats";
import { getRandomMainStat } from "./getrandommainstat";

export const rollNewArtifact = ({
  dataContext,
  mainStatKeys,
  rarity,
  setId,
  typeKey,
}: {
  dataContext: IDataContext;
  mainStatKeys?: string[];
  rarity: number;
  setId: string;
  typeKey: string;
}): IArtifact => {
  const mainStatKey = getRandomMainStat({ artifactTypeKey: typeKey, dataContext, mainStatKeys });
  const subStats = getRandomInitialSubStats({ dataContext, mainStatKey, rarity });
  const artifact = new Artifact({ level: 0, mainStatKey, rarity, setId, subStats, typeKey });
  return artifact;
};
