"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { ArtifactData, BuildData } from "@/types";

import {
  deleteArtifactFromIndexedDB,
  deleteArtifactsFromIndexedDB,
  deleteBuildFromIndexedDB,
  deleteBuildsFromIndexedDB,
  loadArtifactFromIndexedDB,
  loadArtifactsFromIndexedDB,
  loadBuildFromIndexedDB,
  loadBuildsFromIndexedDB,
  saveArtifactsToIndexedDB,
  saveArtifactToIndexedDB,
  saveBuildsToIndexedDB,
  saveBuildToIndexedDB,
} from "./indexeddb";
// import { useAuthContext } from "./AuthContext";

interface StorageContextType {
  deleteArtifact: (id: string) => Promise<void>;
  deleteArtifacts: () => Promise<void>;
  deleteBuild: (characterId: string) => Promise<void>;
  deleteBuilds: () => Promise<void>;
  loadArtifact: (id: string) => Promise<StorageRetrievalResult<ArtifactData>>;
  loadArtifacts: () => Promise<StorageRetrievalResult<ArtifactData[]>>;
  loadBuild: (characterId: string) => Promise<StorageRetrievalResult<BuildData>>;
  loadBuilds: () => Promise<StorageRetrievalResult<BuildData[]>>;
  saveArtifact: (artifact: ArtifactData) => Promise<void>;
  saveArtifacts: (artifacts: ArtifactData[]) => Promise<void>;
  saveBuild: (build: BuildData) => Promise<void>;
  saveBuilds: (builds: BuildData[]) => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export enum StorageRetrievalStatus {
  FOUND = "FOUND",
  LOADING = "LOADING",
  NOT_FOUND = "NOT_FOUND",
}

export interface StorageRetrievalResult<T> {
  status: StorageRetrievalStatus;
  value?: T;
}

interface StorageProviderProps {
  children: React.ReactNode;
  game: string;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children, game }) => {
  const [isClient, setIsClient] = useState(false);

  // const { authFetch, isAuthenticated, user } = useAuthContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deleteArtifact = async (id: string): Promise<void> => {
    await deleteArtifactFromIndexedDB({ game, id });
  };

  const deleteArtifacts = async (): Promise<void> => {
    await deleteArtifactsFromIndexedDB({ game });
  };

  const deleteBuild = async (characterId: string): Promise<void> => {
    await deleteBuildFromIndexedDB({ characterId, game });
  };

  const deleteBuilds = async (): Promise<void> => {
    await deleteBuildsFromIndexedDB({ game });
  };

  const loadArtifact = async (id: string): Promise<StorageRetrievalResult<ArtifactData>> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    const artifact = await loadArtifactFromIndexedDB({ game, id });
    if (!artifact) {
      return { status: StorageRetrievalStatus.NOT_FOUND };
    }
    return { status: StorageRetrievalStatus.FOUND, value: artifact };
  };

  const loadArtifacts = async (): Promise<StorageRetrievalResult<ArtifactData[]>> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    const artifacts = await loadArtifactsFromIndexedDB({ game });
    return { status: StorageRetrievalStatus.FOUND, value: artifacts };
  };

  const loadBuild = async (characterId: string): Promise<StorageRetrievalResult<BuildData>> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    const build = await loadBuildFromIndexedDB({ characterId, game });
    if (!build) {
      return { status: StorageRetrievalStatus.NOT_FOUND };
    }
    return { status: StorageRetrievalStatus.FOUND, value: build };
  };

  const loadBuilds = async (): Promise<StorageRetrievalResult<BuildData[]>> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    // const loadPlan = async () => {
    //   if (isAuthenticated) {
    //     try {
    //       if (!user) {
    //         throw new Error("User not populated");
    //       }
    //       const response = await authFetch(`/users/${user.id}/plans`, { method: "GET" });
    //       if (!response.ok) {
    //         throw new Error("Unexpected response when retrieving plan");
    //       }
    //       const responseBody = await response.json();
    //       const plans: Plan[] = responseBody._embedded.plans;
    //       if (plans && plans.length > 0 && plans[0] && plans[0].builds && plans[0].builds.length > 0) {
    //         const plan = plans[0];
    //         setPlanId(plan.id);
    //         setBuilds(plans[0].builds);
    //       }
    //     } catch (err) {
    //       console.error("Error loading data", err);
    //     }
    //   }
    // };

    const builds = await loadBuildsFromIndexedDB({ game });
    return { status: StorageRetrievalStatus.FOUND, value: builds };
  };

  const saveArtifact = async (artifact: ArtifactData): Promise<void> => {
    await saveArtifactToIndexedDB({ artifact, game });
  };

  const saveArtifacts = async (artifacts: ArtifactData[]): Promise<void> => {
    await saveArtifactsToIndexedDB({ artifacts, game });
  };

  const saveBuild = async (build: BuildData): Promise<void> => {
    await saveBuildToIndexedDB({ build, game });
  };

  const saveBuilds = async (builds: BuildData[]): Promise<void> => {
    // const savePlan = async () => {
    //   if (isAuthenticated) {
    //     try {
    //       if (!user) {
    //         throw new Error("User not populated");
    //       }
    //       if (builds && builds.length > 0) {
    //         if (!planId) {
    //           const response = await authFetch(`/users/${user.id}/plans`, {
    //             body: JSON.stringify({ builds }),
    //             method: "POST",
    //           });
    //           if (!response.ok) {
    //             throw new Error("Unexpected response when saving plan");
    //           }
    //           const plan = await response.json();
    //           setPlanId(plan.id);
    //         } else {
    //           const response = await authFetch(`/users/${user.id}/plans/${planId}`, {
    //             body: JSON.stringify({ builds }),
    //             method: "PUT",
    //           });
    //           if (!response.ok) {
    //             throw new Error("Unexpected response when saving plan");
    //           }
    //         }
    //       }
    //     } catch (err) {
    //       console.error("Error loading data", err);
    //     }
    //   }
    // };

    // savePlan();
    await saveBuildsToIndexedDB({ builds, game });
  };

  return (
    <StorageContext.Provider
      value={{
        deleteArtifact,
        deleteArtifacts,
        deleteBuild,
        deleteBuilds,
        loadArtifact,
        loadArtifacts,
        loadBuild,
        loadBuilds,
        saveArtifact,
        saveArtifacts,
        saveBuild,
        saveBuilds,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorageContext must be used within a StorageProvider");
  }
  return context;
};
