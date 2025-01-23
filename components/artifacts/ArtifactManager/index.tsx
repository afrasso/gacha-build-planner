"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactMetric, Build } from "@/types";

import ArtifactCard from "../ArtifactCard";

const ArtifactManager: React.FC = () => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifacts, loadBuilds, saveArtifacts } = useStorageContext();

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [artifactSort, setArtifactSort] = useState<ArtifactSort>("RARITY");
  const [builds, setBuilds] = useState<Build[]>([]);
  const [calculationCanceled, setCalculationCanceled] = useState<boolean>(false);
  const [calculationComplete, setCalculationComplete] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const artifactsRetrievalResult = loadArtifacts();
    const buildsRetrievalResult = loadBuilds();
    if (
      artifactsRetrievalResult.status === StorageRetrievalStatus.FOUND &&
      buildsRetrievalResult.status === StorageRetrievalStatus.FOUND
    ) {
      const loadedArtifacts = artifactsRetrievalResult.value || [];
      setArtifacts(loadedArtifacts);
      const loadedBuilds = buildsRetrievalResult.value || [];
      setBuilds(loadedBuilds);
      setIsLoading(false);
    }
  }, [authFetch, isAuthenticated, loadArtifacts, loadBuilds, user]);

  useEffect(() => {
    if (!isLoading) {
      saveArtifacts(artifacts);
    }
  }, [authFetch, artifacts, isAuthenticated, isLoading, saveArtifacts, user]);

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

  if (isLoading) {
    return <div>Loading artifacts...</div>;
  }

  const startCalculation = async () => {
    for (const [index, artifact] of artifacts.entries()) {
      await updateAllMetrics({
        artifact,
        builds,
        callback: async (p) => await callback((index + p) / artifacts.length),
        genshinDataContext,
        iterations: 5,
      });
      setCalculationCount(index + 1);
    }
    setCalculationComplete(true);
    setCalculationProgress(1);
    setArtifacts([...artifacts]);
  };

  const cancelCalculation = async () => {
    setCalculationCanceled(true);
  };

  type ArtifactSort = "LEVEL" | "RARITY" | ArtifactMetric;

  const sortByMetric = (metric: ArtifactMetric): Artifact[] => {
    return artifacts.sort((a, b) => {
      const aValue = a.metricsResults[metric].maxValue;
      const bValue = b.metricsResults[metric].maxValue;
      if (!aValue && !bValue) {
        return 0;
      }
      if (!aValue) {
        return 1;
      }
      if (!bValue) {
        return -1;
      }
      return bValue - aValue;
    });
  };

  const updateArtifactSort = (artifactSort: ArtifactSort) => {
    setArtifactSort(artifactSort);
  };

  const getSortedArtifacts = (): Artifact[] => {
    switch (artifactSort) {
      case ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS:
      case ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS:
      case ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS:
      case ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS:
      case ArtifactMetric.PLUS_MINUS:
      case ArtifactMetric.RATING:
        return sortByMetric(artifactSort);
      case "LEVEL":
        return artifacts.sort((a, b) => b.level - a.level);
      case "RARITY":
        return artifacts.sort((a, b) => b.rarity - a.rarity);
      default:
        throw new Error(`Unexpetged artifact sort encountered: ${artifactSort}`);
    }
  };

  return (
    <div className="container mx-auto">
      <Button onClick={startCalculation}>Update metrics</Button>
      <Button onClick={cancelCalculation}>Cancel</Button>
      <Progress className="w-[60%]" value={calculationProgress * 100} />
      <div>Progress: {Math.round(calculationProgress * 100)}%</div>
      <div>{`${calculationCount} of ${artifacts.length} Complete`}</div>
      <Select onValueChange={(artifactSort: ArtifactSort) => updateArtifactSort(artifactSort)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort artifacts by" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ArtifactMetric).map((metric) => (
            <SelectItem key={metric} value={metric}>
              {metric}
            </SelectItem>
          ))}
          {["OVERALL", "LEVEL", "RARITY"].map((artifactSort) => (
            <SelectItem key={artifactSort} value={artifactSort}>
              {artifactSort}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {getSortedArtifacts().map((artifact) => (
          <ArtifactCard
            artifact={artifact}
            artifactType={artifact.type}
            key={artifact.id}
            onClick={() => router.push(`/genshin/artifacts/${artifact.id}`)}
            showMetrics={calculationComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtifactManager;
