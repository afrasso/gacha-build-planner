"use client";

import { PlusCircle, X } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stat, StatValue } from "@/types";

interface DesiredStatsSelectorProps {
  desiredStats: StatValue[];
  onChange: (desiredStats: StatValue[]) => void;
}

const DesiredStatsSelector = forwardRef<ISaveableContentHandle, DesiredStatsSelectorProps>(
  ({ desiredStats, onChange }, ref) => {
    const [internalDesiredStats, setInternalDesiredStats] =
      useState<{ stat: string | undefined; value: number }[]>(desiredStats);

    const cancel = () => {
      console.log("Canceling editing of DesiredStatsSelector.");
      setInternalDesiredStats(desiredStats);
    };

    const save = () => {
      console.log("Saving DesiredStatsSelector.");
      if (!validate()) {
        console.error("Saving DesiredStatsSelector failed due to validation error.");
        return false;
      }
      const newDesiredStats = internalDesiredStats.map((internalDesiredStat) => {
        return {
          stat: internalDesiredStat.stat as Stat,
          value: internalDesiredStat.value,
        };
      });
      onChange(newDesiredStats);
      return true;
    };

    const validate = () => {
      console.log("Validating DesiredStatsSelector.");
      for (const internalDesiredStat of internalDesiredStats) {
        if (!internalDesiredStat.stat) {
          console.error("Validation of DesiredStatsSelector failed due to validation error.");
          return false;
        }
      }
      return true;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const handleAddDesiredStat = () => {
      const newDesiredStats = [...internalDesiredStats, { stat: undefined, value: 0 }];
      setInternalDesiredStats(newDesiredStats);
    };

    const handleUpdateDesiredStatStat = (stat: string, index: number) => {
      const newDesiredStats = [...internalDesiredStats];
      newDesiredStats[index].stat = stat;
      setInternalDesiredStats(newDesiredStats);
    };

    const handleUpdateDesiredStatValue = (value: number, index: number) => {
      const newDesiredStats = [...internalDesiredStats];
      newDesiredStats[index].value = value;
      setInternalDesiredStats(newDesiredStats);
    };

    const handleRemoveDesiredStat = (index: number) => {
      const newDesiredStats = internalDesiredStats.filter((_, idx) => idx !== index);
      setInternalDesiredStats(newDesiredStats);
    };

    return (
      <>
        <Label>Desired Stats</Label>
        <div className="flex flex-wrap items-center gap-4">
          {internalDesiredStats.map((desiredStat, index) => (
            <div className="flex items-center" key={index}>
              <Select onValueChange={(stat) => handleUpdateDesiredStatStat(stat, index)} value={desiredStat.stat}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a stat">
                    <div className="flex items-center">{desiredStat.stat || ""}</div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Stat).map((value) => (
                    <SelectItem className="flex items-center" key={value} value={value}>
                      <div className="flex items-center">{value}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DebouncedNumericInput
                onChange={(value: number) => handleUpdateDesiredStatValue(value, index)}
                value={desiredStat.value}
              />
              <Button
                className="h-9 w-9 ml-2"
                onClick={() => handleRemoveDesiredStat(index)}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove desired stat</span>
              </Button>
            </div>
          ))}
          <Button className="h-9 w-9 ml-2" onClick={handleAddDesiredStat} size="icon" variant="ghost">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add desired stat</span>
          </Button>
        </div>
      </>
    );
  }
);

DesiredStatsSelector.displayName = "DesiredStatsSelector";

export default DesiredStatsSelector;
