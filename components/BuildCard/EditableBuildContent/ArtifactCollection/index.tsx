"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { ArtifactEditor } from "./ArtifactEditor";

interface SubStat {
  stat: string;
  value: string;
}

interface Artifact {
  id: string;
  mainStat: string;
  set: string;
  subStats: SubStat[];
  type: string;
}

const artifactTypes = ["Flower", "Plume", "Sands", "Goblet", "Circlet"];

export function ArtifactCollection() {
  const [artifacts, setArtifacts] = useState<Record<string, Artifact | null>>({
    Circlet: null,
    Flower: null,
    Goblet: null,
    Plume: null,
    Sands: null,
  });
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);

  const handleSaveArtifact = (updatedArtifact: Artifact) => {
    setArtifacts((prev) => ({
      ...prev,
      [updatedArtifact.type]: updatedArtifact,
    }));
    setEditingArtifact(null);
  };

  const handleEditArtifact = (type: string) => {
    const artifact = artifacts[type];
    if (artifact) {
      setEditingArtifact(artifact);
    } else {
      setEditingArtifact({
        id: type,
        mainStat: "",
        set: "",
        subStats: [],
        type: type,
      });
    }
  };

  const renderArtifactContent = (type: string) => {
    const artifact = artifacts[type];
    if (artifact) {
      return (
        <>
          <Image
            alt={artifact.set}
            className="rounded-md mb-2"
            height={60}
            src={`/placeholder.svg?height=60&width=60`}
            width={60}
          />
          <h3 className="font-semibold text-sm text-center">{artifact.set}</h3>
          <p className="text-xs text-center">{type}</p>
          <p className="font-medium text-xs text-center">{artifact.mainStat}</p>
          <ul className="list-none text-xs mt-1">
            {artifact.subStats.map((subStat, index) => (
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
          <p className="text-sm font-medium">{type}</p>
          <p className="text-xs text-muted-foreground">Click to add</p>
        </>
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {artifactTypes.map((type) => (
          <Dialog
            key={type}
            onOpenChange={(open) => !open && setEditingArtifact(null)}
            open={editingArtifact?.type === type}
          >
            <DialogTrigger asChild>
              <Card className="w-48 h-[180px] cursor-pointer hover:bg-accent" onClick={() => handleEditArtifact(type)}>
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  {renderArtifactContent(type)}
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {artifacts[type] ? "Edit" : "Add"} {type} Artifact
                </DialogTitle>
              </DialogHeader>
              {editingArtifact && <ArtifactEditor artifact={editingArtifact} onSave={handleSaveArtifact} />}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
