import { Artifact, Build, validateArtifact, validateArtifacts, validateBuild, validateBuilds } from "@/types";

import { deleteItem } from "./deleteitem";
import { deleteItems } from "./deleteitems";
import { loadItem } from "./loaditem";
import { loadItems } from "./loaditems";
import { saveItem } from "./saveitem";
import { saveItems } from "./saveitems";

export const deleteArtifactFromIndexedDB = async (id: string): Promise<void> => {
  return deleteItem({ collectionName: "artifacts", id });
};

export const deleteArtifactsFromIndexedDB = async (): Promise<void> => {
  return deleteItems({ collectionName: "artifacts" });
};

export const deleteBuildFromIndexedDB = async (characterId: string): Promise<void> => {
  return deleteItem({ collectionName: "builds", id: characterId });
};

export const deleteBuildsFromIndexedDB = async (): Promise<void> => {
  return deleteItems({ collectionName: "builds" });
};

export const loadArtifactFromIndexedDB = async (id: string): Promise<Artifact | undefined> => {
  return loadItem({ collectionName: "artifacts", id, validate: validateArtifact });
};

export const loadArtifactsFromIndexedDB = async (): Promise<Artifact[]> => {
  return loadItems({ collectionName: "artifacts", validate: validateArtifacts });
};

export const loadBuildFromIndexedDB = async (characterId: string): Promise<Build | undefined> => {
  return loadItem({ collectionName: "builds", id: characterId, validate: validateBuild });
};

export const loadBuildsFromIndexedDB = async (): Promise<Build[]> => {
  return loadItems({ collectionName: "builds", validate: validateBuilds });
};

export const saveArtifactToIndexedDB = async (artifact: Artifact): Promise<void> => {
  return saveItem({ collectionName: "artifacts", item: artifact });
};

export const saveArtifactsToIndexedDB = async (artifacts: Artifact[]): Promise<void> => {
  return saveItems({ collectionName: "artifacts", items: artifacts });
};

export const saveBuildToIndexedDB = async (build: Build): Promise<void> => {
  return saveItem({ collectionName: "builds", item: build });
};

export const saveBuildsToIndexedDB = async (builds: Build[]): Promise<void> => {
  return saveItems({ collectionName: "builds", items: builds });
};
