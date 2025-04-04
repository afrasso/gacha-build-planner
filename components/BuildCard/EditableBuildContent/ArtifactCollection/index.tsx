"use client";

import React from "react";

import { Label } from "@/components/ui/label";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

import EditableArtifactCard from "./EditableArtifactCard";

interface ArtifactsCollectionProps {
  artifacts: Record<string, ArtifactData>;
  onUpdate: (artifacts: Record<string, ArtifactData>) => void;
}

const ArtifactsCollection: React.FC<ArtifactsCollectionProps> = ({ artifacts, onUpdate }) => {
  const { getArtifactTypes } = useDataContext();

  const update = (artifact: ArtifactData) => {
    const newArtifacts = { ...artifacts, [artifact.typeKey]: artifact };
    onUpdate(newArtifacts);
  };

  return (
    <>
      <Label className="text-md font-semibold text-primary whitespace-nowrap mb-2 block">Artifacts:</Label>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          {getArtifactTypes().map((artifactType) => (
            <EditableArtifactCard
              artifact={artifacts[artifactType.key]}
              artifactTypeKey={artifactType.key}
              key={artifactType.key}
              onUpdate={update}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ArtifactsCollection;
