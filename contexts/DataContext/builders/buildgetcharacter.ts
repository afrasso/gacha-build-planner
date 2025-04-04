import { ICharacter } from "@/types";

type retFn = (id: string) => ICharacter;

export const buildGetCharacter = (characters: ICharacter[]): retFn => {
  const lookup = characters.reduce<Record<string, ICharacter>>((acc, x) => {
    acc[x.id] = x;
    return acc;
  }, {});

  return (id: string): ICharacter => {
    const character = lookup[id];
    if (!character) {
      throw new Error(`Could not find character with ID ${id}.`);
    }
    return character;
  };
};
