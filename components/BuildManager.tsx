"use client";

import { useState } from "react";

import { ArtifactSet, Build, Character, Weapon } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";

interface BuildManagerProps {
  artifactSets: ArtifactSet[];
  characters: Character[];
  weapons: Weapon[];
}

const BuildManager: React.FC<BuildManagerProps> = ({ artifactSets, characters, weapons }) => {
  const [builds, setBuilds] = useState<Build[]>([]);

  const addBuild = (character: Character) => {
    if (character && !builds.some((b) => b.character.id === character.id)) {
      setBuilds([
        ...builds,
        {
          artifacts: {},
          character,
          desiredArtifactMainStats: {},
          desiredArtifactSetBonuses: [],
          desiredStats: [],
          weapon: undefined,
        },
      ]);
    }
  };

  const updateBuild = (buildId: string, updates: Partial<Build>) => {
    const characterId = buildId;
    setBuilds((builds) =>
      builds.map((build) => (build.character.id === characterId ? { ...build, ...updates } : build))
    );
  };

  const removeBuild = (buildId: string) => {
    const characterId = buildId;
    setBuilds((builds) => builds.filter((build) => build.character.id !== characterId));
  };

  return (
    <div>
      <CharacterSelector
        characters={characters.filter((character) => !builds.map((build) => build.character.id).includes(character.id))}
        onAdd={addBuild}
      />
      <div className="space-y-4">
        {builds.map((build) => (
          <BuildCard
            artifactSets={artifactSets}
            build={build}
            key={build.character.id}
            onRemove={removeBuild}
            onUpdate={updateBuild}
            weapons={weapons.filter((weapon) => weapon.type === build.character.weaponType)}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildManager;
