import { Check, PlusCircle, Trash2, X } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUB_STATS } from "@/constants";
import { Stat, StatValue } from "@/types";

interface SubStatsSelectorProps {
  mainStat?: Stat;
  onUpdate: (subStats: StatValue[]) => void;
  subStats?: StatValue[];
}

const SubStatsSelector = forwardRef<ISaveableContentHandle, SubStatsSelectorProps>(
  ({ mainStat, onUpdate, subStats = [] }, ref) => {
    const [isValid, setIsValid] = useState(true);
    const [isSelectorPresent, setIsSelectorPresent] = useState(false);
    const [isSelectorPresenceValid, setIsSelectorPresenceValid] = useState(true);
    const [stat, setStat] = useState<Stat | undefined>(undefined);
    const [isStatValid, setIsStatValid] = useState(true);
    const [value, setValue] = useState<number | undefined>(undefined);
    const [isValueValid, setIsValueValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      const areSubStatsValid = validateSubStats();
      const isSelectorValid = !isSelectorPresent || (isSelectorPresent && validateSelector());
      const newIsSelectorPresenceValid = !isSelectorPresent;
      console.log(`areSubStatsValid=${areSubStatsValid}`);
      console.log(`isSelectorValid=${isSelectorValid}`);
      console.log(`newIsSelectorPresenceValid=${newIsSelectorPresenceValid}`);
      setIsSelectorPresenceValid(newIsSelectorPresenceValid);
      return areSubStatsValid && isSelectorValid && newIsSelectorPresenceValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const validateSubStats = () => {
      const newIsValid = subStats && subStats.length >= 1;
      setIsValid(newIsValid);
      return newIsValid;
    };

    const addSelector = () => {
      setIsSelectorPresent(true);
      setIsSelectorPresenceValid(true);
    };

    const changeSelectorStat = (stat: string) => {
      setStat(stat as Stat);
      setIsStatValid(true);
    };

    const changeSelectorValue = useCallback(
      (value: number | undefined) => {
        setValue(value);
        setIsValueValid(true);
      },
      [setValue, setIsValueValid]
    );

    const cancelSelector = () => {
      setIsSelectorPresent(false);
      setIsSelectorPresenceValid(true);
      setStat(undefined);
      setIsStatValid(true);
      setValue(undefined);
      setIsValueValid(true);
    };

    const validateSelector = () => {
      const newIsStatValid = !!stat;
      setIsStatValid(newIsStatValid);
      const newIsValueValid = value !== undefined && value >= 0 && value < 1000;
      setIsValueValid(newIsValueValid);
      return newIsStatValid && newIsValueValid;
    };

    const confirmSelector = () => {
      if (validateSelector()) {
        const subStat: StatValue = { stat: stat!, value: value! };
        setIsSelectorPresent(false);
        setIsSelectorPresenceValid(true);
        setStat(undefined);
        setIsStatValid(true);
        setValue(undefined);
        setIsValueValid(true);
        setIsValid(true);
        onUpdate([...subStats, subStat]);
      }
    };

    const removeSubStat = (stat: Stat) => {
      onUpdate(subStats.filter((subStat) => subStat.stat !== stat));
    };

    const MAX_SUB_STATS = 4;

    const canAddSubStat = () => {
      return subStats.length < MAX_SUB_STATS;
    };

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-s font-semibold text-primary whitespace-nowrap">Sub Stats:</Label>
          <Button
            className="p-1 flex-shrink 0"
            disabled={!canAddSubStat()}
            onClick={addSelector}
            size="sm"
            variant="ghost"
          >
            <PlusCircle size={16} />
          </Button>
        </div>
        <div className="space-y-0">
          {subStats?.map((subStat) => (
            <div className="flex items-center space-x-2 py-1 rounded" key={subStat.stat}>
              <span>{subStat.stat}</span>
              <span className="text-sm text-muted-foreground">{subStat.value}</span>
              <Button className="ml-auto" onClick={() => removeSubStat(subStat.stat)} size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!isValid && <p className="text-red-500 text-sm">Please add at least one sub stat.</p>}
          <div className="flex items-center space-x-2 mt-2">
            {isSelectorPresent && (
              <>
                <Select onValueChange={changeSelectorStat} value={stat}>
                  <SelectTrigger isValid={isStatValid}>
                    <SelectValue placeholder="Select a stat" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_STATS.map((stat: Stat) => (
                      <SelectItem disabled={stat === mainStat} key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DebouncedNumericInput
                  isValid={isValueValid}
                  onChange={changeSelectorValue}
                  placeholder="Enter a value"
                  value={value}
                />
                <Button onClick={cancelSelector} size="sm" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
                {stat && value != null && (
                  <Button onClick={confirmSelector} size="sm" variant="ghost">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {!isSelectorPresenceValid && <p className="text-red-500 text-sm">Please save or cancel your current edit.</p>}
      </div>
    );
  }
);

SubStatsSelector.displayName = "SubStatsSelector";

export default SubStatsSelector;
