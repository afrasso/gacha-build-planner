"use client";

import { Check, PlusCircle, Sparkles, Trash2, X } from "lucide-react";
import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import StarSelector from "@/components/ui/custom/StarSelector";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderedOverallStats } from "@/constants";
import { DesiredOverallStat, OverallStatKey } from "@/types";

interface DesiredOverallStatsSelectorProps {
  currentStats: Record<OverallStatKey, number>;
  desiredOverallStats: DesiredOverallStat[];
  onChange: (desiredOverallStats: DesiredOverallStat[]) => void;
}

const DesiredOverallStatsSelector: React.FC<DesiredOverallStatsSelectorProps> = ({
  currentStats,
  desiredOverallStats,
  onChange,
}) => {
  const [excessUseful, setExcessUseful] = useState(false);
  const [isAddingDesiredStat, setIsAddingDesiredStat] = useState(false);
  const [isStatKeyValid, setIsStatKeyValid] = useState(true);
  const [isStatValueValid, setIsStatValueValid] = useState(true);
  const [priority, setPriority] = useState(3);
  const [statKey, setStatKey] = useState<OverallStatKey | undefined>(undefined);
  const [statValue, setStatValue] = useState<number | undefined>(undefined);

  const addSelector = () => {
    setIsAddingDesiredStat(true);
  };

  const canAddStatValue = () => {
    return desiredOverallStats.length < Object.values(OverallStatKey).length;
  };

  const cancel = () => {
    setStatKey(undefined);
    setIsStatKeyValid(true);
    setStatValue(undefined);
    setIsStatValueValid(true);
    setIsAddingDesiredStat(false);
  };

  const confirm = () => {
    if (validate()) {
      const desiredStat: DesiredOverallStat = { excessUseful, priority, stat: { key: statKey!, value: statValue! } };
      setStatKey(undefined);
      setStatValue(undefined);
      setIsAddingDesiredStat(false);
      onChange([...desiredOverallStats, desiredStat]);
    }
  };

  const getOrderedDesiredOverallStats = () => {
    return desiredOverallStats.sort((stat1, stat2) => {
      if (stat1.priority === stat2.priority) {
        if (stat1.excessUseful === stat2.excessUseful) {
          return getOrderedOverallStats().indexOf(stat1.stat.key) - getOrderedOverallStats().indexOf(stat2.stat.key);
        } else {
          return (stat2.excessUseful ? 1 : 0) - (stat1.excessUseful ? 1 : 0);
        }
      }
      return stat2.priority - stat1.priority;
    });
  };

  const getOrderedRemainingStats = () => {
    return Object.values(OverallStatKey)
      .filter((stat) => !desiredOverallStats.map((desiredStat) => desiredStat.stat.key).includes(stat))
      .sort((stat1, stat2) => getOrderedOverallStats().indexOf(stat1) - getOrderedOverallStats().indexOf(stat2));
  };

  const remove = (stat: OverallStatKey) => {
    onChange(desiredOverallStats.filter((desiredStat) => desiredStat.stat.key !== stat));
  };

  const updateExcessUseful = (excessUseful: boolean) => {
    setExcessUseful(excessUseful);
  };

  const updatePriority = (priority: number) => {
    setPriority(priority);
  };

  const updateStat = (stat: OverallStatKey) => {
    setStatKey(stat);
    setStatValue(currentStats[stat]);
    setIsStatKeyValid(true);
  };

  const updateValue = useCallback(
    (value: number | undefined) => {
      setStatValue(value);
      setIsStatValueValid(true);
    },
    [setStatValue, setIsStatValueValid]
  );

  const validate = () => {
    const newIsStatValid = !!statKey;
    setIsStatKeyValid(newIsStatValid);
    const newIsValueValid = statValue !== undefined && statValue >= 0 && statValue < 100000;
    setIsStatValueValid(newIsValueValid);
    return newIsStatValid && newIsValueValid;
  };

  return (
    <div className={`${!isStatKeyValid || !isStatValueValid ? "mb-8" : "mb-2"}`}>
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label className="text-md font-semibold text-primary whitespace-nowrap w-24">Desired Stats:</Label>
        <div className="flex-grow flex items-center">
          <div className="flex items-center flex-grow h-8 px-3 py-2 text-left text-sm">
            {!(desiredOverallStats?.length > 0) && <span className="text-sm text-muted-foreground">None selected</span>}
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
        {getOrderedDesiredOverallStats().map((desiredStat) => (
          <div className="flex-grow flex items-center" key={desiredStat.stat.key}>
            <div className="h-8 px-3 mr-2 text-sm flex items-center justify-between w-full">
              <div className="flex-grow w-3/4">{desiredStat.stat.key}</div>
              <div className="w-1/4 text-right text-sm text-muted-foreground mr-6">{desiredStat.stat.value}</div>
            </div>
            <div className="flex items-center space-x-4 mr-2">
              <StarSelector max={3} value={desiredStat.priority} />
              <div className="flex items-center justify-center space-x-2">
                {desiredStat.excessUseful ? <Sparkles className="h-6 w-6" /> : <div className="h-6 w-6" />}
                <div className="w-4 h-4" />
              </div>
            </div>
            <div className="flex ml-2 gap-1">
              {/* This leaves space for the close button in the editable section to keep things aligned. It could
                  eventually be replaced by an edit button. */}
              <div className="w-6 h-8" />
              <Button
                className="p-0 w-6 h-8 flex-shrink-0"
                onClick={() => remove(desiredStat.stat.key)}
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
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-grow flex space-x-2">
                  <div className="flex-grow w-3/4">
                    <Select onValueChange={updateStat}>
                      <SelectTrigger
                        aria-describedby={!isStatKeyValid ? "stat-error" : undefined}
                        aria-invalid={!isStatKeyValid}
                        className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                        isValid={isStatKeyValid}
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
                    {!isStatKeyValid && (
                      <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="stat-error">
                        Please select a stat.
                      </p>
                    )}
                  </div>
                  <div className="w-1/4">
                    <DebouncedNumericInput
                      aria-describedby={!isStatValueValid ? "value-error" : undefined}
                      aria-invalid={!isStatValueValid}
                      className="h-8 px-3 text-sm border rounded-md bg-background w-full"
                      isValid={isStatValueValid}
                      onChange={updateValue}
                      value={statValue}
                    />
                    {!isStatValueValid && (
                      <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                        Please enter a value less than 1000.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <StarSelector max={3} onChange={updatePriority} value={priority} />
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-6 h-6" />
                    <Checkbox checked={excessUseful} onCheckedChange={updateExcessUseful} />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
                    <X size={16} />
                  </Button>
                  <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={confirm} size="sm" variant="ghost">
                    <Check size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesiredOverallStatsSelector;
