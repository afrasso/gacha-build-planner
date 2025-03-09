import { IDataContext } from "@/contexts/DataContext";
import { Artifact, IArtifact } from "@/types";

import { getRandomInitialSubStats } from "./getrandominitialsubstats";
import { getRandomMainStat } from "./getrandommainstat";

export const rollNewArtifact = ({
  dataContext,
  level,
  mainStatKeys,
  rarity,
  setId,
  typeKey,
}: {
  dataContext: IDataContext;
  level: number;
  mainStatKeys?: string[];
  rarity: number;
  setId: string;
  typeKey: string;
}): IArtifact => {
  const mainStatKey = getRandomMainStat({ artifactTypeKey: typeKey, dataContext, mainStatKeys });
  const subStats = getRandomInitialSubStats({ dataContext, mainStatKey, rarity });
  return new Artifact({ level, mainStatKey, rarity, setId, subStats, typeKey });
};
