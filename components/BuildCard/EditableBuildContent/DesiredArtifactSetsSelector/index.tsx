"use client";

import { PlusCircle, X } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArtifactSet } from "@/types";

import DesiredArtifactSetSelector from "./DesiredArtifactSetSelector";

interface DesiredArtifactSetsSelectorProps {
  artifactSets: ArtifactSet[];
  desiredArtifactSets: ArtifactSet[];
  onChange: (artifactSets: ArtifactSet[]) => void;
}

const DesiredArtifactSetsSelector = forwardRef<ISaveableContentHandle, DesiredArtifactSetsSelectorProps>(
  ({ artifactSets, desiredArtifactSets, onChange }, ref) => {
    const refs = useRef<React.RefObject<ISaveableContentHandle>[]>([]);

    const [internalDesiredArtifactSets, setInternalDesiredArtifactSets] =
      useState<(ArtifactSet | undefined)[]>(desiredArtifactSets);

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
      if (desiredArtifactSets.length < 2) {
        setInternalDesiredArtifactSets([...internalDesiredArtifactSets, undefined]);
      }
    };

    const handleArtifactSetSelection = (artifactSet: ArtifactSet | undefined, index: number) => {
      const newInternalDesiredArtifactSets = [...internalDesiredArtifactSets];
      newInternalDesiredArtifactSets[index] = artifactSet;
      setInternalDesiredArtifactSets(newInternalDesiredArtifactSets);
    };

    const handleRemoveArtifactSetSelector = (index: number) => {
      const newInternalDesiredArtifactSets = internalDesiredArtifactSets.filter((artifactSet, idx) => idx !== index);
      setInternalDesiredArtifactSets(newInternalDesiredArtifactSets);
    };

    return (
      <>
        <Label>Artifact Sets</Label>
        <div className="flex flex-wrap items-center gap-4">
          {internalDesiredArtifactSets.map((desiredArtifactSet, index) => {
            if (!refs.current[index]) {
              refs.current[index] = React.createRef();
            }
            return (
              <div className="flex items-center" key={index}>
                <DesiredArtifactSetSelector
                  artifactSets={artifactSets}
                  desiredArtifactSet={desiredArtifactSet}
                  onChange={(artifactSet) => handleArtifactSetSelection(artifactSet, index)}
                  ref={refs.current[index]}
                />
                <Button
                  className="h-9 w-9 ml-2"
                  onClick={() => handleRemoveArtifactSetSelector(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove artifact set</span>
                </Button>
              </div>
            );
          })}
          {desiredArtifactSets.length < 2 && (
            <Button className="h-9 w-9 ml-2" onClick={handleAddArtifactSetSelector} size="icon" variant="ghost">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add artifact set</span>
            </Button>
          )}
        </div>
      </>
    );
  }
);

DesiredArtifactSetsSelector.displayName = "DesiredArtifactSetsSelector";

export default DesiredArtifactSetsSelector;
