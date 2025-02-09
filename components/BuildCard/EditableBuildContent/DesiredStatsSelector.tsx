"use client";

import { Check, PlusCircle, Trash2, X } from "lucide-react";
import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderedOverallStats } from "@/constants";
import { OverallStat, StatValue } from "@/types";

interface DesiredStatsSelectorProps {
  currentStats: Record<OverallStat, number>;
  desiredStats: StatValue<OverallStat>[];
  onChange: (desiredStats: StatValue<OverallStat>[]) => void;
}

const DesiredStatsSelector: React.FC<DesiredStatsSelectorProps> = ({ currentStats, desiredStats, onChange }) => {
  const [isAddingDesiredStat, setIsAddingDesiredStat] = useState(false);
  const [stat, setStat] = useState<OverallStat | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [isStatValid, setIsStatValid] = useState(true);
  const [isValueValid, setIsValueValid] = useState(true);

  const addSelector = () => {
    setIsAddingDesiredStat(true);
  };

  const updateStat = (stat: OverallStat) => {
    setStat(stat);
    setValue(currentStats[stat]);
    setIsStatValid(true);
  };

  const updateValue = useCallback(
    (value: number | undefined) => {
      setValue(value);
      setIsValueValid(true);
    },
    [setValue, setIsValueValid]
  );

  const cancel = () => {
    setStat(undefined);
    setIsStatValid(true);
    setValue(undefined);
    setIsValueValid(true);
    setIsAddingDesiredStat(false);
  };

  const validate = () => {
    const newIsStatValid = !!stat;
    setIsStatValid(newIsStatValid);
    const newIsValueValid = value !== undefined && value >= 0 && value < 100000;
    setIsValueValid(newIsValueValid);
    return newIsStatValid && newIsValueValid;
  };

  const confirm = () => {
    if (validate()) {
      const desiredStat: StatValue<OverallStat> = { stat: stat!, value: value! };
      setStat(undefined);
      setValue(undefined);
      setIsAddingDesiredStat(false);
      onChange([...desiredStats, desiredStat]);
    }
  };

  const remove = (stat: OverallStat) => {
    onChange(desiredStats.filter((desiredStat) => desiredStat.stat !== stat));
  };

  const canAddStatValue = () => {
    return desiredStats.length < Object.values(OverallStat).length;
  };

  const getOrderedRemainingStats = () => {
    return Object.values(OverallStat)
      .filter((stat) => !desiredStats.map((desiredStat) => desiredStat.stat).includes(stat))
      .sort((stat1, stat2) => getOrderedOverallStats().indexOf(stat1) - getOrderedOverallStats().indexOf(stat2));
  };

  const getOrderedDesiredStats = () => {
    return desiredStats.sort(
      (stat1, stat2) => getOrderedOverallStats().indexOf(stat1.stat) - getOrderedOverallStats().indexOf(stat2.stat)
    );
  };

  return (
    <div className={`${!isStatValid || !isValueValid ? "mb-8" : "mb-2"}`}>
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label className="text-md font-semibold text-primary whitespace-nowrap w-24">Desired Stats:</Label>
        <div className="flex-grow flex items-center">
          <div className="flex items-center flex-grow h-8 px-3 py-2 text-left text-sm">
            {!(desiredStats?.length > 0) && <span className="text-sm text-muted-foreground">None selected</span>}
          </div>
          <div className="flex ml-2 gap-1">
            <Button
              className="p-0 w-6 h-8 flex-shrink-0"
              disabled={!canAddStatValue()}
              onClick={addSelector}
              size="sm"
              variant="ghost"
            >
              <PlusCircle size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        {getOrderedDesiredStats().map((desiredStat) => (
          <div className="flex-grow flex items-center" key={desiredStat.stat}>
            <div className="h-8 px-3 text-sm flex items-center justify-between w-full">
              <div>{desiredStat.stat}</div>
              <div className="text-sm text-muted-foreground">{desiredStat.value}</div>
            </div>
            <div className="flex ml-2 gap-1">
              <Button
                className="p-0 w-6 h-8 flex-shrink-0"
                onClick={() => remove(desiredStat.stat)}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex flex-grow items-center justify-between gap-2">
          {isAddingDesiredStat && (
            <>
              <div className="flex-grow relative">
                <Select onValueChange={updateStat}>
                  <SelectTrigger
                    aria-describedby={!isStatValid ? "stat-error" : undefined}
                    aria-invalid={!isStatValid}
                    className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                    isValid={isStatValid}
                  >
                    <SelectValue placeholder="Select a stat" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOrderedRemainingStats().map((stat) => (
                      <SelectItem className="flex items-center" key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isStatValid && (
                  <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="stat-error">
                    Please select a stat.
                  </p>
                )}
              </div>
              <div className="flex-grow relative">
                <DebouncedNumericInput
                  aria-describedby={!isValueValid ? "value-error" : undefined}
                  aria-invalid={!isValueValid}
                  className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                  isValid={isValueValid}
                  onChange={updateValue}
                  value={value}
                />
                {!isValueValid && (
                  <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                    Please enter a value less than 1000.
                  </p>
                )}
              </div>
              <div className="flex ml-2 gap-1">
                <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
                  <X size={16} />
                </Button>
                <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={confirm} size="sm" variant="ghost">
                  <Check size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesiredStatsSelector;
