import { IDataContext } from "@/contexts/DataContext";
import { IWeapon } from "@/types";

import { toPascalCase } from "./topascalcase";

export const buildWeaponLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getWeapons } = dataContext;
  const lookup = getWeapons().reduce<Record<string, IWeapon>>((acc, weapon) => {
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

  return lookupWeapon;
};
