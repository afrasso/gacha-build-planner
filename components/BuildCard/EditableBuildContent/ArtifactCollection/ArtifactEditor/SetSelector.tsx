import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactSet, ArtifactType } from "@/types";

interface SetSelectorProps {
  artifactSets: ArtifactSet[];
  artifactType: ArtifactType;
  onUpdate: (artifactSet: ArtifactSet) => void;
  set?: ArtifactSet;
}

const SetSelector = forwardRef<ISaveableContentHandle, SetSelectorProps>(
  ({ artifactSets, artifactType, onUpdate, set }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      const newIsValid = !!set;
      setIsValid(newIsValid);
      return newIsValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const onSetChange = (id: string) => {
      const set = artifactSets.find((artifactSet) => artifactSet.id === id);
      if (set) {
        onUpdate(set);
        setIsValid(true);
      }
    };

    return (
      <div className={`${!isValid ? "mb-8" : "mb-2"}`}>
        <Label className="text-s font-semibold" htmlFor="artifact-set">
          Set
        </Label>
        <div className="flex-grow relative">
          <Select onValueChange={onSetChange} value={set?.id}>
            <SelectTrigger
              aria-describedby={!isValid ? "error" : undefined}
              aria-invalid={!isValid}
              className="h-8"
              isValid={isValid}
            >
              <SelectValue placeholder="Select set" />
            </SelectTrigger>
            <SelectContent>
              {artifactSets
                .filter((artifactSet) => artifactSet.hasArtifactTypes[artifactType])
                .map((artifactSet) => (
                  <SelectItem key={artifactSet.id} value={artifactSet.id}>
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
          {!isValid && (
            <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="error">
              Please select an artifact set.
            </p>
          )}
        </div>
      </div>
    );
  }
);

SetSelector.displayName = "SetSelector";

export default SetSelector;
