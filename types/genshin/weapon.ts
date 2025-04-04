import { IWeapon } from "../weapon";

export class Weapon implements IWeapon {
  private _weaponData;

  constructor(weaponData: WeaponData) {
    this._weaponData = weaponData;
  }

  get iconUrl(): string {
    return this._weaponData.iconUrl;
  }

  get id(): string {
    return this._weaponData.id;
  }

  get mainStatKey(): string {
    return this._weaponData.mainStatKey;
  }

  get maxLvlStats(): MaxLvlStats {
    return this._weaponData.maxLvlStats;
  }

  get name(): string {
    return this._weaponData.name;
  }

  get rarity(): number {
    return this._weaponData.rarity;
  }

  get type(): string {
    return this._weaponData.type;
  }
}

type MaxLvlStats = {
  ATK: number;
  mainStatValue: number;
};

export type WeaponData = {
  iconUrl: string;
  id: string;
  mainStatKey: string;
  maxLvlStats: MaxLvlStats;
  name: string;
  rarity: number;
  type: string;
};
