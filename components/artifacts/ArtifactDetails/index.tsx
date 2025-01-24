"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import ArtifactMetrics from "@/components/artifacts/ArtifactManager/ArtifactMetrics";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, Build } from "@/types";

import TopBuilds from "./TopBuilds";

interface ArtifactDetailsProps {
  artifactId: string;
}

const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ artifactId }) => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifact, loadBuilds, saveArtifact } = useStorageContext();

  const [artifact, setArtifact] = useState<Artifact | undefined>();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [complete, setComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const artifactRetrievalResult = await loadArtifact(artifactId);
      if (artifactRetrievalResult.status === StorageRetrievalStatus.NOT_FOUND) {
        setIsLoading(false);
        setIsNotFound(true);
      } else {
        const buildsRetrievalResult = await loadBuilds();
        if (
          artifactRetrievalResult.status === StorageRetrievalStatus.FOUND &&
          buildsRetrievalResult.status === StorageRetrievalStatus.FOUND
        ) {
          setArtifact(artifactRetrievalResult.value);
          setBuilds(buildsRetrievalResult.value || []);
          setIsLoading(false);
        }
      }
    };
    load();
  }, [authFetch, artifactId, isAuthenticated, loadArtifact, loadBuilds, user]);

  useEffect(() => {
    if (!isLoading && artifact) {
      saveArtifact(artifact);
    }
  }, [artifact, authFetch, isAuthenticated, isLoading, saveArtifact, user]);

  const callback = useCallback(
    async (p: number) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      setProgress(p);
    },
    [setProgress]
  );

  if (isNotFound) {
    return notFound();
  }

  if (isLoading) {
    return <div>Loading artifact...</div>;
  }

  if (!artifact) {
    throw new Error("Unexpected event: artifact was not found after loading.");
  }

  const updateMetrics = async () => {
    const startDate = new Date();
    await updateAllMetrics({ artifact, builds, callback, genshinDataContext, iterations: 10000 });
    const endDate = new Date();
    const time = endDate.getTime() - startDate.getTime();
    console.log(`Calculation of metrics for artifact ${artifact.id} complete. Took ${time} ms.`);
    setComplete(true);
    setArtifact((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, metricsResults: artifact.metricsResults };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={updateMetrics}>Update metric calculations</Button>
      <Progress className="w-[60%]" value={progress * 100} />
      <div>Progress: {Math.round(progress * 100)}%</div>
      <h1 className="text-3xl font-bold mb-6">Artifact Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ArtifactCard artifact={artifact} artifactType={artifact!.type} showMetrics={true} size="large" />
        </div>
        {complete && (
          <div>
            <ArtifactMetrics metricsResults={artifact.metricsResults!} />
          </div>
        )}
      </div>
      {complete && <TopBuilds artifact={artifact!} builds={builds} />}
    </div>
  );
};

export default ArtifactDetails;
