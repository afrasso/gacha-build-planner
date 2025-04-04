import crypto from "crypto";

import { Artifact, ArtifactData, ArtifactSet, ICharacter, Stat } from "@/types";

import { mapEnumToKey } from "../mapenumtokey";
import { Artifact as GOODArtifact, Slot as GOODSlot, Stat as GOODStat } from "./types";

const calculateArtifactHash = ({
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

const mapGOODSubstat = (goodSubstat: { key: GOODStat; value: number }): Stat => {
  return {
    key: mapEnumToKey(GOODStat, goodSubstat.key),
    value: goodSubstat.value,
  };
};

export const artifactMapper = ({
  artifacts,
  lookupArtifactSet,
  lookupCharacter,
}: {
  artifacts: ArtifactData[];
  lookupArtifactSet: (goodArtifactSetKey: string) => ArtifactSet;
  lookupCharacter: (goodCharacterKey: string) => ICharacter;
}) => {
  const artifactsHash = artifacts.reduce((acc, artifact) => {
    const hash = calculateArtifactHash(artifact);
    acc[hash] = artifact;
    return acc;
  }, {} as Record<string, ArtifactData>);

  const mapGOODArtifactToArtifact = ({ goodArtifact }: { goodArtifact: GOODArtifact }): ArtifactData => {
    const artifactSet = lookupArtifactSet(goodArtifact.setKey);
    const level = goodArtifact.level;
    const mainStatKey = mapEnumToKey(GOODStat, goodArtifact.mainStatKey);
    const rarity = goodArtifact.rarity;
    const setId = artifactSet.id;
    const subStats = goodArtifact.substats.map(mapGOODSubstat);
    const typeKey = mapEnumToKey(GOODSlot, goodArtifact.slotKey);

    const hash = calculateArtifactHash({ level: goodArtifact.level, mainStatKey, rarity, setId, subStats, typeKey });
    const existingArtifact = artifactsHash[hash];
    if (existingArtifact) {
      const newArtifact = structuredClone(existingArtifact);
      newArtifact.characterId =
        goodArtifact.location && goodArtifact.location !== "" ? lookupCharacter(goodArtifact.location).id : undefined;
      newArtifact.isLocked = goodArtifact.lock;
      newArtifact.lastUpdatedDate = new Date().toISOString();
      return newArtifact;
    }

    const characterId =
      goodArtifact.location && goodArtifact.location !== "" ? lookupCharacter(goodArtifact.location).id : undefined;
    const isLocked = goodArtifact.lock;

    return new Artifact({
      characterId,
      isLocked,
      level,
      mainStatKey,
      rarity,
      setId,
      subStats,
      typeKey,
    }).toArtifactData();
  };

  return { mapGOODArtifactToArtifact };
};
