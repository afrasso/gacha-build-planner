export interface Artifact {
  iconUrl: string;
  level: number;
  mainStat: Stat;
  rarity: number;
  setId: string;
  subStats: StatValue[];
  type: ArtifactType;
}

export interface ArtifactSet {
  iconUrl: string;
  id: string;
  name: string;
  rarities: number[];
}

export enum ArtifactType {
  CIRCLET = "CIRCLET",
  FLOWER = "FLOWER",
  GOBLET = "GOBLET",
  PLUME = "PLUME",
  SANDS = "SANDS",
}

export interface Build {
  artifacts: Artifact[];
  character: Character;
  desiredArtifactMainStats: ArtifactMainStats;
  desiredArtifactSets: ArtifactSet[];
  desiredStats: StatValue[];
  weapon: undefined | Weapon;
}

export interface ArtifactMainStats {
  [ArtifactType.CIRCLET]: Stat | undefined;
  [ArtifactType.FLOWER]: Stat | undefined;
  [ArtifactType.GOBLET]: Stat | undefined;
  [ArtifactType.PLUME]: Stat | undefined;
  [ArtifactType.SANDS]: Stat | undefined;
}

export interface Character {
  element: Element;
  iconUrl: string;
  id: string;
  name: string;
  rarity: number;
  weaponType: WeaponType;
}

export enum Element {
  ANEMO = "ELEMENT_ANEMO",
  CRYO = "ELEMENT_CRYO",
  DENDRO = "ELEMENT_DENDRO",
  ELECTRO = "ELEMENT_ELECTRO",
  GEO = "ELEMENT_GEO",
  HYDRO = "ELEMENT_HYDRO",
  NONE = "ELEMENT_NONE",
  PYRO = "ELEMENT_PYRO",
}

export enum Stat {
  ATK_FLAT = "ATK",
  ATK_PERCENT = "ATK_PERCENT",
  CRIT_DMG = "CRIT_DMG",
  CRIT_RATE = "CRIT_RATE",
  DEF_FLAT = "DEF_FLAT",
  DEF_PERCENT = "DEF_PERCENT",
  DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO",
  DMG_BONUS_CRYO = "DMG_BONUS_CRYO",
  DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO",
  DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO",
  DMG_BONUS_GEO = "DMG_BONUS_GEO",
  DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO",
  DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL",
  DMG_BONUS_PYRO = "DMG_BONUS_PYRO",
  ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE = "ENERGY_RECHARGE",
  HEALING_BONUS = "Healing HEALING_BONUS",
  HP_FLAT = "HP_FLAT",
  HP_PERCENT = "HP_PERCENT",
}

export interface StatValue {
  stat: Stat;
  value: number;
}

export interface Weapon {
  iconUrl: string;
  id: string;
  name: string;
  rarity: number;
  type: WeaponType;
}

export enum WeaponType {
  BOW = "WEAPON_BOW",
  CATALYST = "WEAPON_CATALYST",
  CLAYMORE = "WEAPON_CLAYMORE",
  POLEARM = "WEAPON_POLE",
  SWORD = "WEAPON_SWORD_ONE_HAND",
}
