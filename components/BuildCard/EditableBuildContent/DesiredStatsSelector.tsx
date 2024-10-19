import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DesiredStat, Stat } from "@/types";
import { PlusCircle, X } from "lucide-react";
import React from "react";

interface DesiredStatsSelectorProps {
  desiredStats: DesiredStat[];
  onChange: (desiredStats: DesiredStat[]) => void;
}

const DesiredStatsSelector: React.FC<DesiredStatsSelectorProps> = ({ desiredStats, onChange }) => {
  const handleAddDesiredStat = () => {
    onChange([...desiredStats, { stat: undefined, value: 0 } as DesiredStat]);
  };

  const handleUpdateDesiredStatStat = (stat: Stat, index: number) => {
    const updatedDesiredStats = [...desiredStats];
    updatedDesiredStats[index].stat = stat;
    onChange(updatedDesiredStats);
  };

  const handleUpdateDesiredStatValue = (value: number, index: number) => {
    const updatedDesiredStats = [...desiredStats];
    updatedDesiredStats[index].value = value;
    onChange(updatedDesiredStats);
  };

  const handleRemoveDesiredStat = (index: number) => {
    const newDesiredStats = desiredStats.filter((desiredStat, idx) => idx !== index);
    onChange(newDesiredStats);
  };

  return (
    <>
      <Label>Desired Stats</Label>
      <div className="flex flex-wrap items-center gap-4">
        {desiredStats.map((desiredStat, index) => (
          <div className="flex items-center" key={index}>
            <Select
              onValueChange={(stat) => handleUpdateDesiredStatStat(stat as Stat, index)}
              value={desiredStat.stat?.toString()}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a stat">
                  {<div className="flex items-center">{desiredStat.stat || ""}</div>}
                </SelectValue>
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
              onChange={(value: number) => handleUpdateDesiredStatValue(value, index)}
              value={desiredStat.value}
            />
            <Button className="h-9 w-9 ml-2" onClick={() => handleRemoveDesiredStat(index)} size="icon" variant="ghost">
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
};

export default DesiredStatsSelector;
