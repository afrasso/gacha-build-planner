import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMainStats } from "@/constants";
import { ArtifactType, StatKey } from "@/types";

interface MainStatSelectorProps {
  artifactType: ArtifactType;
  mainStat?: StatKey;
  onUpdate: (mainStat: StatKey) => void;
}

const MainStatSelector = forwardRef<ISaveableContentHandle, MainStatSelectorProps>(
  ({ artifactType, mainStat, onUpdate }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      const newIsValid = !!mainStat;
      setIsValid(newIsValid);
      return newIsValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const onMainStatChange = (mainStat: string) => {
      onUpdate(mainStat as StatKey);
      setIsValid(true);
    };

    return (
      <div className={`${!isValid ? "mb-8" : "mb-2"}`}>
        <Label className="text-s font-semibold" htmlFor="main-stat">
          Main Stat
        </Label>
        <div className="flex-grow relative">
          <Select onValueChange={onMainStatChange} value={mainStat}>
            <SelectTrigger
              aria-describedby={!isValid ? "error" : undefined}
              aria-invalid={!isValid}
              className="h-8"
              isValid={isValid}
            >
              <SelectValue placeholder="Select main stat" />
            </SelectTrigger>
            <SelectContent>
              {getMainStats({ artifactType }).map((stat: StatKey) => (
                <SelectItem key={stat} value={stat}>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isValid && <p className="text-red-500 text-sm mt-1 absolute left-0 top-full">Please select a main stat.</p>}
        </div>
      </div>
    );
  }
);

MainStatSelector.displayName = "MainStatSelector";

export default MainStatSelector;
