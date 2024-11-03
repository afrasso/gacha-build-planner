"use client";

import React from "react";

import { Artifact, ArtifactSet, ArtifactType, BuildArtifacts } from "@/types";

import EditableArtifactCard from "./EditableArtifactCard";

interface ArtifactsCollectionProps {
  artifacts: BuildArtifacts;
  artifactSets: ArtifactSet[];
  onUpdate: (artifacts: BuildArtifacts) => void;
}

const ArtifactsCollection: React.FC<ArtifactsCollectionProps> = ({ artifacts, artifactSets, onUpdate }) => {
  const update = (artifact: Artifact) => {
    const newArtifacts = { ...artifacts, [artifact.type]: artifact };
    onUpdate(newArtifacts);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {[ArtifactType.FLOWER, ArtifactType.PLUME, ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map(
          (artifactType) => (
            <EditableArtifactCard
              artifact={artifacts[artifactType]}
              artifactSets={artifactSets}
              artifactType={artifactType}
              key={artifactType}
              onUpdate={update}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ArtifactsCollection;
