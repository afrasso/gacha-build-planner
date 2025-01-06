"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { Artifact, Build, validateArtifacts, validateBuilds } from "@/types";
// import { useAuthContext } from "./AuthContext";

interface StorageContextType {
  loadArtifact: (id: string) => StorageRetrievalResult<Artifact>;
  loadArtifacts: () => StorageRetrievalResult<Artifact[]>;
  loadBuild: (characterId: string) => StorageRetrievalResult<Build>;
  loadBuilds: () => StorageRetrievalResult<Build[]>;
  saveArtifacts: (artifacts: Artifact[]) => void;
  saveBuilds: (builds: Build[]) => void;
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
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  // const { authFetch, isAuthenticated, user } = useAuthContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getArtifactsFromLocalStorage = (): Artifact[] => {
    const artifactsJson = localStorage.getItem("artifacts");
    if (!artifactsJson) {
      return [];
    }
    const parsedArtifacts = JSON.parse(artifactsJson);
    const artifacts = validateArtifacts(parsedArtifacts);
    return artifacts;
  };

  const getBuildsFromLocalStorage = (): Build[] => {
    const buildsJson = localStorage.getItem("builds");
    if (!buildsJson) {
      return [];
    }
    const parsedBuilds = JSON.parse(buildsJson);
    const builds = validateBuilds(parsedBuilds);
    return builds;
  };

  const loadArtifact = (id: string): StorageRetrievalResult<Artifact> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    const artifacts = getArtifactsFromLocalStorage();
    const artifact = artifacts.find((artifact) => artifact.id === id);
    if (!artifact) {
      return { status: StorageRetrievalStatus.NOT_FOUND };
    }
    return { status: StorageRetrievalStatus.FOUND, value: artifact };
  };

  const loadArtifacts = (): StorageRetrievalResult<Artifact[]> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    return { status: StorageRetrievalStatus.FOUND, value: getArtifactsFromLocalStorage() };
  };

  const loadBuild = (characterId: string): StorageRetrievalResult<Build> => {
    if (!isClient) {
      return { status: StorageRetrievalStatus.LOADING };
    }
    const builds = getBuildsFromLocalStorage();
    const build = builds.find((build) => build.characterId === characterId);
    if (!build) {
      return { status: StorageRetrievalStatus.NOT_FOUND };
    }
    return { status: StorageRetrievalStatus.FOUND, value: build };
  };

  const loadBuilds = (): StorageRetrievalResult<Build[]> => {
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

    return { status: StorageRetrievalStatus.FOUND, value: getBuildsFromLocalStorage() };
  };

  const saveArtifacts = (artifacts: Artifact[]) => {
    localStorage.setItem("artifacts", JSON.stringify(artifacts));
  };

  const saveBuilds = (builds: Build[]) => {
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

    localStorage.setItem("builds", JSON.stringify(builds));
  };

  return (
    <StorageContext.Provider value={{ loadArtifact, loadArtifacts, loadBuild, loadBuilds, saveArtifacts, saveBuilds }}>
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
