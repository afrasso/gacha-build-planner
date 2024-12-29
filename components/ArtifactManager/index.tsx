"use client";

import { useEffect, useState } from "react";

import {
  AggregatedArtifactSatisfactionResults,
  calculateSatisfactionForArtifacts,
} from "@/buildhelpers/calculatesatisfactionforartifacts";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { useStorageContext } from "@/contexts/StorageContext";
import { ArtifactType, Build, Stat } from "@/types";

import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import ArtifactSatisfactionComponent from "./ArtifactSatisfactionComponent";
// import { ArtifactSatisfaction } from "./types";

const ArtifactManager: React.FC = () => {
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifacts, loadBuilds } = useStorageContext();

  const [artifactSatisfactions, setArtifactSatisfactions] = useState<AggregatedArtifactSatisfactionResults[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    const loadedArtifacts = loadArtifacts();
    const loadedBuilds = loadBuilds();
    setArtifactSatisfactions(loadedArtifacts.map((artifact) => ({ artifact })));
    setBuilds(loadedBuilds);
  }, [loadArtifacts, loadBuilds]);

  const progressCallback = (curr: number, total: number) => {
    setProgress(curr / total);
  };

  const updateArtifactSatisfaction = () => {
    const calculatedSatisfactions = calculateSatisfactionForArtifacts({
      artifacts: artifactSatisfactions.map((artifactSatisfaction) => artifactSatisfaction.artifact),
      builds,
      genshinDataContext,
      numIterations: 50,
      progressCallback,
    });
    setArtifactSatisfactions(calculatedSatisfactions);
  };

  return (
    <div className="container mx-auto">
      <Button onClick={updateArtifactSatisfaction}>Update artifact satisfaction</Button>
      <Progress className="w-[60%]" value={progress} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {artifactSatisfactions
          .filter((x) => x.artifact.setId === "15001")
          .filter((x) => x.artifact.mainStat !== Stat.ELEMENTAL_MASTERY)
          .filter((x) => x.artifact.mainStat !== Stat.DEF_PERCENT)
          .filter((x) => x.artifact.type === ArtifactType.FLOWER)
          .sort((b, a) => (a.maxSatisfaction || 0) - (b.maxSatisfaction || 0))
          .map((artifactSatisfaction) => (
            <ArtifactSatisfactionComponent
              artifactSatisfaction={artifactSatisfaction}
              key={artifactSatisfaction.artifact.id}
            />
          ))}
      </div>
    </div>
  );
};

export default ArtifactManager;
