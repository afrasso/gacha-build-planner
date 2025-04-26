import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataContext } from "@/contexts/DataContext";

interface SetSelectorProps {
  artifactTypeKey: string;
  onUpdate: (setId: string) => void;
  setId?: string;
}

const SetSelector = forwardRef<ISaveableContentHandle, SetSelectorProps>(
  ({ artifactTypeKey, onUpdate, setId }, ref) => {
    const { getArtifactSets } = useDataContext();

    const [isValid, setIsValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      const newIsValid = !!setId;
      setIsValid(newIsValid);
      return newIsValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const onSetChange = (setId: string) => {
      onUpdate(setId);
      setIsValid(true);
    };

    const availableArtifactSets = getArtifactSets().filter(
      (artifactSet) => artifactSet.hasArtifactTypes[artifactTypeKey]
    );

    return (
      <div className={`${!isValid ? "mb-8" : "mb-2"}`}>
        <Label className="text-s font-semibold" htmlFor="artifact-set">
          Set
        </Label>
        <div className="flex-grow relative">
          <Select onValueChange={onSetChange} value={setId}>
            <SelectTrigger
              aria-describedby={!isValid ? "error" : undefined}
              aria-invalid={!isValid}
              className="h-8"
              isValid={isValid}
            >
              <SelectValue placeholder="Select set" />
            </SelectTrigger>
            <SelectContent>
              {availableArtifactSets.map((artifactSet) => (
                <SelectItem key={artifactSet.id} value={artifactSet.id}>
                  <div className="flex items-center">
                    <Image
                      alt={artifactSet.name}
                      className="mr-2"
                      height={32}
                      src={artifactSet.iconUrls[artifactTypeKey]}
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
