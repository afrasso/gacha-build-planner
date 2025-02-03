import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactSet, Build, Character, Weapon } from "@/types";

export const toPascalCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s_\-]/g, "")
    .replace(/(?:^|[\s_\-])(\w)/g, (_, c) => c.toUpperCase());
};

export const getLookupValueFromGOODCharacterKey = (goodCharacterKey: string) => {
  return !goodCharacterKey.startsWith("Traveler") ? goodCharacterKey : "Traveler";
};

export const artifactSetLookup = ({ genshinDataContext }: { genshinDataContext: GenshinDataContext }) => {
  const { artifactSets } = genshinDataContext;
  const lookup = artifactSets.reduce((acc, artifactSet) => {
    acc[toPascalCase(artifactSet.name)] = artifactSet;
    return acc;
  }, {} as Record<string, ArtifactSet>);

  const lookupArtifactSet = (goodArtifactSetKey: string): ArtifactSet => {
    const artifactSet = lookup[goodArtifactSetKey];
    if (!artifactSet) {
      console.error(`Unexpected error: the artifact set ${goodArtifactSetKey} could not be found.`);
    }
    return artifactSet;
  };

  return { lookupArtifactSet };
};

export const buildLookup = ({
  builds,
  genshinDataContext,
}: {
  builds: Build[];
  genshinDataContext: GenshinDataContext;
}) => {
  const { getCharacter } = genshinDataContext;

  const lookup = {} as Record<string, Build>;

  const addBuild = (build: Build) => {
    const character = getCharacter(build.characterId);
    const lookupValue = toPascalCase(character.name);
    lookup[lookupValue] = build;
  };

  const lookupBuild = ({
    goodCharacterKey,
    throwErrorOnNotFound = false,
  }: {
    goodCharacterKey: string;
    throwErrorOnNotFound?: boolean;
  }): Build => {
    const lookupValue = !goodCharacterKey.startsWith("Traveler") ? goodCharacterKey : "Traveler";
    const build = lookup[lookupValue];
    if (!build && throwErrorOnNotFound) {
      const message = `Unexpected error: the character name ${lookupValue} could not be found.`;
      console.error(message);
      throw new Error(message);
    }
    return build;
  };

  builds.forEach(addBuild);

  return { addBuild, lookupBuild };
};

export const characterLookup = ({ genshinDataContext }: { genshinDataContext: GenshinDataContext }) => {
  const { characters } = genshinDataContext;
  const lookup = characters.reduce((acc, character) => {
    acc[toPascalCase(character.name)] = character;
    return acc;
  }, {} as Record<string, Character>);

  const lookupCharacter = (goodCharacterKey: string): Character => {
    const lookupValue = !goodCharacterKey.startsWith("Traveler") ? goodCharacterKey : "Traveler";
    const character = lookup[lookupValue];
    if (!character) {
      console.error(`Unexpected error: the character name ${lookupValue} could not be found.`);
    }
    return character;
  };

  return { lookupCharacter };
};

export const weaponLookup = ({ genshinDataContext }: { genshinDataContext: GenshinDataContext }) => {
  const { weapons } = genshinDataContext;
  const lookup = weapons.reduce((acc, weapon) => {
    acc[toPascalCase(weapon.name)] = weapon;
    return acc;
  }, {} as Record<string, Weapon>);

  const lookupWeapon = (goodWeaponKey: string): Weapon => {
    const weapon = lookup[goodWeaponKey];
    if (!weapon) {
      console.error(`Unexpected error: the weapon name ${goodWeaponKey} could not be found.`);
    }
    return weapon;
  };

  return { lookupWeapon };
};
