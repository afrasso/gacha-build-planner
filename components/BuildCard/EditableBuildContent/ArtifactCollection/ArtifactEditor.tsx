"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAIN_STATS_BY_ARTIFACT_TYPE } from "@/constants";
import { Artifact, ArtifactSet, ArtifactType, Stat, StatValue } from "@/types";

import SubStatsSelector from "./SubStatsSelector";

interface ArtifactEditorProps {
  artifact?: Partial<Artifact>;
  artifactSets: ArtifactSet[];
  artifactType: ArtifactType;
  onUpdate: (artifact: Artifact) => void;
}

export function ArtifactEditor({ artifact, artifactSets, artifactType, onUpdate }: ArtifactEditorProps) {
  const [internalArtifact, setInternalArtifact] = useState<Partial<Artifact>>(artifact || { type: artifactType });

  const save = (artifact: Partial<Artifact>) => {
    onUpdate(artifact as Artifact);
  };

  const updateSubStats = (subStats: StatValue[]) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, subStats }));
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
                setInternalArtifact((prev) => ({ ...prev, set: artifactSet }));
              }
            }}
            value={internalArtifact.set?.id}
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
            onValueChange={(value) => setInternalArtifact({ ...internalArtifact, mainStat: value as Stat })}
            value={internalArtifact.mainStat}
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
        <SubStatsSelector
          mainStat={internalArtifact.mainStat}
          onUpdate={updateSubStats}
          subStats={internalArtifact?.subStats}
        />
        <Button className="w-full mt-4" onClick={() => save(internalArtifact)}>
          Save Artifact
        </Button>
      </div>
    </>
  );
}
