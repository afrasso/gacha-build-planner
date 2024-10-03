export interface Artifact {
  iconUrl: string;
  level: number;
  mainStat: string;
  rarity: number;
  setKey: string;
  subStats: string[];
  type: ArtifactType;
}

export interface ArtifactSet {
  iconUrl: string;
  id: string;
  name: string;
  rarities: number[];
}

export enum ArtifactType {
  CIRCLET = "Circlet",
  FLOWER = "Flower",
  GOBLET = "Goblet",
  PLUME = "Plume",
  SANDS = "Sands",
}

export interface Build {
  artifacts: Artifact[];
  artifactSets: ArtifactSet[];
  character: Character;
  desiredMainStats: Record<ArtifactType, Stat>;
  desiredStats: DesiredStat[];
  desiredSubStats: string[];
  weapon: undefined | Weapon;
}

export interface Character {
  element: Element;
  iconUrl: string;
  id: string;
  name: string;
  rarity: number;
  weaponType: WeaponType;
}

export interface DesiredStat {
  stat: Stat | undefined;
  value: number;
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
  ATK_PERCENT = "ATK Percentage",
  CRIT_DMG = "CRIT DMG",
  CRIT_RATE = "CRIT Rate",
  DEF_FLAT = "DEF",
  DEF_PERCENT = "DEF Percentage",
  DMG_BONUS_ANEMO = "Anemo DMG Bonus",
  DMG_BONUS_CRYO = "Cryo DMG Bonus",
  DMG_BONUS_DENDRO = "Dendro DMG Bonus",
  DMG_BONUS_ELECTRO = "Electro DMG Bonus",
  DMG_BONUS_GEO = "Geo DMG Bonus",
  DMG_BONUS_HYDRO = "Hydro DMG Bonus",
  DMG_BONUS_PHYSICAL = "Physical DMG Bonus",
  DMG_BONUS_PYRO = "Pyro DMG Bonus",
  ELEMENTAL_MASTERY = "Elemental Mastery",
  ENERGY_RECHARGE = "Energy Recharge",
  HEALING_BONUS = "Healing Bonus",
  HP_FLAT = "HP",
  HP_PERCENT = "HP Percentage",
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
