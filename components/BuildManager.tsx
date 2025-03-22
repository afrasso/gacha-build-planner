"use client";

import { List } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useDataContext } from "@/contexts/DataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { BuildData, ICharacter } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";
import { ReorderBuildsDialog } from "./ReorderBuildsDialog";
import { Button } from "./ui/button";

const BuildManager = () => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const { constructBuild, getCharacters } = useDataContext();
  const { deleteBuild, loadBuilds, saveBuilds } = useStorageContext();

  const [builds, setBuilds] = useState<BuildData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const buildsRetrievalResult = await loadBuilds();
      if (buildsRetrievalResult.status === StorageRetrievalStatus.FOUND) {
        const loadedBuilds = buildsRetrievalResult.value || [];
        setBuilds(loadedBuilds.sort((a, b) => a.sortOrder - b.sortOrder));
        setIsLoading(false);
      }
    };
    load();
  }, [authFetch, isAuthenticated, loadBuilds, user]);

  useEffect(() => {
    if (!isLoading) {
      saveBuilds(builds);
    }
  }, [authFetch, builds, isAuthenticated, isLoading, saveBuilds, user]);

  if (isLoading) {
    return <div>Loading builds...</div>;
  }

  const addBuild = (character: ICharacter) => {
    if (character && !builds.some((build) => build.characterId === character.id)) {
      setBuilds([...builds, constructBuild({ characterId: character.id }).toBuildData()]);
    }
  };

  const updateBuild = (buildId: string, updates: Partial<BuildData>) => {
    const characterId = buildId;
    setBuilds((builds) =>
      builds.map((build) => (build.characterId === characterId ? { ...build, ...updates } : build))
    );
  };

  const removeBuild = (buildId: string) => {
    const characterId = buildId;
    deleteBuild(characterId);
    setBuilds((builds) => builds.filter((build) => build.characterId !== characterId));
  };

  const handleReorderBuilds = (newOrder: BuildData[]) => {
    setBuilds(newOrder);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <CharacterSelector
          characters={getCharacters().filter(
            (character) => !builds.map((build) => build.characterId).includes(character.id)
          )}
          onAdd={addBuild}
        />
        <Button className="h-9 w-9" onClick={() => setIsReorderDialogOpen(true)} size="icon" variant="outline">
          <List className="h-4 w-4" />
          <span className="sr-only">Reorder builds</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {builds.map((build) => (
          <BuildCard
            build={build}
            key={build.characterId}
            onRemove={removeBuild}
            onUpdate={updateBuild}
            showInfoButton={true}
          />
        ))}
      </div>
      <ReorderBuildsDialog
        builds={builds}
        isOpen={isReorderDialogOpen}
        onClose={() => setIsReorderDialogOpen(false)}
        onReorder={handleReorderBuilds}
      />
    </>
  );
};

export default BuildManager;
