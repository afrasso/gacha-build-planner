"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { updateAllMetrics } from "@/calculators/artifactmetrics";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import ArtifactMetrics from "@/components/artifacts/ArtifactManager/ArtifactMetrics";
import TopBuilds from "./TopBuilds";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactMetric, Build } from "@/types";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEnumValues } from "@/utils/getenumvalues";

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

  const logMetrics = (metricType: ArtifactMetric) => {
    const metrics = artifact.metrics?.[metricType];
    if (!metrics) {
      console.log(`${metricType} is undefined`);
    }
    const topMetrics = Object.entries(metrics!)
      .filter((x) => x[1].result)
      .sort((a, b) => b[1].result - a[1].result);
    console.log(topMetrics);
    console.log(builds.filter((b) => topMetrics.map((x) => x[0]).includes(b.characterId)));
  };

  const updateMetrics = async () => {
    await updateAllMetrics({ artifact, builds, callback, genshinDataContext, iterations: 100 });
    setComplete(true);
    setArtifact((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, metrics: artifact.metrics };
    });
    logMetrics(ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={updateMetrics}>Update metric calculations</Button>
      <Progress className="w-[60%]" value={progress * 100} />
      <div>Progress: {Math.round(progress * 100)}%</div>
      <h1 className="text-3xl font-bold mb-6">Artifact Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ArtifactCard artifact={artifact} artifactType={artifact!.type} size="large" />
        </div>
        {complete && (
          <div>
            <ArtifactMetrics artifact={artifact!} />
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
