"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  AggregatedArtifactSatisfactionResults,
  calculateSatisfactionForArtifacts,
} from "@/calculators/calculatesatisfactionforartifacts";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactType, Build, Stat } from "@/types";

import ArtifactSatisfactionComponent from "./ArtifactSatisfactionComponent";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { updateAllMetrics } from "@/calculators/artifactmetrics";
import ArtifactCard from "../ArtifactCard";

const ArtifactManager: React.FC = () => {
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifacts, loadBuilds } = useStorageContext();

  // const [artifactSatisfactions, setArtifactSatisfactions] = useState<AggregatedArtifactSatisfactionResults[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [completeCount, setCompleteCount] = useState<number>(0);

  useEffect(() => {
    // TODO: Handle something other than 5 star artifacts.
    const loadedArtifacts = loadArtifacts().value || [];
    const loadedBuilds = loadBuilds().value || [];
    // setArtifactSatisfactions(loadedArtifacts.filter((x) => x.rarity === 5).map((artifact) => ({ artifact })));
    // const myArtifacts = loadedArtifacts.filter((artifact) => artifact.id === "b307e1dd-9262-4df9-b83c-8a5f1d01344e");
    setArtifacts(loadedArtifacts.filter((artifact) => artifact.rarity === 5));
    setBuilds(loadedBuilds);
  }, [loadArtifacts, loadBuilds]);

  // const progressCallback = (curr: number, total: number) => {
  //   setProgress(curr / total);
  // };

  // const updateArtifactSatisfaction = () => {
  //   const calculatedSatisfactions = calculateSatisfactionForArtifacts({
  //     artifacts: artifactSatisfactions.map((artifactSatisfaction) => artifactSatisfaction.artifact),
  //     builds,
  //     genshinDataContext,
  //     numIterations: 50,
  //     progressCallback,
  //   });
  //   setArtifactSatisfactions(calculatedSatisfactions);
  //   setComplete(true);
  // };

  const lastUpdateTimeRef = useRef<number>(0);

  const callback = useCallback(
    async (p: number) => {
      const now = Date.now();

      if (now - lastUpdateTimeRef.current > 1000) {
        lastUpdateTimeRef.current = now;
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        setProgress(p);
      }
    },
    [setProgress]
  );

  const updateMetrics = async () => {
    for (const [index, artifact] of artifacts.entries()) {
      await updateAllMetrics({
        artifact,
        builds,
        callback: async (p) => await callback((index + p) / artifacts.length),
        genshinDataContext,
        iterations: 5,
      });
      setCompleteCount(index + 1);
    }
    setComplete(true);
    setProgress(1);
    setArtifacts([...artifacts]);
  };

  return (
    <div className="container mx-auto">
      {/* <Button onClick={updateArtifactSatisfaction}>Update artifact satisfaction</Button> */}
      <Button onClick={updateMetrics}>Update artifact metrics</Button>
      <Progress className="w-[60%]" value={progress * 100} />
      <div>Progress: {Math.round(progress * 100)}%</div>
      <div>{`${completeCount} of ${artifacts.length} Complete`}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {/* {artifactSatisfactions
          .filter((x) => x.artifact.setId === "15001")
          .filter((x) => x.artifact.mainStat !== Stat.ELEMENTAL_MASTERY)
          .filter((x) => x.artifact.mainStat !== Stat.DEF_PERCENT)
          .filter((x) => x.artifact.type === ArtifactType.FLOWER)
          .sort((b, a) => (a.maxSatisfaction || 0) - (b.maxSatisfaction || 0))
          .map((artifactSatisfaction) => (
            <ArtifactSatisfactionComponent
              artifactSatisfaction={artifactSatisfaction}
              key={artifactSatisfaction.artifact.id}
              showMetrics={complete}
            />
          ))} */}
        {}
        {artifacts.map((artifact) => (
          <ArtifactCard artifact={artifact} artifactType={artifact.type} key={artifact.id} showMetrics={complete} />
        ))}
      </div>
    </div>
  );
};

export default ArtifactManager;
