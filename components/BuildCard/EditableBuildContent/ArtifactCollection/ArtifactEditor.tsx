"use client";

import { PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAIN_STATS_BY_ARTIFACT_TYPE } from "@/constants";
import { Artifact, ArtifactSet, ArtifactType, Stat } from "@/types";

interface ArtifactEditorProps {
  artifact?: Partial<Artifact>;
  artifactSets: ArtifactSet[];
  artifactType: ArtifactType;
  onSave: (artifact: Partial<Artifact>) => void;
}

export function ArtifactEditor({ artifact, artifactSets, artifactType, onSave }: ArtifactEditorProps) {
  const [editedArtifact, setEditedArtifact] = useState(artifact || { type: artifactType });

  const handleSave = (artifact: Partial<Artifact>) => {
    onSave(artifact);
  };

  const updateSubStatStat = (index: number, stat: Stat) => {
    const newSubStats = editedArtifact.subStats ? [...editedArtifact.subStats] : [];
    if (newSubStats?.[index]) {
      newSubStats[index].stat = stat;
      setEditedArtifact({ ...editedArtifact, subStats: newSubStats });
    } else {
      console.error("Something went wrong.");
    }
  };

  const updateSubStatValue = (index: number, value: number | undefined) => {
    const newSubStats = editedArtifact.subStats ? [...editedArtifact.subStats] : [];
    if (newSubStats?.[index]) {
      newSubStats[index].value = value;
      setEditedArtifact({ subStats: newSubStats });
    } else {
      console.error("Something went wrong.");
    }
  };

  const addSubStat = () => {
    const newSubStats = editedArtifact.subStats ? [...editedArtifact.subStats] : [];
    if (newSubStats.length < 4) {
      setEditedArtifact({
        ...editedArtifact,
        subStats: [...newSubStats, {}],
      });
    }
  };

  const removeSubStat = (index: number) => {
    const newSubStats = editedArtifact.subStats ? [...editedArtifact.subStats] : [];
    newSubStats.splice(index, 1);
    setEditedArtifact({ ...editedArtifact, subStats: newSubStats });
  };

  return (
    <>
      <div className="space-y-2">
        <div>
          <Label className="text-s font-semibold" htmlFor="artifact-set">
            Set
          </Label>
          <Select
            onValueChange={(value) => {
              const artifactSet = artifactSets.find((artifactSet) => artifactSet.id === value);
              if (artifactSet) {
                setEditedArtifact((prev) => ({ ...prev, set: artifactSet }));
              }
            }}
            value={editedArtifact.set?.id}
          >
            <SelectTrigger className="h-8" id="artifact-set">
              <SelectValue placeholder="Select set" />
            </SelectTrigger>
            <SelectContent>
              {artifactSets
                .filter((artifactSet) => artifactSet.hasArtifactTypes[artifactType])
                .map((artifactSet) => (
                  <SelectItem className="flex items-center" key={artifactSet.id} value={artifactSet.id}>
                    <div className="flex items-center">
                      <Image
                        alt={artifactSet.name}
                        className="mr-2"
                        height={32}
                        src={artifactSet.iconUrls[artifactType]}
                        width={32}
                      />
                      {artifactSet.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-s font-semibold" htmlFor="main-stat">
            Main Stat
          </Label>
          <Select
            onValueChange={(value) => setEditedArtifact({ ...editedArtifact, mainStat: value as Stat })}
            value={editedArtifact.mainStat}
          >
            <SelectTrigger className="h-8" id="main-stat">
              <SelectValue placeholder="Select main stat" />
            </SelectTrigger>
            <SelectContent>
              {MAIN_STATS_BY_ARTIFACT_TYPE[artifactType].map((stat: Stat) => (
                <SelectItem key={stat} value={stat}>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <Label className="text-s font-semibold">Sub Stats</Label>
            {(!editedArtifact.subStats || editedArtifact.subStats.length < 4) && (
              <Button className="h-9 w-9" onClick={addSubStat} size="icon" variant="ghost">
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          {editedArtifact.subStats?.map((subStat, index) => (
            <div className="mt-1 flex items-center space-x-2" key={index}>
              <div className="flex-grow flex space-x-2">
                <Select onValueChange={(value) => updateSubStatStat(index, value as Stat)} value={subStat.stat}>
                  <SelectTrigger className="h-8 flex-grow">
                    <SelectValue placeholder={`Sub Stat ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Stat).map((stat: Stat) => (
                      <SelectItem key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="h-8 w-24 flex-shrink-0"
                  onChange={(e) => updateSubStatValue(index, e.target.value ? undefined : parseFloat(e.target.value))}
                  placeholder="Value"
                  type="text"
                  value={subStat.value}
                />
              </div>
              <Button
                className="h-9 w-9 p-0 flex-shrink-0"
                onClick={() => removeSubStat(index)}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" onClick={() => handleSave(editedArtifact)}>
          Save Artifact
        </Button>
      </div>
    </>
  );
}
