export type CharacterData = {
  combatType: string;
  iconUrl: string;
  id: string;
  maxLvlStats: {
    ATK: number;
    CRIT_DMG: number;
    CRIT_RATE: number;
    DEF: number;
    HP: number;
    SPD: number;
  };
  name: string;
  path: string;
  rarity: number;
  statTraces: Record<string, number>;
};

export type WeaponData = {
  iconUrl: string;
  id: string;
  maxLvlStats: {
    ATK: number;
    DEF: number;
    HP: number;
  };
  name: string;
  path: string;
  rarity: string;
};
