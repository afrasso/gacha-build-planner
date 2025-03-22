import { ICharacter } from "../character";

export class Character implements ICharacter {
  private _characterData;

  constructor(characterData: CharacterData) {
    this._characterData = characterData;
  }

  get element(): string {
    return this._characterData.combatType;
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
    return this._characterData.path;
  }
}

export type CharacterData = {
  combatType: string;
  iconUrl: string;
  id: string;
  maxLvlStats: MaxLvlStats;
  name: string;
  path: string;
  rarity: number;
  statTraces: Record<string, number>;
};

export type MaxLvlStats = {
  ATK: number;
  DEF: number;
  HP: number;
  SPD: number;
};
