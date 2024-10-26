"use client";

import { MinusCircle, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface ArtifactEditorProps {
  artifact: Artifact;
  onSave: (artifact: Artifact) => void;
}

const artifactSets = ["Gladiator's Finale", "Wanderer's Troupe", "Noblesse Oblige", "Viridescent Venerer"];
const mainStats = {
  Circlet: ["HP%", "ATK%", "DEF%", "Elemental Mastery", "CRIT Rate", "CRIT DMG", "Healing Bonus"],
  Flower: ["HP"],
  Goblet: [
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "Pyro DMG",
    "Hydro DMG",
    "Cryo DMG",
    "Electro DMG",
    "Anemo DMG",
    "Geo DMG",
    "Dendro DMG",
    "Physical DMG",
  ],
  Plume: ["ATK"],
  Sands: ["HP%", "ATK%", "DEF%", "Energy Recharge", "Elemental Mastery"],
};
const subStats = [
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
  "Energy Recharge",
  "Elemental Mastery",
  "CRIT Rate",
  "CRIT DMG",
];

export function ArtifactEditor({ artifact, onSave }: ArtifactEditorProps) {
  const [editedArtifact, setEditedArtifact] = useState<Artifact>(artifact);

  useEffect(() => {
    setEditedArtifact(artifact);
  }, [artifact]);

  const updateSubStat = (index: number, field: "stat" | "value", value: string) => {
    const newSubStats = [...editedArtifact.subStats];
    newSubStats[index] = { ...newSubStats[index], [field]: value };
    setEditedArtifact({ ...editedArtifact, subStats: newSubStats });
  };

  const addSubStat = () => {
    if (editedArtifact.subStats.length < 4) {
      setEditedArtifact({
        ...editedArtifact,
        subStats: [...editedArtifact.subStats, { stat: "", value: "" }],
      });
    }
  };

  const removeSubStat = (index: number) => {
    const newSubStats = [...editedArtifact.subStats];
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
          onValueChange={(value) => setEditedArtifact({ ...editedArtifact, set: value })}
          value={editedArtifact.set}
        >
          <SelectTrigger className="h-8" id="artifact-set">
            <SelectValue placeholder="Select Set" />
          </SelectTrigger>
          <SelectContent>
            {artifactSets.map((set) => (
              <SelectItem key={set} value={set}>
                {set}
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
          onValueChange={(value) => setEditedArtifact({ ...editedArtifact, mainStat: value })}
          value={editedArtifact.mainStat}
        >
          <SelectTrigger className="h-8" id="main-stat">
            <SelectValue placeholder="Select Main Stat" />
          </SelectTrigger>
          <SelectContent>
            {mainStats[editedArtifact.type as keyof typeof mainStats].map((stat) => (
              <SelectItem key={stat} value={stat}>
                {stat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Sub Stats</Label>
        {editedArtifact.subStats.map((subStat, index) => (
          <div className="mt-1 flex space-x-1 items-center" key={index}>
            <Select onValueChange={(value) => updateSubStat(index, "stat", value)} value={subStat.stat}>
              <SelectTrigger className="h-8 w-1/2">
                <SelectValue placeholder={`Sub Stat ${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {subStats.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-8 w-1/3"
              onChange={(e) => updateSubStat(index, "value", e.target.value)}
              placeholder="Value"
              type="text"
              value={subStat.value}
            />
            <Button className="h-8 w-8 p-0" onClick={() => removeSubStat(index)} size="icon" variant="ghost">
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {editedArtifact.subStats.length < 4 && (
          <Button className="mt-1 h-8 text-xs" onClick={addSubStat} size="sm" variant="outline">
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Sub Stat
          </Button>
        )}
      </div>
      <Button className="w-full mt-4" onClick={() => onSave(editedArtifact)}>
        Save Artifact
      </Button>
    </div>
  );
}
