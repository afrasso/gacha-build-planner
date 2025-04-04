import { IWeapon } from "@/types";

type retFn = (id: string) => IWeapon;

export const buildGetWeapon = (weapons: IWeapon[]): retFn => {
  const lookup = weapons.reduce<Record<string, IWeapon>>((acc, x) => {
    acc[x.id] = x;
    return acc;
  }, {});

  return (id: string): IWeapon => {
    const weapon = lookup[id];
    if (!weapon) {
      throw new Error(`Could not find weapon with ID ${id}.`);
    }
    return weapon;
  };
};
