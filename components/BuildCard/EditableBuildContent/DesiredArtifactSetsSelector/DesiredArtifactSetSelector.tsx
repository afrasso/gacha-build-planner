"use client";

import Image from "next/image";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactSet } from "@/types";

interface DesiredArtifactSetsSelectorProps {
  artifactSets: ArtifactSet[];
  desiredArtifactSet: ArtifactSet | undefined;
  onChange: (desiredArtifactSet: ArtifactSet | undefined) => void;
}

const DesiredArtifactSetSelector = forwardRef<ISaveableContentHandle, DesiredArtifactSetsSelectorProps>(
  ({ artifactSets, desiredArtifactSet, onChange }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      console.log("Saving DesiredArtifactSetSelector");
      if (!validate()) {
        console.error("Saving DesiredArtifactSetSelector failed due to validation error.");
        return false;
      }
      return true;
    };

    const validate = () => {
      console.log("Validating DesiredArtifactSetSelector.");
      const newIsValid = !!desiredArtifactSet;
      setIsValid(newIsValid);
      return newIsValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    return (
      <>
        <Select
          onValueChange={(value) => {
            const artifactSet = artifactSets.find((artifactSet) => artifactSet.id === value);
            onChange(artifactSet);
            setIsValid(true);
          }}
          value={desiredArtifactSet?.id}
        >
          <SelectTrigger className="w-[220px]" isValid={isValid}>
            <SelectValue placeholder="Select an artifact set">
              {desiredArtifactSet && (
                <div className="flex items-center">
                  <Image
                    alt={desiredArtifactSet.name}
                    className="mr-2"
                    height={32}
                    src={desiredArtifactSet.iconUrl}
                    width={32}
                  />
                  {desiredArtifactSet.name}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {artifactSets.map((artifactSet) => (
              <SelectItem className="flex items-center" key={artifactSet.id} value={artifactSet.id}>
                <div className="flex items-center">
                  <Image alt={artifactSet.name} className="mr-2" height={32} src={artifactSet.iconUrl} width={32} />
                  {artifactSet.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isValid && <p className="text-red-500 text-sm mt-1">Please select an artifact set.</p>}
      </>
    );
  }
);

DesiredArtifactSetSelector.displayName = "DesiredArtifactSetSelector";

export default DesiredArtifactSetSelector;
