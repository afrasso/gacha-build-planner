import { Check, PlusCircle, Trash2, X } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

interface SubStatsSelectorProps {
  mainStatKey?: string;
  onUpdate: (subStats: Stat[]) => void;
  subStats?: Stat[];
}

const SubStatsSelector = forwardRef<ISaveableContentHandle, SubStatsSelectorProps>(
  ({ mainStatKey, onUpdate, subStats = [] }, ref) => {
    const { getPossibleArtifactSubStats } = useDataContext();

    const MIN_SUB_STATS = 1;
    const MAX_SUB_STATS = 4;

    const [areSubStatsValid, setAreSubStatsValid] = useState(true);
    const [isSelectorPresent, setIsSelectorPresent] = useState(false);
    const [isSelectorPresenceValid, setIsSelectorPresenceValid] = useState(false);
    const [statKey, setStatKey] = useState<string | undefined>(undefined);
    const [isStatKeyValid, setIsStatKeyValid] = useState(true);
    const [statValue, setStatValue] = useState<number | undefined>(undefined);
    const [isStatValueValid, setIsStatValueValid] = useState(true);

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
      setStatKey(stat);
      setIsStatKeyValid(true);
    };

    const changeSelectorValue = useCallback(
      (value: number | undefined) => {
        setStatValue(value);
        setIsStatValueValid(true);
      },
      [setStatValue, setIsStatValueValid]
    );

    const cancelSelector = () => {
      setIsSelectorPresent(false);
      setIsSelectorPresenceValid(true);
      setStatKey(undefined);
      setIsStatKeyValid(true);
      setStatValue(undefined);
      setIsStatValueValid(true);
    };

    const validateSelector = () => {
      const newIsStatValid = !!statKey;
      setIsStatKeyValid(newIsStatValid);
      const newIsValueValid = statValue !== undefined && statValue >= 0 && statValue < 1000;
      setIsStatValueValid(newIsValueValid);
      return newIsStatValid && newIsValueValid;
    };

    const confirmSelector = () => {
      if (validateSelector()) {
        const subStat: Stat = { key: statKey!, value: statValue! };
        setIsSelectorPresent(false);
        setIsSelectorPresenceValid(true);
        setStatKey(undefined);
        setIsStatKeyValid(true);
        setStatValue(undefined);
        setIsStatValueValid(true);
        setAreSubStatsValid(true);
        onUpdate([...subStats, subStat]);
      }
    };

    const removeSubStat = (statKey: string) => {
      onUpdate(subStats.filter((subStat) => subStat.key !== statKey));
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
              <div className="flex-grow flex items-center" key={subStat.key}>
                <div className="h-6 px-3 text-sm flex items-center justify-between w-full">
                  <div>{subStat.key}</div>
                  <div className="text-sm text-muted-foreground">{subStat.value}</div>
                </div>
                <Button
                  className="p-0 w-6 h-8 flex-shrink-0"
                  onClick={() => removeSubStat(subStat.key)}
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
        <div className={!isStatKeyValid || !isStatValueValid || !isSelectorPresenceValid ? "mb-6" : "mb-0"}>
          <div className="flex flex-grow items-center justify-between gap-2">
            {isSelectorPresent && (
              <>
                <div className="relative">
                  <div className="flex flex-grow items-center justify-between gap-2">
                    <div className="w-1/2 relative">
                      <Select onValueChange={changeSelectorStat} value={statKey}>
                        <SelectTrigger
                          aria-describedby={!isStatKeyValid ? "stat-error" : undefined}
                          aria-invalid={!isStatKeyValid}
                          className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                          isValid={isStatKeyValid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPossibleArtifactSubStats().map((statKey) => (
                            <SelectItem disabled={statKey === mainStatKey} key={statKey} value={statKey}>
                              {statKey}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isStatKeyValid && (
                        <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                          Please select a stat.
                        </p>
                      )}
                    </div>
                    <div className="w-1/2 relative">
                      <DebouncedNumericInput
                        className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                        isValid={isStatValueValid}
                        onChange={changeSelectorValue}
                        placeholder="Enter value"
                        value={statValue}
                      />
                      {!isStatValueValid && (
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
