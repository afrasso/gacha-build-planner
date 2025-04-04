import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { useDataContext } from "@/contexts/DataContext";

interface LevelSelectorProps {
  level?: number;
  onUpdate: (level: number) => void;
  rarity?: number;
}

const LevelSelector = forwardRef<ISaveableContentHandle, LevelSelectorProps>(({ level, onUpdate, rarity = 5 }, ref) => {
  const { getArtifactMaxLevel } = useDataContext();

  const [isValid, setIsValid] = useState(false);

  const cancel = () => {};

  const save = () => {
    return validate();
  };

  const validate = () => {
    const maxLevel = getArtifactMaxLevel({ rarity });
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
        max={20}
        min={1}
        onChange={updateLevel}
        placeholder="Enter level"
        value={level}
      />
    </div>
  );
});

LevelSelector.displayName = "LevelSelector";

export default LevelSelector;
