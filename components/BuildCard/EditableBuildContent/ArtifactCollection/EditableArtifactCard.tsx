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
    <>
      {/* This overlay blocks background clicks, since the having modal={true} is broken in firefox. See
      https://github.com/radix-ui/primitives/issues/2390. It can be deleted once that issue is solved. */}
      {isDialogOpen && <div aria-hidden="true" className="fixed inset-0 bg-black/50 z-40" />}

      <Dialog key={artifactTypeKey} modal={false} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <ArtifactCard
          artifact={artifact}
          artifactTypeKey={artifactTypeKey}
          onEdit={() => setIsDialogOpen(true)}
          showInfoButton={true}
          showMetrics={false}
        />
        <DialogContent
          className="sm:max-w-[425px]"
          // This prevents the dialog from closing when they click the overlay. Not needed when the modal flag is
          // removed.
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {artifact ? "Edit" : "Add"} {artifactTypeKey} Artifact
            </DialogTitle>
          </DialogHeader>
          <ArtifactEditor artifact={artifact} artifactTypeKey={artifactTypeKey} onUpdate={update} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableArtifactCard;
