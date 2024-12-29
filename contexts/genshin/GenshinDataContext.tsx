"use client";

import React, { createContext, useContext } from "react";

import { ArtifactSet, Character, Weapon } from "@/types";

export interface GenshinDataContext {
  artifactSets: ArtifactSet[];
  characters: Character[];
  getArtifactSet: (id: string) => ArtifactSet;
  getCharacter: (id: string) => Character;
  getWeapon: (id: string) => Weapon;
  weapons: Weapon[];
}

const GenshinDataContext = createContext<GenshinDataContext | undefined>(undefined);

interface GenshinDataProviderProps {
  artifactSets: ArtifactSet[];
  characters: Character[];
  children: React.ReactNode;
  weapons: Weapon[];
}

export const GenshinDataProvider: React.FC<GenshinDataProviderProps> = ({
  artifactSets,
  characters,
  children,
  weapons,
}) => {
  const artifactSetsById = artifactSets.reduce((acc, artifactSet) => {
    acc[artifactSet.id] = artifactSet;
    return acc;
  }, {} as Record<string, ArtifactSet>);

  const getArtifactSet = (id: string): ArtifactSet => {
    const artifactSet = artifactSetsById[id];
    if (!artifactSet) {
      throw new Error(`Could not find artifact set ${id}`);
    }
    return artifactSet;
  };

  const charactersById = characters.reduce((acc, character) => {
    acc[character.id] = character;
    return acc;
  }, {} as Record<string, Character>);

  const getCharacter = (id: string): Character => {
    const character = charactersById[id];
    if (!character) {
      throw new Error(`Could not find character ${id}`);
    }
    return character;
  };

  const weaponsById = weapons.reduce((acc, weapon) => {
    acc[weapon.id] = weapon;
    return acc;
  }, {} as Record<string, Weapon>);

  const getWeapon = (id: string): Weapon => {
    const weapon = weaponsById[id];
    if (!weapon) {
      throw new Error(`Could not find weapon ${id}`);
    }
    return weapon;
  };

  return (
    <GenshinDataContext.Provider value={{ artifactSets, characters, getArtifactSet, getCharacter, getWeapon, weapons }}>
      {children}
    </GenshinDataContext.Provider>
  );
};

export const useGenshinDataContext = () => {
  const context = useContext(GenshinDataContext);
  if (context === undefined) {
    throw new Error("useGenshinDataContext must be used within a GenshinDataProvider");
  }
  return context;
};
