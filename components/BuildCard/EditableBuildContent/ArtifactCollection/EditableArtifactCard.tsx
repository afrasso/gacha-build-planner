"use client";

import React, { useState } from "react";

import ArtifactCard from "@/components/artifacts/ArtifactCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArtifactData } from "@/types";

import ArtifactEditor from "./ArtifactEditor";

interface EditableArtifactCardProps {
  artifact?: ArtifactData;
  artifactTypeKey: string;
  onUpdate: (artifact: ArtifactData) => void;
}

const EditableArtifactCard: React.FC<EditableArtifactCardProps> = ({ artifact, artifactTypeKey, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const update = (artifact: ArtifactData) => {
    onUpdate(artifact);
    setIsDialogOpen(false);
  };

  return (
    <Dialog key={artifactTypeKey} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <ArtifactCard
        artifact={artifact}
        artifactTypeKey={artifactTypeKey}
        onEdit={() => setIsDialogOpen(true)}
        showInfoButton={true}
        showMetrics={false}
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {artifact ? "Edit" : "Add"} {artifactTypeKey} Artifact
          </DialogTitle>
        </DialogHeader>
        <ArtifactEditor artifact={artifact} artifactTypeKey={artifactTypeKey} onUpdate={update} />
      </DialogContent>
    </Dialog>
  );
};

export default EditableArtifactCard;
