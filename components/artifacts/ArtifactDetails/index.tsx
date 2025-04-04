"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDataContext } from "@/contexts/DataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactData, BuildData } from "@/types";

import TopBuilds from "./TopBuilds";

interface ArtifactDetailsProps {
  artifactId: string;
}

const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ artifactId }) => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const dataContext = useDataContext();
  const { constructBuild } = dataContext;
  const { loadArtifact, loadBuilds, saveArtifact } = useStorageContext();

  const [artifact, setArtifact] = useState<ArtifactData | undefined>();
  const [builds, setBuilds] = useState<BuildData[]>([]);
  const [inProgress, setInProgress] = useState<boolean>(false);
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
    setInProgress(true);
    const startDate = new Date();
    await updateAllMetrics({
      artifact: new Artifact(artifact),
      builds: builds.map(constructBuild),
      callback,
      dataContext,
      iterations: 1000,
    });
    const endDate = new Date();
    const time = endDate.getTime() - startDate.getTime();
    console.log(`Calculation of metrics for artifact ${artifact.id} complete. Took ${time} ms.`);
    setInProgress(false);
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
      <div className="flex gap-8">
        <div>
          <h1 className="text-3xl font-bold mt-6 mb-6">Artifact Details</h1>
          <ArtifactCard
            artifact={artifact}
            artifactTypeKey={artifact!.typeKey}
            showInfoButton={false}
            showMetrics={true}
            size="large"
          />
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-bold mt-6 mb-6">Top Builds</h1>
          {!inProgress && <TopBuilds artifact={artifact} builds={builds} />}
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetails;
