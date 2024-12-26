"use client";

import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { Build, Character, Plan } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { useStorageContext } from "@/contexts/StorageContext";
import { Button } from "./ui/button";
import { List } from "lucide-react";
import { ReorderBuildsDialog } from "./ReorderBuildsDialog";

const BuildManager = () => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const { artifactSets, characters, weapons } = useGenshinDataContext();
  const { loadBuilds, saveBuilds } = useStorageContext();

  const [builds, setBuilds] = useState<Build[]>([]);
  const [planId, setPlanId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

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

  const handleReorderBuilds = (newOrder: Build[]) => {
    setBuilds(newOrder);
  };

  useEffect(() => {
    const loadedBuilds = loadBuilds();
    setBuilds(loadedBuilds);
    setIsLoading(false);
  }, [authFetch, isAuthenticated, user]);

  useEffect(() => {
    if (!isLoading) {
      saveBuilds(builds);
    }
  }, [authFetch, builds, isAuthenticated, planId, isLoading, user]);

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <CharacterSelector
          characters={characters.filter(
            (character) => !builds.map((build) => build.character.id).includes(character.id)
          )}
          onAdd={addBuild}
        />
        <Button onClick={() => setIsReorderDialogOpen(true)} variant="outline" size="icon" className="h-9 w-9">
          <List className="h-4 w-4" />
          <span className="sr-only">Reorder builds</span>
        </Button>
      </div>
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
      <ReorderBuildsDialog
        builds={builds}
        onReorder={handleReorderBuilds}
        isOpen={isReorderDialogOpen}
        onClose={() => setIsReorderDialogOpen(false)}
      />
    </>
  );
};

export default BuildManager;
