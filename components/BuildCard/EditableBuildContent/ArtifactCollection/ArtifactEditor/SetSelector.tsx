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
      <>
        <div>
          <Label className="text-s font-semibold" htmlFor="artifact-set">
            Set
          </Label>
          <Select onValueChange={onSetChange} value={set?.id}>
            <SelectTrigger className="h-8" id="artifact-set" isValid={isValid}>
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
        <div className="h-6">{!isValid && <p className="text-red-500 text-sm">Please select an artifact set.</p>}</div>
      </>
    );
  }
);

SetSelector.displayName = "SetSelector";

export default SetSelector;
