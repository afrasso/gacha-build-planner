import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { Artifact, IArtifact, Stat } from "@/types";

export const generateArtifact = ({
  level,
  mainStatKey,
  rarity,
  setId,
  subStats,
  typeKey,
}: {
  level?: number;
  mainStatKey?: string;
  rarity?: number;
  setId?: string;
  subStats?: Stat[];
  typeKey?: string;
}): IArtifact => {
  return new Artifact({
    level: level || 0,
    mainStatKey: mainStatKey || "ATK_PERCENT",
    rarity: rarity || 5,
    setId: setId || uuidv4(),
    subStats: subStats || [],
    typeKey: typeKey || "CIRCLET",
  });
};
