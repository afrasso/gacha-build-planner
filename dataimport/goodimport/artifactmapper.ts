import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { Artifact, ArtifactMetric, ArtifactSet, ArtifactType, Character, Stat, StatValue } from "@/types";

import { mapEnumsByKey } from "./mapenumsbykey";
import { Artifact as GOODArtifact, Slot as GOODSlot, Stat as GOODStat } from "./types";

const calculateArtifactHash = ({
  level,
  mainStat,
  rarity,
  setId,
  subStats,
  type,
}: {
  level: number;
  mainStat: Stat;
  rarity: number;
  setId: string;
  subStats: StatValue<Stat>[];
  type: ArtifactType;
}) => {
  const sortedSubStats = subStats.sort((a, b) => a.stat.localeCompare(b.stat));
  const hashString = JSON.stringify({ level, mainStat, rarity, setId, subStats: sortedSubStats, type });
  const hash = crypto.createHash("sha256").update(hashString).digest("hex");
  return hash;
};

const mapGOODSubstat = (goodSubstat: { key: GOODStat; value: number }): StatValue<Stat> => {
  return {
    stat: mapEnumsByKey(GOODStat, Stat, goodSubstat.key),
    value: goodSubstat.value,
  };
};

export const artifactMapper = ({
  artifacts,
  lookupArtifactSet,
  lookupCharacter,
}: {
  artifacts: Artifact[];
  lookupArtifactSet: (goodArtifactSetKey: string) => ArtifactSet;
  lookupCharacter: (goodCharacterKey: string) => Character;
}) => {
  const artifactsHash = artifacts.reduce((acc, artifact) => {
    const hash = calculateArtifactHash(artifact);
    acc[hash] = artifact;
    return acc;
  }, {} as Record<string, Artifact>);

  const mapGOODArtifactToArtifact = ({ goodArtifact }: { goodArtifact: GOODArtifact }): Artifact => {
    const artifactSet = lookupArtifactSet(goodArtifact.setKey);
    const level = goodArtifact.level;
    const mainStat = mapEnumsByKey(GOODStat, Stat, goodArtifact.mainStatKey);
    const rarity = goodArtifact.rarity;
    const setId = artifactSet.id;
    const subStats = goodArtifact.substats.map(mapGOODSubstat);
    const type = mapEnumsByKey(GOODSlot, ArtifactType, goodArtifact.slotKey);

    const hash = calculateArtifactHash({ level: goodArtifact.level, mainStat, rarity, setId, subStats, type });
    const existingArtifact = artifactsHash[hash];
    if (existingArtifact) {
      const newArtifact = structuredClone(existingArtifact);
      newArtifact.characterId =
        goodArtifact.location && goodArtifact.location !== "" ? lookupCharacter(goodArtifact.location).id : undefined;
      newArtifact.isLocked = goodArtifact.lock;
      newArtifact.lastUpdatedDate = new Date().toISOString();
      return newArtifact;
    }

    return {
      characterId:
        goodArtifact.location && goodArtifact.location !== "" ? lookupCharacter(goodArtifact.location).id : undefined,
      id: uuidv4(),
      isLocked: goodArtifact.lock,
      lastUpdatedDate: new Date().toISOString(),
      level,
      mainStat,
      metricsResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
        [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
        [ArtifactMetric.RATING]: { buildResults: {} },
      },
      rarity,
      setId,
      subStats,
      type,
    };
  };

  return { mapGOODArtifactToArtifact };
};
