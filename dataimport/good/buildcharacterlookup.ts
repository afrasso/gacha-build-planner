import { IDataContext } from "@/contexts/DataContext";
import { ICharacter } from "@/types";

import { toPascalCase } from "./topascalcase";

export const buildCharacterLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getCharacters } = dataContext;

  const lookup = getCharacters().reduce<Record<string, ICharacter>>((acc, character) => {
    acc[toPascalCase(character.name)] = character;
    return acc;
  }, {});

  const lookupCharacter = (key: string): ICharacter => {
    const lookupValue = !key.startsWith("Traveler") ? key : "Traveler";
    const character = lookup[lookupValue];
    if (!character) {
      console.error(`Unexpected error: the character ${lookupValue} could not be found.`);
    }
    return character;
  };

  return lookupCharacter;
};
