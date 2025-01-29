import { Build, Character } from "@/types";

import { Character as GOODCharacter } from "./types";

export const createNewBuild = ({
  goodCharacter,
  lookupCharacter,
}: {
  goodCharacter: GOODCharacter;
  lookupCharacter: (goodCharacterKey: string) => Character;
}): Build => {
  const character = lookupCharacter(goodCharacter.key);
  if (!character) {
    throw new Error(`Could not find the character ${goodCharacter.key}`);
  }
  return {
    artifacts: {},
    characterId: character.id,
    desiredArtifactMainStats: {},
    desiredArtifactSetBonuses: [],
    desiredOverallStats: [],
    desiredStats: [],
    lastUpdatedDate: new Date().toISOString(),
    sortOrder: 0,
    weaponId: undefined,
  };
};
