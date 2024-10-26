"use client";

import { X } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { MAIN_STATS_BY_ARTIFACT_TYPE } from "@/constants";
import { ArtifactMainStats, ArtifactType, Stat } from "@/types";

interface DesiredArtifactMainStatsSelectorProps {
  desiredArtifactMainStats: ArtifactMainStats;
  onChange: (desiredArtifactMainStats: ArtifactMainStats) => void;
}

const DesiredArtifactMainStatsSelector = forwardRef<ISaveableContentHandle, DesiredArtifactMainStatsSelectorProps>(
  ({ desiredArtifactMainStats, onChange }, ref) => {
    const [internalDesiredArtifactMainStats, setInternalDesiredArtifactMainStats] =
      useState<ArtifactMainStats>(desiredArtifactMainStats);

    const cancel = () => {
      console.log("Canceling editing of DesiredArtifactMainStatsSelector.");
      setInternalDesiredArtifactMainStats(desiredArtifactMainStats);
    };

    const save = () => {
      console.log("Saving DesiredArtifactMainStatsSelector.");
      if (!validate()) {
        console.error("Saving DesiredArtifactMainStatsSelector failed due to validation error.");
        return false;
      }
      onChange(internalDesiredArtifactMainStats);
      return true;
    };

    const validate = () => {
      console.log("Validating DesiredArtifactMainStatsSelector.");
      return true;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const updateDesiredMainStat = (artifactType: ArtifactType, stat: Stat | undefined) => {
      const newDesiredArtifactMainStats = { ...internalDesiredArtifactMainStats };
      newDesiredArtifactMainStats[artifactType] = stat;
      setInternalDesiredArtifactMainStats(newDesiredArtifactMainStats);
    };

    return (
      <div className="mb-4">
        <Label className="block mb-2">Desired Artifact Main Stats</Label>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
            <div className="flex-1" key={artifactType}>
              <Label className="block mb-1">{artifactType}</Label>
              <div className="flex items-center space-x-2">
                <Select
                  data-testid={artifactType}
                  onValueChange={(value) => updateDesiredMainStat(artifactType, value as Stat)}
                  value={internalDesiredArtifactMainStats[artifactType] || ""}
                >
                  <SelectTrigger className="w-full">
                    {internalDesiredArtifactMainStats[artifactType] || `Select ${artifactType.toLowerCase()} main stat`}
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_STATS_BY_ARTIFACT_TYPE[artifactType].map((stat) => (
                      <SelectItem key={stat.toString()} value={stat.toString()}>
                        {stat.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {internalDesiredArtifactMainStats[artifactType] && (
                  <Button
                    aria-label={`Clear ${artifactType} main stat`}
                    className="h-9 w-9 flex-shrink-0"
                    onClick={() => updateDesiredMainStat(artifactType, undefined)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

DesiredArtifactMainStatsSelector.displayName = "DesiredArtifactMainStatsSelector";

export default DesiredArtifactMainStatsSelector;
