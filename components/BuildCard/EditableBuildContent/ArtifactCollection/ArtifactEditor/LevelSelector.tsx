import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { ARTIFACT_MAX_LEVEL_BY_RARITY } from "@/constants";
import { forwardRef, useImperativeHandle, useState } from "react";

interface LevelSelectorProps {
  level?: number;
  rarity?: number;
  onUpdate: (level: number) => void;
}

const RaritySelector = forwardRef<ISaveableContentHandle, LevelSelectorProps>(
  ({ level, rarity = 5, onUpdate }, ref) => {
    const [isValid, setIsValid] = useState(false);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      const maxLevel = ARTIFACT_MAX_LEVEL_BY_RARITY[rarity];
      if (!level || level < 1 || level > maxLevel) {
        setIsValid(false);
        return false;
      }
      setIsValid(true);
      return true;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const updateLevel = (level?: number) => {
      if (!level) {
        setIsValid(false);
      } else {
        setIsValid(true);
        onUpdate(level);
      }
    };

    return (
      <div className="mb-2">
        <Label className="text-s font-semibold" htmlFor="rarity">
          Level
        </Label>
        <DebouncedNumericInput
          className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
          isValid={isValid}
          onChange={updateLevel}
          placeholder="Enter level"
          max={20}
          min={1}
          value={level}
        />
      </div>
    );
  }
);

export default RaritySelector;
