"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { getMainStats } from "@/constants";
import { ArtifactType, StatKey } from "@/types";

interface MainStatsDialogContentProps {
  artifactType: ArtifactType;
  mainStats: StatKey[];
  onUpdate: (mainStats: StatKey[]) => void;
}

export function MainStatsDialogContent({ artifactType, mainStats, onUpdate }: MainStatsDialogContentProps) {
  const [internalMainStats, setInternalMainStats] = useState<StatKey[]>(mainStats);

  const clear = () => {
    setInternalMainStats([]);
  };

  const onMainStatToggle = ({ mainStat, pressed }: { mainStat: StatKey; pressed: boolean }) => {
    if (pressed && !internalMainStats.includes(mainStat)) {
      setInternalMainStats((prev) => [...prev, mainStat]);
    } else if (!pressed && internalMainStats.includes(mainStat)) {
      setInternalMainStats((prev) => prev.filter((stat) => stat !== mainStat));
    }
  };

  const isMainStatToggled = (mainStat: StatKey) => internalMainStats.includes(mainStat);

  const onSubmit = () => {
    onUpdate(internalMainStats);
  };

  return (
    <DialogContent className="sm:max-w-[600px] md:max-w-[800px] w-11/12">
      <DialogHeader>
        <DialogTitle>Select main stats for ${artifactType}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-items-center">
        {getMainStats({ artifactType }).map((stat) => (
          <Toggle
            key={stat}
            onPressedChange={(pressed) => onMainStatToggle({ mainStat: stat, pressed })}
            pressed={isMainStatToggled(stat)}
          >
            {stat}
          </Toggle>
        ))}
      </div>
      <Button onClick={clear} variant="outline">
        Clear All
      </Button>
      <DialogTrigger asChild>
        <Button onClick={onSubmit} type="submit">
          Submit
        </Button>
      </DialogTrigger>
    </DialogContent>
  );
}
