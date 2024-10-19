"use client";

import BuildCard from "@/components/BuildCard";
import CharacterSelector from "@/components/CharacterSelector";
import { ArtifactSet, ArtifactType, Build, Character, Stat, Weapon } from "@/types";
import { useState } from "react";

interface BuildManagerProps {
  artifactSets: ArtifactSet[];
  characters: Character[];
  weapons: Weapon[];
}

const BuildManager: React.FC<BuildManagerProps> = ({ artifactSets, characters, weapons }) => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [editModeBuilds, setEditModeBuilds] = useState<string[]>([]);

  const addBuild = (character: Character) => {
    if (character && !builds.some((b) => b.character.id === character.id)) {
      setBuilds([
        ...builds,
        {
          artifacts: [],
          artifactSets: [],
          character,
          desiredMainStats: {} as Record<ArtifactType, Stat>,
          desiredStats: [],
          desiredSubStats: [],
          weapon: undefined,
        },
      ]);
    }
  };

  const updateBuild = (characterId: string, updates: Partial<Build>) => {
    setBuilds((builds) =>
      builds.map((build) => (build.character.id === characterId ? { ...build, ...updates } : build))
    );
  };

  const toggleEditMode = (characterId: string) => {
    setEditModeBuilds((editModeBuilds) =>
      editModeBuilds.includes(characterId)
        ? editModeBuilds.filter((id) => id !== characterId)
        : [...editModeBuilds, characterId]
    );
  };

  const removeBuild = (characterId: string) => {
    setBuilds((builds) => builds.filter((build) => build.character.id !== characterId));
    setEditModeBuilds((editModeBuilds) => editModeBuilds.filter((id) => id !== characterId));
  };

  const updateDesiredMainStat = (characterId: string, type: string, stat: string) => {
    const build = builds.find((build) => build.character.id === characterId);
    if (build) {
      const updatedMainStats = { ...build.desiredMainStats, [type]: stat };
      updateBuild(characterId, { desiredMainStats: updatedMainStats });
    }
  };

  const toggleDesiredSubStat = (characterId: string, stat: string) => {
    const build = builds.find((build) => build.character.id === characterId);
    if (build) {
      const updatedSubStats = build.desiredSubStats.includes(stat)
        ? build.desiredSubStats.filter((s) => s !== stat)
        : [...build.desiredSubStats, stat];
      updateBuild(characterId, { desiredSubStats: updatedSubStats });
    }
  };

  const recommendArtifacts = () => {
    // Logic for recommending artifacts based on character, main/sub stats, etc.
    return [];
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
            inEditMode={editModeBuilds.includes(build.character.id)}
            key={build.character.id}
            onRemove={removeBuild}
            onToggleDesiredSubStat={toggleDesiredSubStat}
            onToggleEditMode={toggleEditMode}
            onUpdate={updateBuild}
            onUpdateDesiredMainStat={updateDesiredMainStat}
            recommendArtifacts={recommendArtifacts}
            weapons={weapons.filter((weapon) => weapon.type === build.character.weaponType)}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildManager;
