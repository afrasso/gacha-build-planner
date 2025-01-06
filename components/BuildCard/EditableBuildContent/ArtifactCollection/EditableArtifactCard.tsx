"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Artifact, ArtifactType } from "@/types";

import ArtifactEditor from "./ArtifactEditor";
import ArtifactCard from "@/components/artifacts/ArtifactCard";

interface EditableArtifactCardProps {
  artifact?: Artifact;
  artifactType: ArtifactType;
  onUpdate: (artifact: Artifact) => void;
}

const EditableArtifactCard: React.FC<EditableArtifactCardProps> = ({ artifact, artifactType, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const update = (artifact: Artifact) => {
    onUpdate(artifact);
    setIsDialogOpen(false);
  };

  return (
    <Dialog key={artifactType} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <ArtifactCard artifact={artifact} artifactType={artifactType} onClick={() => setIsDialogOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {artifact ? "Edit" : "Add"} {artifactType} Artifact
          </DialogTitle>
        </DialogHeader>
        <ArtifactEditor artifact={artifact} artifactType={artifactType} onUpdate={update} />
      </DialogContent>
    </Dialog>
  );
};

export default EditableArtifactCard;
