"use client";

import { Check, Pencil, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAIN_STATS_BY_ARTIFACT_TYPE } from "@/constants";
import { ArtifactMainStats, ArtifactType, Stat } from "@/types";

interface DesiredArtifactMainStatsSelectorProps {
  desiredArtifactMainStats: ArtifactMainStats;
  onChange: (desiredArtifactMainStats: ArtifactMainStats) => void;
}

const DesiredArtifactMainStatsSelector = forwardRef<ISaveableContentHandle, DesiredArtifactMainStatsSelectorProps>(
  ({ desiredArtifactMainStats, onChange }, ref) => {
    const [editingStates, setEditingStates] = useState<Record<ArtifactType, boolean>>({
      [ArtifactType.CIRCLET]: false,
      [ArtifactType.FLOWER]: false,
      [ArtifactType.GOBLET]: false,
      [ArtifactType.PLUME]: false,
      [ArtifactType.SANDS]: false,
    });
    const [isValid, setIsValid] = useState(true);
    const [internalDesiredArtifactMainStats, setInternalDesiredArtifactMainStats] =
      useState<ArtifactMainStats>(desiredArtifactMainStats);

    const cancel = () => {
      console.log("Canceling editing of DesiredArtifactMainStatsSelector.");
      setInternalDesiredArtifactMainStats(desiredArtifactMainStats);
      setEditingStates({
        [ArtifactType.CIRCLET]: false,
        [ArtifactType.FLOWER]: false,
        [ArtifactType.GOBLET]: false,
        [ArtifactType.PLUME]: false,
        [ArtifactType.SANDS]: false,
      });
    };

    const handleToggleEdit = (artifactType: ArtifactType) => {
      if (editingStates[artifactType]) {
        if (!validate()) {
          setIsValid(false);
        } else {
          onChange(internalDesiredArtifactMainStats);
          setEditingStates((prev) => ({ ...prev, [artifactType]: false }));
        }
      } else {
        setEditingStates((prev) => ({ ...prev, [artifactType]: true }));
      }
    };

    const save = () => {
      console.log("Saving DesiredArtifactMainStatsSelector.");
      if (!validate()) {
        console.error("Saving DesiredArtifactMainStatsSelector failed due to validation error.");
        return false;
      }
      onChange(internalDesiredArtifactMainStats);
      setEditingStates({
        [ArtifactType.CIRCLET]: false,
        [ArtifactType.FLOWER]: false,
        [ArtifactType.GOBLET]: false,
        [ArtifactType.PLUME]: false,
        [ArtifactType.SANDS]: false,
      });
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

    const clearDesiredMainStat = (artifactType: ArtifactType) => {
      updateDesiredMainStat(artifactType, undefined);
    };

    const renderEditableContent = (artifactType: ArtifactType) => {
      return (
        <>
          <Select
            onValueChange={(value) => updateDesiredMainStat(artifactType, value as Stat)}
            value={internalDesiredArtifactMainStats[artifactType]}
          >
            <SelectTrigger
              className="h-10 px-3 py-2 text-left border rounded-md bg-background w-full"
              isValid={isValid}
            >
              <SelectValue placeholder={"Select a main stat"} />
            </SelectTrigger>
            <SelectContent>
              {MAIN_STATS_BY_ARTIFACT_TYPE[artifactType].map((stat) => (
                <SelectItem key={stat.toString()} value={stat.toString()}>
                  {stat.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="p-1 flex-shrink-0"
            onClick={() => clearDesiredMainStat(artifactType)}
            size="sm"
            variant="ghost"
          >
            <X size={16} />
          </Button>
          {!false && <p className="text-red-500 text-sm mt-1">Please select a weapon.</p>}
        </>
      );
    };

    const renderNonEditableContent = (artifactType: ArtifactType) => {
      return (
        <div
          className="h-10 px-3 py-2 text-left flex items-center w-full rounded-md hover:bg-accent cursor-pointer"
          onClick={() => handleToggleEdit(artifactType)}
        >
          {internalDesiredArtifactMainStats[artifactType] ? (
            <span>{internalDesiredArtifactMainStats[artifactType]}</span>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
      );
    };

    const renderContent = (artifactType: ArtifactType) => (
      <div className="flex items-center space-x-2 flex-grow">
        {editingStates[artifactType] ? renderEditableContent(artifactType) : renderNonEditableContent(artifactType)}
        <Button className="p-1 flex-shrink-0" onClick={() => handleToggleEdit(artifactType)} size="sm" variant="ghost">
          {editingStates[artifactType] ? <Check size={16} /> : <Pencil size={16} />}
        </Button>
      </div>
    );

    return (
      <div className="mb-4">
        <Label className="text-md font-semibold text-primary whitespace-nowrap mb-2 block">Artifact Main Stats:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
            <div className="flex flex-col space-y-2" key={artifactType}>
              <Label className="text-sm font-semibold text-primary whitespace-nowrap">{artifactType}</Label>
              {renderContent(artifactType)}
            </div>
          ))}
        </div>
        {!isValid && <p className="text-red-500 text-sm mt-1">Please select valid main stats.</p>}
      </div>
    );
  }
);

DesiredArtifactMainStatsSelector.displayName = "DesiredArtifactMainStatsSelector";

export default DesiredArtifactMainStatsSelector;
