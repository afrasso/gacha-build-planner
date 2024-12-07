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
  onUpdate: (subStats: StatValue<Stat>[]) => void;
  subStats?: StatValue<Stat>[];
}

const SubStatsSelector = forwardRef<ISaveableContentHandle, SubStatsSelectorProps>(
  ({ mainStat, onUpdate, subStats = [] }, ref) => {
    const MIN_SUB_STATS = 1;
    const MAX_SUB_STATS = 4;

    const [areSubStatsValid, setAreSubStatsValid] = useState(true);
    const [isSelectorPresent, setIsSelectorPresent] = useState(false);
    const [isSelectorPresenceValid, setIsSelectorPresenceValid] = useState(false);
    const [stat, setStat] = useState<Stat | undefined>(undefined);
    const [isStatValid, setIsStatValid] = useState(true);
    const [value, setValue] = useState<number | undefined>(undefined);
    const [isValueValid, setIsValueValid] = useState(true);

    const cancel = () => {};

    const save = () => {
      return validate();
    };

    const validate = () => {
      if (isSelectorPresent) {
        const isSelectorValid = validateSelector();
        setIsSelectorPresenceValid(!isSelectorValid);
        return false;
      }
      return validateSubStats();
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const validateSubStats = () => {
      const newAreSubStatsValid = subStats && subStats.length >= MIN_SUB_STATS;
      setAreSubStatsValid(newAreSubStatsValid);
      return newAreSubStatsValid;
    };

    const addSelector = () => {
      setAreSubStatsValid(true);
      setIsSelectorPresent(true);
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
        const subStat: StatValue<Stat> = { stat: stat!, value: value! };
        setIsSelectorPresent(false);
        setIsSelectorPresenceValid(true);
        setStat(undefined);
        setIsStatValid(true);
        setValue(undefined);
        setIsValueValid(true);
        setAreSubStatsValid(true);
        onUpdate([...subStats, subStat]);
      }
    };

    const removeSubStat = (stat: Stat) => {
      onUpdate(subStats.filter((subStat) => subStat.stat !== stat));
    };

    const canAddSubStat = () => {
      return subStats.length < MAX_SUB_STATS;
    };

    return (
      <div className="mb-2">
        <div className={!areSubStatsValid && !isSelectorPresent ? "mb-6" : "mb-0"}>
          <div className="flex flex-grow items-center justify-between gap-2">
            <Label className="text-s font-semibold text-primary whitespace-nowrap">Sub Stats:</Label>
            <div className="flex-grow flex items-center">
              <div className="flex items-center flex-grow h-8 px-3 text-left text-sm">
                {!(subStats?.length > 0) && <span className="text-sm text-muted-foreground">None selected</span>}
              </div>
              <div className="flex ml-2 gap-1">
                <Button
                  className="p-0 w-6 h-8 flex-shrink 0"
                  disabled={!canAddSubStat() || isSelectorPresent}
                  onClick={addSelector}
                  size="sm"
                  variant="ghost"
                >
                  <PlusCircle size={16} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between relative">
            {subStats?.map((subStat) => (
              <div className="flex-grow flex items-center" key={subStat.stat}>
                <div className="h-6 px-3 text-sm flex items-center justify-between w-full">
                  <div>{subStat.stat}</div>
                  <div className="text-sm text-muted-foreground">{subStat.value}</div>
                </div>
                <Button
                  className="p-0 w-6 h-8 flex-shrink-0"
                  onClick={() => removeSubStat(subStat.stat)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            {!areSubStatsValid && !isSelectorPresent && (
              <p className="text-red-500 text-sm mt-1 absolute left-0 top-full">Please add at least one sub stat.</p>
            )}
          </div>
        </div>
        <div className={!isStatValid || !isValueValid || !isSelectorPresenceValid ? "mb-6" : "mb-0"}>
          <div className="flex flex-grow items-center justify-between gap-2">
            {isSelectorPresent && (
              <>
                <div className="relative">
                  <div className="flex flex-grow items-center justify-between gap-2">
                    <div className="w-1/2 relative">
                      <Select onValueChange={changeSelectorStat} value={stat}>
                        <SelectTrigger
                          aria-describedby={!isStatValid ? "stat-error" : undefined}
                          aria-invalid={!isStatValid}
                          className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                          isValid={isStatValid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUB_STATS.map((stat: Stat) => (
                            <SelectItem disabled={stat === mainStat} key={stat} value={stat}>
                              {stat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isStatValid && (
                        <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                          Please select a stat.
                        </p>
                      )}
                    </div>
                    <div className="w-1/2 relative">
                      <DebouncedNumericInput
                        className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                        isValid={isValueValid}
                        onChange={changeSelectorValue}
                        placeholder="Enter value"
                        value={value}
                      />
                      {!isValueValid && (
                        <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                          Please enter a value.
                        </p>
                      )}
                    </div>
                  </div>
                  {!isSelectorPresenceValid && (
                    <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                      Please confirm or cancel your substat.
                    </p>
                  )}
                </div>
                <div className="flex ml-2 gap-1">
                  <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancelSelector} size="sm" variant="ghost">
                    <X size={16} />
                  </Button>
                  <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={confirmSelector} size="sm" variant="ghost">
                    <Check size={16} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SubStatsSelector.displayName = "SubStatsSelector";

export default SubStatsSelector;
