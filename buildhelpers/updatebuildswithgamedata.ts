import { v4 as uuidv4 } from "uuid";

import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  Artifact as GOODArtifact,
  Character as GOODCharacter,
  Slot as GOODSlot,
  Stat as GOODStat,
  Weapon as GOODWeapon,
} from "@/goodtypes";
import { Artifact, ArtifactType, Build, Stat, StatValue, Weapon } from "@/types";

export const updateBuildsWithGameData = ({
  builds,
  genshinDataContext,
  goodArtifacts,
  goodCharacters,
  goodWeapons,
}: {
  builds: Build[];
  genshinDataContext: GenshinDataContext;
  goodArtifacts: GOODArtifact[];
  goodCharacters: GOODCharacter[];
  goodWeapons: GOODWeapon[];
}): { artifacts: Artifact[]; builds: Build[] } => {
  const { artifactSets, characters, getCharacter, weapons } = genshinDataContext;

  const getNewBuild = (goodCharacterName: string): Build => {
    const character = characters.find((character) => toPascalCase(character.name) === goodCharacterName);
    if (!character) {
      throw new Error(`Could not find the character ${goodCharacterName}`);
    }
    return {
      artifacts: {},
      characterId: character.id,
      desiredArtifactMainStats: {},
      desiredArtifactSetBonuses: [],
      desiredStats: [],
      weaponId: undefined,
    };
  };

  const updateBuildWithGameData = (build: Build): Build => {
    const character = getCharacter(build.characterId);
    const goodCharacterName = toPascalCase(character.name);
    const goodCharacter = goodCharacters.find((goodCharacter) => goodCharacter.key === goodCharacterName);
    if (goodCharacter) {
      updateBuildWithGOODArtifacts({
        build,
        goodArtifacts: goodArtifacts.filter((goodArtifact) => goodArtifact.location === goodCharacterName),
      });
      updateBuildWithGOODCharacter({
        build,
        goodCharacter: goodCharacters.find((goodCharacter) => goodCharacter.key === goodCharacterName),
      });
      updateBuildWithGOODWeapon({
        build,
        goodWeapon: goodWeapons.find((goodWeapon) => goodWeapon.location === goodCharacterName),
      });
    }
    return build;
  };

  const updateBuildWithGOODArtifacts = ({
    build,
    goodArtifacts,
  }: {
    build: Build;
    goodArtifacts: GOODArtifact[];
  }): Build => {
    goodArtifacts.map(mapGOODArtifactToArtifact).forEach((artifact) => (build.artifacts[artifact.type] = artifact));
    return build;
  };

  const updateBuildWithGOODCharacter = ({
    build,
    goodCharacter,
  }: {
    build: Build;
    goodCharacter?: GOODCharacter;
  }): Build => {
    if (!goodCharacter) {
      return build;
    }

    return build;
  };

  const updateBuildWithGOODWeapon = ({ build, goodWeapon }: { build: Build; goodWeapon?: GOODWeapon }): Build => {
    if (!goodWeapon) {
      return build;
    }

    build.weaponId = mapGOODWeapon(goodWeapon).id;
    return build;
  };

  const mapGOODArtifactToArtifact = (goodArtifact: GOODArtifact): Artifact => {
    const artifactSet = artifactSets.find((set) => toPascalCase(set.name) === goodArtifact.setKey);
    if (!artifactSet) {
      throw new Error(`Could not find the artifact set ${goodArtifact.setKey}`);
    }
    return {
      id: uuidv4(),
      level: goodArtifact.level,
      mainStat: mapEnumsByKey(GOODStat, Stat, goodArtifact.mainStatKey),
      rarity: goodArtifact.rarity,
      setId: artifactSet.id,
      subStats: goodArtifact.substats.map(mapGOODSubstat),
      type: mapEnumsByKey(GOODSlot, ArtifactType, goodArtifact.slotKey),
    };
  };

  const mapGOODSubstat = (goodSubstat: { key: GOODStat; value: number }): StatValue<Stat> => {
    return {
      stat: mapEnumsByKey(GOODStat, Stat, goodSubstat.key),
      value: goodSubstat.value,
    };
  };

  const mapGOODWeapon = (goodWeapon: GOODWeapon): Weapon => {
    const weapon = weapons.find((weapon) => toPascalCase(weapon.name) === goodWeapon.key);
    if (!weapon) {
      throw new Error(`Could not find the weapon ${goodWeapon.key}`);
    }
    return weapon;
  };

  const mapEnumsByKey = <S extends Record<string, number | string>, T extends Record<string, number | string>>(
    sourceEnum: S,
    targetEnum: T,
    sourceValue: S[keyof S]
  ): T[keyof T] => {
    const key = Object.keys(sourceEnum).find((k) => sourceEnum[k as keyof S] === sourceValue);
    if (!key) {
      throw new Error(`No matching key found for value: ${sourceValue}`);
    }
    return targetEnum[key as keyof T];
  };

  const toPascalCase = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s_\-]/g, "")
      .replace(/(?:^|[\s_\-])(\w)/g, (_, c) => c.toUpperCase());
  };

  const updatedBuilds = goodCharacters ? builds : builds.map(updateBuildWithGameData);

  if (goodCharacters) {
    goodCharacters.forEach((goodCharacter) => {
      if (
        !builds.find((build) => getCharacter(build.characterId).name.replace(/\s+/g, "") === goodCharacter.key) &&
        !goodCharacter.key.startsWith("Traveler")
      ) {
        const build = getNewBuild(goodCharacter.key);
        updateBuildWithGameData(build);
        updatedBuilds.push(build);
      }
    });
  }

  const artifacts = goodArtifacts.filter((goodArtifact) => goodArtifact.location === "").map(mapGOODArtifactToArtifact);

  return { artifacts, builds: updatedBuilds };
};
