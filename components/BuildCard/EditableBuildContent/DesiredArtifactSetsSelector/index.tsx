"use client";

import { Check, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactSet } from "@/types";

interface DesiredArtifactSetsSelectorProps {
  artifactSets: ArtifactSet[];
  desiredArtifactSets: ArtifactSet[];
  onChange: (artifactSets: ArtifactSet[]) => void;
}

const DesiredArtifactSetsSelector = forwardRef<ISaveableContentHandle, DesiredArtifactSetsSelectorProps>(
  ({ artifactSets, desiredArtifactSets }, ref) => {
    const [internalDesiredArtifactSets, setInternalDesiredArtifactSets] = useState<ArtifactSet[]>(desiredArtifactSets);
    const [isSelectingSet, setIsSelectingSet] = useState(false);
    const [selectedSet, setSelectedSet] = useState<ArtifactSet | null>(null);

    const cancel = () => {
      console.log("Canceling editing of DesiredArtifactSetsSelector.");
      // cancel subcomponents
    };

    const save = () => {
      console.log("Saving DesiredArtifactSetsSelector");
      if (!validate()) {
        console.error("Saving DesiredArtifactSetsSelector failed due to validation error.");
        return false;
      }
      // save subcomponents
      return true;
    };

    const validate = () => {
      console.log("Validating DesiredArtifactSetsSelector.");
      // validate subcomponents
      return true;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const handleAddArtifactSetSelector = () => {
      setIsSelectingSet(true);
    };

    const handleArtifactSetSelection = (artifactSet: ArtifactSet) => {
      setSelectedSet(artifactSet);
    };

    const handleConfirmSelection = () => {
      if (selectedSet && internalDesiredArtifactSets.length < 2) {
        setInternalDesiredArtifactSets([...internalDesiredArtifactSets, selectedSet]);
        setSelectedSet(null);
        setIsSelectingSet(false);
      }
    };

    const handleRemoveArtifactSetSelector = (index: number) => {
      const newInternalDesiredArtifactSets = internalDesiredArtifactSets.filter((artifactSet, idx) => idx !== index);
      setInternalDesiredArtifactSets(newInternalDesiredArtifactSets);
    };

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-md font-semibold text-primary whitespace-nowrap">Artifact Sets:</Label>
          <Button
            className="p-1 flex-shrink-0"
            disabled={internalDesiredArtifactSets.length >= 2}
            onClick={handleAddArtifactSetSelector}
            size="sm"
            variant="ghost"
          >
            <PlusCircle size={16} />
          </Button>
        </div>
        <div className="space-y-0">
          {internalDesiredArtifactSets.map((artifactSet, index) => (
            <div className="flex items-center space-x-2 py-1 rounded" key={artifactSet?.id}>
              <Image alt={artifactSet.name} height={32} src={artifactSet.iconUrl} width={32} />
              <span>{artifactSet?.name}</span>
              <span className="text-sm text-muted-foreground">2-Piece</span>
              <Button
                className="ml-auto"
                onClick={() => handleRemoveArtifactSetSelector(index)}
                size="sm"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            {isSelectingSet ? (
              <>
                <Select
                  onValueChange={(value) =>
                    handleArtifactSetSelection(
                      artifactSets.find((artifactSet) => artifactSet.name === value) as ArtifactSet
                    )
                  }
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select an artifact set" />
                  </SelectTrigger>
                  <SelectContent>
                    {artifactSets.map((artifactSet) => (
                      <SelectItem className="flex items-center" key={artifactSet.name} value={artifactSet.name}>
                        <div className="flex items-center">
                          <Image
                            alt={artifactSet.name}
                            className="mr-2"
                            height={32}
                            src={artifactSet.iconUrl}
                            width={32}
                          />
                          {artifactSet.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSet ? (
                  <Button onClick={handleConfirmSelection} size="sm" variant="ghost">
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleConfirmSelection} size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

DesiredArtifactSetsSelector.displayName = "DesiredArtifactSetsSelector";

export default DesiredArtifactSetsSelector;
