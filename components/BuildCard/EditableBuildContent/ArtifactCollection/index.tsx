"use client";

import React from "react";

import ArtifactCard from "@/components/artifacts/ArtifactCard";
import { Label } from "@/components/ui/label";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

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
            <ArtifactCard
              artifact={artifacts[artifactType.key]}
              artifactTypeKey={artifactType.key}
              key={artifactType.key}
              onUpdate={update}
              showInfoButton={true}
              showMetrics={false}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ArtifactsCollection;
