"use client";

import { Check, PlusCircle, Trash2, X } from "lucide-react";
import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stat, StatValue } from "@/types";

interface DesiredStatsSelectorProps {
  desiredStats: StatValue[];
  onChange: (desiredStats: StatValue[]) => void;
}

const DesiredStatsSelector: React.FC<DesiredStatsSelectorProps> = ({ desiredStats, onChange }) => {
  const [isAddingDesiredStat, setIsAddingDesiredStat] = useState(false);
  const [stat, setStat] = useState<Stat | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [isStatValid, setIsStatValid] = useState(true);
  const [isValueValid, setIsValueValid] = useState(true);

  const addSelector = () => {
    setIsAddingDesiredStat(true);
  };

  const updateStat = (stat: Stat) => {
    setStat(stat);
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
    setValue(0);
    setIsAddingDesiredStat(false);
    setIsStatValid(true);
    setIsValueValid(true);
  };

  const validate = () => {
    const newIsStatValid = !!stat;
    setIsStatValid(newIsStatValid);
    const newIsValueValid = value !== undefined && value >= 0 && value < 1000;
    setIsValueValid(newIsValueValid);
    return newIsStatValid && newIsValueValid;
  };

  const confirm = () => {
    if (validate()) {
      const desiredStat: StatValue = { stat: stat!, value: value! };
      setStat(undefined);
      setValue(0);
      setIsAddingDesiredStat(false);
      onChange([...desiredStats, desiredStat]);
    }
  };

  const remove = (index: number) => {
    onChange(desiredStats.filter((desiredStat, idx) => idx !== index));
  };

  const canAddStatValue = () => {
    return desiredStats.length < 4;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-md font-semibold text-primary whitespace-nowrap">Desired Stats:</Label>
          {!(desiredStats?.length > 0) && <span className="text-muted-foreground p-6">None selected</span>}
        </div>
        <Button
          className="p-1 flex-shrink-0"
          disabled={!canAddStatValue()}
          onClick={addSelector}
          size="sm"
          variant="ghost"
        >
          <PlusCircle size={16} />
        </Button>
      </div>
      <div className="space-y-0">
        {desiredStats.map((desiredStat, index) => (
          <div className="flex items-center space-x-2 py-1 rounded" key={desiredStat.stat}>
            <span>{desiredStat.stat}</span>
            <span className="text-sm text-muted-foreground">{desiredStat.value}</span>
            <Button className="ml-auto" onClick={() => remove(index)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2 mt-2">
          {isAddingDesiredStat && (
            <>
              <Select onValueChange={updateStat}>
                <SelectTrigger className="w-[220px]" isValid={isStatValid}>
                  <SelectValue placeholder="Select a stat" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Stat).map((stat) => (
                    <SelectItem className="flex items-center" key={stat} value={stat}>
                      <div className="flex items-center">{stat}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DebouncedNumericInput
                className="w-[220px]"
                isValid={isValueValid}
                onChange={updateValue}
                value={value}
              />
              <Button onClick={cancel} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
              {!!(stat && value) && (
                <Button onClick={confirm} size="sm" variant="ghost">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesiredStatsSelector;
