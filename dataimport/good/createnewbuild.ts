import { BuildData, ICharacter } from "@/types";
import { Build } from "@/types/genshin/build";

import { Character as GOODCharacter } from "./types";

export const createNewBuild = ({
  goodCharacter,
  lookupCharacter,
}: {
  goodCharacter: GOODCharacter;
  lookupCharacter: (goodCharacterKey: string) => ICharacter;
}): BuildData => {
  const character = lookupCharacter(goodCharacter.key);
  if (!character) {
    throw new Error(`Could not find the character ${goodCharacter.key}`);
  }
  return new Build({ characterId: character.id }).toBuildData();
};
