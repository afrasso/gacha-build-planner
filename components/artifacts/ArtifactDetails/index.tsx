"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { updateAllMetrics } from "@/calculators/artifactmetrics";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import ArtifactMetrics from "@/components/artifacts/ArtifactManager/ArtifactMetrics";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactMetric, Build } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

import TopBuilds from "./TopBuilds";
import MetricChart from "./MetricChart";

interface ArtifactDetailsProps {
  artifactId: string;
}

const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ artifactId }) => {
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifact, loadBuilds } = useStorageContext();

  const [artifact, setArtifact] = useState<Artifact | undefined>();
  const [artifactRetrievalStatus, setArtifactRetrievalStatus] = useState<StorageRetrievalStatus>(
    StorageRetrievalStatus.LOADING
  );
  const [builds, setBuilds] = useState<Build[]>([]);
  const [buildsRetrievalStatus, setBuildsRetrievalStatus] = useState<StorageRetrievalStatus>(
    StorageRetrievalStatus.LOADING
  );
  const [progress, setProgress] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);

  const [topBuildsMetric, setTopBuildsMetric] = useState<ArtifactMetric>(ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS);

  useEffect(() => {
    const artifactRetrievalResult = loadArtifact(artifactId);
    setArtifact(artifactRetrievalResult.value);
    setArtifactRetrievalStatus(artifactRetrievalResult.status);
    const buildsRetrievalResult = loadBuilds();
    setBuilds(buildsRetrievalResult.value || []);
    setBuildsRetrievalStatus(buildsRetrievalResult.status);
  }, [artifactId, loadArtifact, loadBuilds]);

  const callback = useCallback(
    async (p: number) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      setProgress(p);
    },
    [setProgress]
  );

  if (artifactRetrievalStatus === StorageRetrievalStatus.NOT_FOUND) {
    return notFound();
  }

  if (
    artifactRetrievalStatus === StorageRetrievalStatus.LOADING ||
    buildsRetrievalStatus === StorageRetrievalStatus.LOADING
  ) {
    return <div>Loading artifact...</div>;
  }

  if (!artifact) {
    throw new Error("Unexpected event: artifact was not found after loading.");
  }

  const updateMetrics = async () => {
    const startDate = new Date();
    await updateAllMetrics({ artifact, builds, callback, genshinDataContext, iterations: 100 });
    const endDate = new Date();
    const time = endDate.getTime() - startDate.getTime();
    console.log(`Calculation of metrics for artifact ${artifact.id} complete. Took ${time} ms.`);
    setComplete(true);
    setArtifact((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, metricResults: artifact.metricResults };
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
          <ArtifactCard artifact={artifact} artifactType={artifact!.type} showMetrics={complete} size="large" />
        </div>
        {complete && (
          <div>
            <ArtifactMetrics metricResults={artifact.metricResults!} />
          </div>
        )}
      </div>
      {complete && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Top Builds for This Artifact</h2>
          <Select onValueChange={(metric) => setTopBuildsMetric(metric as ArtifactMetric)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              {getEnumValues(ArtifactMetric).map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <TopBuilds artifact={artifact!} builds={builds} topBuildsMetric={topBuildsMetric} /> */}
        </div>
      )}
    </div>
  );
};

export default ArtifactDetails;
