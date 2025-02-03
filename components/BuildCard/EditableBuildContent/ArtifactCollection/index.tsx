"use client";

import React from "react";

import { Label } from "@/components/ui/label";
import { Artifact, ArtifactType, BuildArtifacts } from "@/types";

import EditableArtifactCard from "./EditableArtifactCard";

interface ArtifactsCollectionProps {
  artifacts: BuildArtifacts;
  onUpdate: (artifacts: BuildArtifacts) => void;
}

const ArtifactsCollection: React.FC<ArtifactsCollectionProps> = ({ artifacts, onUpdate }) => {
  const update = (artifact: Artifact) => {
    const newArtifacts = { ...artifacts, [artifact.type]: artifact };
    onUpdate(newArtifacts);
  };

  return (
    <>
      <Label className="text-md font-semibold text-primary whitespace-nowrap mb-2 block">Artifacts:</Label>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          {[ArtifactType.FLOWER, ArtifactType.PLUME, ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map(
            (artifactType) => (
              <EditableArtifactCard
                artifact={artifacts[artifactType]}
                artifactType={artifactType}
                key={artifactType}
                onUpdate={update}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ArtifactsCollection;
