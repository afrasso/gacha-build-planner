"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import BuildCard from "@/components/BuildCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDataContext } from "@/contexts/DataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactData, BuildData } from "@/types";

import TopArtifacts from "./TopArtifacts";

interface BuildDetailsProps {
  characterId: string;
}

const BuildDetails: React.FC<BuildDetailsProps> = ({ characterId }) => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const dataContext = useDataContext();
  const { constructBuild } = dataContext;
  const { loadArtifacts, loadBuild, saveBuild } = useStorageContext();

  const [artifacts, setArtifacts] = useState<ArtifactData[]>([]);
  const [build, setBuild] = useState<BuildData>();
  const [calculationCanceled, setCalculationCanceled] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const artifactsRetrievalResult = await loadArtifacts();
      const buildRetrievalResult = await loadBuild(characterId);
      if (buildRetrievalResult.status === StorageRetrievalStatus.NOT_FOUND) {
        setIsLoading(false);
        setIsNotFound(true);
      } else if (
        artifactsRetrievalResult.status === StorageRetrievalStatus.FOUND &&
        buildRetrievalResult.status === StorageRetrievalStatus.FOUND
      ) {
        setArtifacts(artifactsRetrievalResult.value || []);
        setBuild(buildRetrievalResult.value);
        setIsLoading(false);
      }
    };
    load();
  }, [
    authFetch,
    characterId,
    isAuthenticated,
    loadArtifacts,
    loadBuild,
    setArtifacts,
    setBuild,
    setIsLoading,
    setIsNotFound,
    user,
  ]);

  useEffect(() => {
    if (!isLoading && build) {
      saveBuild(build);
    }
  }, [authFetch, build, isAuthenticated, isLoading, saveBuild, user]);

  const lastUpdateTimeRef = useRef<number>(0);

  const callback = useCallback(
    async (p: number) => {
      const now = Date.now();

      if (now - lastUpdateTimeRef.current > 1000) {
        lastUpdateTimeRef.current = now;
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        setCalculationProgress(p);
      }

      return calculationCanceled;
    },
    [calculationCanceled, setCalculationProgress]
  );

  if (isNotFound) {
    return notFound();
  }

  if (isLoading) {
    return <div>Loading build...</div>;
  }

  if (!build) {
    throw new Error("Unexpected event: build was not found after loading.");
  }

  // TODO: Build ID is probably not necessary.
  const updateBuild = (buildId: string, updates: Partial<BuildData>) => {
    setBuild((prev) => {
      if (!prev) {
        throw new Error("Unexpected event: an attempt was made to update an undefined build.");
      }
      return { ...prev, ...updates };
    });
  };

  const startCalculation = async () => {
    setIsCalculating(true);
    // TODO: This needs to be a deep copy before performing a side effect on the artifacts!
    for (const [index, artifact] of artifacts.entries()) {
      await updateAllMetrics({
        artifact: new Artifact(artifact),
        builds: [constructBuild(build)],
        callback: async (p) => await callback((index + p) / artifacts.length),
        dataContext,
        forceRecalculate: true,
        iterations: 1000,
      });
      setCalculationCount(index + 1);
    }
    setCalculationProgress(1);
    setArtifacts([...artifacts]);
    setIsCalculating(false);
  };

  const cancelCalculation = async () => {
    setCalculationCanceled(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={startCalculation}>Update metrics</Button>
      <Button onClick={cancelCalculation}>Cancel</Button>
      <Progress className="w-[60%]" value={calculationProgress * 100} />
      <div>Progress: {Math.round(calculationProgress * 100)}%</div>
      <div>{`${calculationCount} of ${artifacts.length} Complete`}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mt-6 mb-6">Build Details</h1>
          <BuildCard build={build} onUpdate={updateBuild} showInfoButton={false} />
        </div>
        <div>
          <h1 className="text-3xl font-bold mt-6 mb-6">Top Artifacts</h1>
          <TopArtifacts artifacts={artifacts} build={build} showMetrics={!isCalculating} />
        </div>
      </div>
    </div>
  );
};

export default BuildDetails;
