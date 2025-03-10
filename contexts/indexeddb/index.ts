import { ArtifactData, BuildData, validateArtifact, validateArtifacts, validateBuild, validateBuilds } from "@/types";

import { deleteItem } from "./deleteitem";
import { deleteItems } from "./deleteitems";
import { loadItem } from "./loaditem";
import { loadItems } from "./loaditems";
import { saveItem } from "./saveitem";
import { saveItems } from "./saveitems";

export const deleteArtifactFromIndexedDB = async ({ game, id }: { game: string; id: string }): Promise<void> => {
  return deleteItem({ collectionName: "artifacts", databaseName: game, id });
};

export const deleteArtifactsFromIndexedDB = async ({ game }: { game: string }): Promise<void> => {
  return deleteItems({ collectionName: "artifacts", databaseName: game });
};

export const deleteBuildFromIndexedDB = async ({
  characterId,
  game,
}: {
  characterId: string;
  game: string;
}): Promise<void> => {
  return deleteItem({ collectionName: "builds", databaseName: game, id: characterId });
};

export const deleteBuildsFromIndexedDB = async ({ game }: { game: string }): Promise<void> => {
  return deleteItems({ collectionName: "builds", databaseName: game });
};

export const loadArtifactFromIndexedDB = async ({
  game,
  id,
}: {
  game: string;
  id: string;
}): Promise<ArtifactData | undefined> => {
  return loadItem({ collectionName: "artifacts", databaseName: game, id, validate: validateArtifact });
};

export const loadArtifactsFromIndexedDB = async ({ game }: { game: string }): Promise<ArtifactData[]> => {
  return loadItems({ collectionName: "artifacts", databaseName: game, validate: validateArtifacts });
};

export const loadBuildFromIndexedDB = async ({
  characterId,
  game,
}: {
  characterId: string;
  game: string;
}): Promise<BuildData | undefined> => {
  return loadItem({ collectionName: "builds", databaseName: game, id: characterId, validate: validateBuild });
};

export const loadBuildsFromIndexedDB = async ({ game }: { game: string }): Promise<BuildData[]> => {
  return loadItems({ collectionName: "builds", databaseName: game, validate: validateBuilds });
};

export const saveArtifactToIndexedDB = async ({
  artifact,
  game,
}: {
  artifact: ArtifactData;
  game: string;
}): Promise<void> => {
  return saveItem({ collectionName: "artifacts", databaseName: game, item: artifact });
};

export const saveArtifactsToIndexedDB = async ({
  artifacts,
  game,
}: {
  artifacts: ArtifactData[];
  game: string;
}): Promise<void> => {
  return saveItems({ collectionName: "artifacts", databaseName: game, items: artifacts });
};

export const saveBuildToIndexedDB = async ({ build, game }: { build: BuildData; game: string }): Promise<void> => {
  return saveItem({ collectionName: "builds", databaseName: game, item: build });
};

export const saveBuildsToIndexedDB = async ({ builds, game }: { builds: BuildData[]; game: string }): Promise<void> => {
  return saveItems({ collectionName: "builds", databaseName: game, items: builds });
};
