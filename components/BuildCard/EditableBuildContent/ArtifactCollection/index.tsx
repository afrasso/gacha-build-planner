"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Artifact, ArtifactSet, ArtifactType, BuildArtifacts } from "@/types";

import { ArtifactEditor } from "./ArtifactEditor";

interface ArtifactsSelectorProps {
  artifactSets: ArtifactSet[];
}

const ArtifactsSelector: React.FC<ArtifactsSelectorProps> = ({ artifactSets }) => {
  const [buildArtifacts, setBuildArtifacts] = useState<Partial<BuildArtifacts>>();
  const [editingArtifact, setEditingArtifact] = useState<Partial<Artifact>>();
  const [isDialogOpen, setIsDialogOpen] = useState<Record<ArtifactType, boolean>>({
    [ArtifactType.CIRCLET]: false,
    [ArtifactType.FLOWER]: false,
    [ArtifactType.GOBLET]: false,
    [ArtifactType.PLUME]: false,
    [ArtifactType.SANDS]: false,
  });

  const handleSaveArtifact = (artifact: Partial<Artifact>) => {
    const newBuildArtifacts = {
      [ArtifactType.CIRCLET]: buildArtifacts?.[ArtifactType.CIRCLET],
      [ArtifactType.FLOWER]: buildArtifacts?.[ArtifactType.FLOWER],
      [ArtifactType.GOBLET]: buildArtifacts?.[ArtifactType.GOBLET],
      [ArtifactType.PLUME]: buildArtifacts?.[ArtifactType.PLUME],
      [ArtifactType.SANDS]: buildArtifacts?.[ArtifactType.SANDS],
    };
    newBuildArtifacts[artifact.type!] = artifact;
    setBuildArtifacts(newBuildArtifacts);
    setIsDialogOpen((prev) => ({ ...prev, [artifact.type!]: false }));
    setEditingArtifact(undefined);
  };

  const handleEditArtifact = (artifactType: ArtifactType) => {
    const artifact = buildArtifacts?.[artifactType];
    setEditingArtifact(artifact);
  };

  const renderArtifactContent = (artifactType: ArtifactType) => {
    const artifact = buildArtifacts?.[artifactType];
    if (artifact) {
      return (
        <>
          <Image
            alt={artifact?.set?.name || ""}
            className="rounded-md mb-2"
            height={60}
            src={artifact?.set?.iconUrl || "placeholder"}
            width={60}
          />
          <h3 className="font-semibold text-sm text-center">{artifact?.set?.name}</h3>
          <p className="text-xs text-center">{artifactType}</p>
          <p className="font-medium text-xs text-center">{artifact.mainStat}</p>
          <ul className="list-none text-xs mt-1">
            {artifact?.subStats?.map((subStat, index) => (
              <li className="text-center" key={index}>
                {subStat.stat}: {subStat.value}
              </li>
            ))}
          </ul>
        </>
      );
    } else {
      return (
        <>
          <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">+</span>
          </div>
          <p className="text-sm font-medium">{artifactType}</p>
          <p className="text-xs text-muted-foreground">Click to add</p>
        </>
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {[ArtifactType.FLOWER, ArtifactType.PLUME, ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map(
          (artifactType) => (
            <Dialog
              key={artifactType}
              onOpenChange={(open) => {
                setIsDialogOpen((prev) => ({ ...prev, [artifactType]: open }));
                if (!open) setEditingArtifact(undefined);
              }}
              open={isDialogOpen[artifactType]}
            >
              <DialogTrigger asChild>
                <Card
                  className="w-48 h-[180px] cursor-pointer hover:bg-accent"
                  onClick={() => {
                    handleEditArtifact(artifactType);
                    setIsDialogOpen((prev) => ({ ...prev, [artifactType]: true }));
                  }}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                    {renderArtifactContent(artifactType)}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {buildArtifacts?.[artifactType] ? "Edit" : "Add"} {artifactType} Artifact
                  </DialogTitle>
                </DialogHeader>
                <ArtifactEditor
                  artifact={editingArtifact}
                  artifactSets={artifactSets}
                  artifactType={artifactType}
                  onSave={handleSaveArtifact}
                />
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </div>
  );
};

export default ArtifactsSelector;
