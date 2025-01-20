"use client";

import { List } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Build, Character } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";
import { ReorderBuildsDialog } from "./ReorderBuildsDialog";
import { Button } from "./ui/button";

const BuildManager = () => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const { artifactSets, characters, getCharacter, weapons } = useGenshinDataContext();
  const { loadBuilds, saveBuilds } = useStorageContext();

  const [builds, setBuilds] = useState<Build[]>([]);
  const [buildsRetrievalStatus, setBuildsRetrievalStatus] = useState<StorageRetrievalStatus>(
    StorageRetrievalStatus.LOADING
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

  useEffect(() => {
    const buildsRetrievalResult = loadBuilds();
    const loadedBuilds = loadBuilds().value || [];
    setBuildsRetrievalStatus(buildsRetrievalResult.status);
    setBuilds(loadedBuilds);
    if (buildsRetrievalResult.status === StorageRetrievalStatus.FOUND) {
      setIsLoading(false);
    }
  }, [authFetch, isAuthenticated, loadBuilds, user]);

  useEffect(() => {
    if (!isLoading) {
      saveBuilds(builds);
    }
  }, [authFetch, builds, isAuthenticated, isLoading, saveBuilds, user]);

  if (buildsRetrievalStatus === StorageRetrievalStatus.LOADING) {
    return <div>Loading builds...</div>;
  }

  const addBuild = (character: Character) => {
    if (character && !builds.some((build) => build.characterId === character.id)) {
      setBuilds([
        ...builds,
        {
          artifacts: {},
          characterId: character.id,
          desiredArtifactMainStats: {},
          desiredArtifactSetBonuses: [],
          desiredOverallStats: [],
          desiredStats: [],
          lastUpdatedDate: new Date().toISOString(),
        },
      ]);
    }
  };

  const updateBuild = (buildId: string, updates: Partial<Build>) => {
    const characterId = buildId;
    setBuilds((builds) =>
      builds.map((build) => (build.characterId === characterId ? { ...build, ...updates } : build))
    );
  };

  const removeBuild = (buildId: string) => {
    const characterId = buildId;
    setBuilds((builds) => builds.filter((build) => build.characterId !== characterId));
  };

  const handleReorderBuilds = (newOrder: Build[]) => {
    setBuilds(newOrder);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <CharacterSelector
          characters={characters.filter(
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
            artifactSets={artifactSets}
            build={build}
            key={build.characterId}
            onRemove={removeBuild}
            onUpdate={updateBuild}
            weapons={weapons.filter((weapon) => weapon.type === getCharacter(build.characterId).weaponType)}
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
