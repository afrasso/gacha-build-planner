import { IDataContext } from "@/contexts/DataContext";
import { ArtifactSet, BuildData, ICharacter, IWeapon } from "@/types";

export const toPascalCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s_\-]/g, "")
    .replace(/(?:^|[\s_\-])(\w)/g, (_, c) => c.toUpperCase());
};

export const getLookupValueFromGOODCharacterKey = (goodCharacterKey: string) => {
  return !goodCharacterKey.startsWith("Traveler") ? goodCharacterKey : "Traveler";
};

export const artifactSetLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getArtifactSets } = dataContext;
  const lookup = getArtifactSets().reduce((acc, artifactSet) => {
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

export const buildLookup = ({ builds, dataContext }: { builds: BuildData[]; dataContext: IDataContext }) => {
  const { getCharacter } = dataContext;

  const lookup = {} as Record<string, BuildData>;

  const addBuild = (build: BuildData) => {
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
  }): BuildData => {
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

export const characterLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getCharacters } = dataContext;
  const lookup = getCharacters().reduce((acc, character) => {
    acc[toPascalCase(character.name)] = character;
    return acc;
  }, {} as Record<string, ICharacter>);

  const lookupCharacter = (goodCharacterKey: string): ICharacter => {
    const lookupValue = !goodCharacterKey.startsWith("Traveler") ? goodCharacterKey : "Traveler";
    const character = lookup[lookupValue];
    if (!character) {
      console.error(`Unexpected error: the character name ${lookupValue} could not be found.`);
    }
    return character;
  };

  return { lookupCharacter };
};

export const weaponLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getWeapons } = dataContext;
  const lookup = getWeapons().reduce((acc, weapon) => {
    acc[toPascalCase(weapon.name)] = weapon;
    return acc;
  }, {} as Record<string, IWeapon>);

  const lookupWeapon = (goodWeaponKey: string): IWeapon => {
    const weapon = lookup[goodWeaponKey];
    if (!weapon) {
      console.error(`Unexpected error: the weapon name ${goodWeaponKey} could not be found.`);
    }
    return weapon;
  };

  return { lookupWeapon };
};
