"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { useStorageContext } from "@/contexts/StorageContext";
import { Artifact, Build } from "@/types";

import ArtifactCard from "../ArtifactCard";

const ArtifactManager: React.FC = () => {
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifacts, loadBuilds } = useStorageContext();

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);

  const [calculationComplete, setCalculationComplete] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const [calculationCanceled, setCalculationCanceled] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    // TODO: Handle something other than 5 star artifacts.
    const loadedArtifacts = loadArtifacts().value || [];
    const loadedBuilds = loadBuilds().value || [];
    setArtifacts(loadedArtifacts.filter((artifact) => artifact.rarity === 5));
    setBuilds(loadedBuilds);
  }, [loadArtifacts, loadBuilds]);

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

  return (
    <div className="container mx-auto">
      <Button onClick={startCalculation}>Update metrics</Button>
      <Button onClick={cancelCalculation}>Cancel</Button>
      <Progress className="w-[60%]" value={calculationProgress * 100} />
      <div>Progress: {Math.round(calculationProgress * 100)}%</div>
      <div>{`${calculationCount} of ${artifacts.length} Complete`}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {artifacts.map((artifact) => (
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
