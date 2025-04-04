"use client";

import { validateImport } from "@/dataimport/good";
import { ArtifactData, ArtifactSet, ArtifactSetBonus, DesiredOverallStat, ICharacter, IWeapon } from "@/types";
import { Character, CharacterData, Weapon, WeaponData } from "@/types/genshin";
import { Build } from "@/types/genshin/build";
import { Misc } from "@/types/misc";

import { DataProvider as GenericDataProvider } from "../DataProvider";

const constructBuild = ({
  artifacts,
  characterId,
  desiredArtifactMainStats,
  desiredArtifactSetBonuses,
  desiredOverallStats,
  lastUpdatedDate,
  sortOrder,
  weaponId,
}: {
  artifacts?: Record<string, ArtifactData>;
  characterId: string;
  desiredArtifactMainStats?: Record<string, string[]>;
  desiredArtifactSetBonuses?: ArtifactSetBonus[];
  desiredOverallStats?: DesiredOverallStat[];
  lastUpdatedDate?: string;
  sortOrder?: number;
  weaponId?: string;
}) => {
  return new Build({
    artifacts,
    characterId,
    desiredArtifactMainStats,
    desiredArtifactSetBonuses,
    desiredOverallStats,
    lastUpdatedDate,
    sortOrder,
    weaponId,
  });
};

interface DataProviderProps {
  artifactSets: ArtifactSet[];
  characterDatas: CharacterData[];
  children: React.ReactNode;
  misc: Misc;
  weaponDatas: WeaponData[];
}

export const DataProvider: React.FC<DataProviderProps> = ({
  artifactSets,
  characterDatas,
  children,
  misc,
  weaponDatas,
}) => {
  const characters: ICharacter[] = characterDatas.map((characterData) => new Character(characterData));
  const weapons: IWeapon[] = weaponDatas.map((weaponData) => new Weapon(weaponData));

  return GenericDataProvider({
    artifactSets,
    characters,
    children,
    constructBuild,
    gamePathSegment: "genshin",
    misc,
    validateImport,
    weapons,
  });
};
