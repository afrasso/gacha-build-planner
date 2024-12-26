"use client";

import { ArtifactSet, Character, Weapon } from "@/types";
import React, { createContext, useContext } from "react";

interface GenshinDataContextType {
  artifactSets: ArtifactSet[];
  artifactSetsById: Record<string, ArtifactSet>;
  characters: Character[];
  weapons: Weapon[];
}

const GenshinDataContext = createContext<GenshinDataContextType | undefined>(undefined);

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

  return (
    <GenshinDataContext.Provider value={{ artifactSets, artifactSetsById, characters, weapons }}>
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
