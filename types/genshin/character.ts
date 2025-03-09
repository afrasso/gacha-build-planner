import { ICharacter } from "../character";

export class Character implements ICharacter {
  private _characterData;

  constructor(characterData: CharacterData) {
    this._characterData = characterData;
  }

  get ascensionStat(): string {
    return this._characterData.ascensionStat;
  }

  get element(): string {
    return this._characterData.element;
  }

  get iconUrl(): string {
    return this._characterData.iconUrl;
  }

  get id(): string {
    return this._characterData.id;
  }

  get maxLvlStats(): MaxLvlStats {
    return this._characterData.maxLvlStats;
  }

  get name(): string {
    return this._characterData.name;
  }

  get rarity(): number {
    return this._characterData.rarity;
  }

  get weaponType(): string {
    return this._characterData.weaponType;
  }
}

export type CharacterData = {
  ascensionStat: string;
  element: string;
  iconUrl: string;
  id: string;
  maxLvlStats: MaxLvlStats;
  name: string;
  rarity: number;
  weaponType: string;
};

type MaxLvlStats = {
  ascensionStat: number;
  ATK: number;
  DEF: number;
  HP: number;
};
