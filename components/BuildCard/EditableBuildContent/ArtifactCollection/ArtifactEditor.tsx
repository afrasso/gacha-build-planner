"use client";

import { MinusCircle, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Artifact, ArtifactSet, Stat } from "@/types";

interface ArtifactEditorProps {
  artifact: Partial<Artifact>;
  artifactSets: ArtifactSet[];
  onSave: (artifact: Artifact) => void;
}

export function ArtifactEditor({ artifact, artifactSets, onSave }: ArtifactEditorProps) {
  const [editedArtifact, setEditedArtifact] = useState(artifact || {});

  useEffect(() => {
    setEditedArtifact(artifact);
  }, [artifact]);

  const handleSave = (artifact: Partial<Artifact>) => {
    onSave(artifact as Artifact);
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
    <div className="space-y-2">
      <div>
        <Label className="text-xs" htmlFor="artifact-set">
          Set
        </Label>
        <Select
          onValueChange={(value) => {
            const artifactSet = artifactSets.find((artifactSet) => artifactSet.id === value);
            if (artifactSet) {
              setEditedArtifact({ ...editedArtifact, set: artifactSet });
            }
          }}
          value={editedArtifact.set?.id}
        >
          <SelectTrigger className="h-8" id="artifact-set">
            <SelectValue placeholder="Select Set" />
          </SelectTrigger>
          <SelectContent>
            {artifactSets.map((artifactSet) => (
              <SelectItem key={artifactSet.id} value={artifactSet.id}>
                {artifactSet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs" htmlFor="main-stat">
          Main Stat
        </Label>
        <Select
          onValueChange={(value) => setEditedArtifact({ ...editedArtifact, mainStat: value as Stat })}
          value={editedArtifact.mainStat}
        >
          <SelectTrigger className="h-8" id="main-stat">
            <SelectValue placeholder="Select Main Stat" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Stat).map((stat: Stat) => (
              <SelectItem key={stat} value={stat}>
                {stat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Sub Stats</Label>
        {editedArtifact.subStats?.map((subStat, index) => (
          <div className="mt-1 flex space-x-1 items-center" key={index}>
            <Select onValueChange={(value) => updateSubStatStat(index, value as Stat)} value={subStat.stat}>
              <SelectTrigger className="h-8 w-1/2">
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
              className="h-8 w-1/3"
              onChange={(e) => updateSubStatValue(index, e.target.value ? undefined : parseFloat(e.target.value))}
              placeholder="Value"
              type="text"
              value={subStat.value}
            />
            <Button className="h-8 w-8 p-0" onClick={() => removeSubStat(index)} size="icon" variant="ghost">
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {editedArtifact.subStats && editedArtifact.subStats.length < 4 && (
          <Button className="mt-1 h-8 text-xs" onClick={addSubStat} size="sm" variant="outline">
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Sub Stat
          </Button>
        )}
      </div>
      <Button className="w-full mt-4" onClick={() => handleSave(editedArtifact)}>
        Save Artifact
      </Button>
    </div>
  );
}
