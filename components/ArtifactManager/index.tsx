"use client";

import { useEffect, useState } from "react";

import ArtifactSatisfactionComponent from "./ArtifactSatisfactionComponent";
import { useStorageContext } from "@/contexts/StorageContext";
import { Artifact, Build } from "@/types";
import { rollArtifact } from "@/buildhelpers/rollartifact";
import { calculateBuildSatisfaction } from "@/buildhelpers/calculatebuildsatisfaction";
import { ArtifactSatisfaction } from "./types";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const ArtifactManager: React.FC = () => {
  const { loadArtifacts, loadBuilds } = useStorageContext();

  const [artifactSatisfactions, setArtifactSatisfactions] = useState<ArtifactSatisfaction[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    const loadedArtifacts = loadArtifacts();
    const loadedBuilds = loadBuilds();
    setArtifactSatisfactions(
      loadedArtifacts.map((artifact) => ({ artifact, satisfaction: { overall: Math.random(), builds: {} } }))
    );
    setBuilds(loadedBuilds);
  }, []);

  const updateArtifactSatisfaction = () => {
    const numIterations = 1;
    const totalCalculations = numIterations * artifactSatisfactions.length * builds.length;
    let currentCalculations = 0;

    for (const artifactSatisfaction of artifactSatisfactions) {
      const artifact = artifactSatisfaction.artifact;
      const results = {} as Record<string, { satisfied: number; total: number }>;
      for (let i = 0; i < numIterations; i++) {
        const rolledArtifact = rollArtifact(artifact);
        for (const build of builds) {
          if (!results[build.character.id]) {
            results[build.character.id] = {
              satisfied: 0,
              total: 0,
            };
          }
          results[build.character.id].total++;
          const artifacts = { ...build.artifacts, [rolledArtifact.type]: rolledArtifact };
          const modifiedBuild = { ...build, artifacts };
          const { overallSatisfaction } = calculateBuildSatisfaction({ build: modifiedBuild });
          if (overallSatisfaction) {
            results[build.character.id].satisfied += 1;
          }
          currentCalculations++;
          if (currentCalculations % 100 == 0) {
            setProgress((currentCalculations / totalCalculations) * 100);
          }
        }
      }
      let maxSatisfaction = 0;
      for (const characterId in results) {
        const satisfactionRating = results[characterId].satisfied / results[characterId].total;
        if (maxSatisfaction < satisfactionRating) {
          maxSatisfaction = satisfactionRating;
        }
      }
      artifactSatisfaction.satisfaction = { overall: maxSatisfaction, builds: {} };
    }
  };

  return (
    <div className="container mx-auto">
      <Button onClick={updateArtifactSatisfaction}>Update artifact satisfaction</Button>
      <Progress value={progress} className="w-[60%]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {artifactSatisfactions
          .sort((a, b) => (a.satisfaction?.overall || 0) - (b.satisfaction?.overall || 0))
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
