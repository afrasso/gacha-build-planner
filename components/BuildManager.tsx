"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import { savePlan } from "@/lib/db";
import { ArtifactSet, Build, Character, Weapon } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";

interface BuildManagerProps {
  artifactSets: ArtifactSet[];
  characters: Character[];
  weapons: Weapon[];
}

const BuildManager: React.FC<BuildManagerProps> = ({ artifactSets, characters, weapons }) => {
  const { data: session } = useSession();
  const [builds, setBuilds] = useState<Build[]>([]);

  const saveToDatabase = () => {
    if (session && session.user?.email) {
      console.log("I'm logged in!");
      console.log(JSON.stringify(session));
      savePlan({ email: session.user?.email, plan: { builds } });
    } else {
      console.log("Not logged in!");
    }
  };

  const addBuild = (character: Character) => {
    saveToDatabase();
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
    saveToDatabase();
    const characterId = buildId;
    setBuilds((builds) =>
      builds.map((build) => (build.character.id === characterId ? { ...build, ...updates } : build))
    );
  };

  const removeBuild = (buildId: string) => {
    saveToDatabase();
    const characterId = buildId;
    setBuilds((builds) => builds.filter((build) => build.character.id !== characterId));
  };

  return (
    <div>
      <CharacterSelector
        characters={characters.filter((character) => !builds.map((build) => build.character.id).includes(character.id))}
        onAdd={addBuild}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
