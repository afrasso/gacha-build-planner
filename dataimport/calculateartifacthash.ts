import crypto from "crypto";

import { Stat } from "@/types";

export const calculateArtifactHash = ({
  level,
  mainStatKey,
  rarity,
  setId,
  subStats,
  typeKey,
}: {
  level: number;
  mainStatKey: string;
  rarity: number;
  setId: string;
  subStats: Stat[];
  typeKey: string;
}) => {
  const sortedSubStats = subStats.sort((a, b) => a.key.localeCompare(b.key));
  const hashString = JSON.stringify({ level, mainStatKey, rarity, setId, subStats: sortedSubStats, typeKey });
  const hash = crypto.createHash("sha256").update(hashString).digest("hex");
  return hash;
};
