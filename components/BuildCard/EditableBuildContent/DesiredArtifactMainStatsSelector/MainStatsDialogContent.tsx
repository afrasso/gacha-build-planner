"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { useDataContext } from "@/contexts/DataContext";

interface MainStatsDialogContentProps {
  artifactTypeKey: string;
  mainStatKeys: string[];
  onUpdate: (mainStatKeys: string[]) => void;
}

export function MainStatsDialogContent({ artifactTypeKey, mainStatKeys, onUpdate }: MainStatsDialogContentProps) {
  const { getPossibleArtifactMainStats } = useDataContext();

  const [internalMainStatKeys, setInternalMainStatKeys] = useState<string[]>(mainStatKeys);

  const clear = () => {
    setInternalMainStatKeys([]);
  };

  const onMainStatToggle = ({ mainStatKey, pressed }: { mainStatKey: string; pressed: boolean }) => {
    if (pressed && !internalMainStatKeys.includes(mainStatKey)) {
      setInternalMainStatKeys((prev) => [...prev, mainStatKey]);
    } else if (!pressed && internalMainStatKeys.includes(mainStatKey)) {
      setInternalMainStatKeys((prev) => prev.filter((statKey) => statKey !== mainStatKey));
    }
  };

  const isMainStatToggled = (mainStatKey: string) => internalMainStatKeys.includes(mainStatKey);

  const onSubmit = () => {
    onUpdate(internalMainStatKeys);
  };

  return (
    <DialogContent className="sm:max-w-[600px] md:max-w-[800px] w-11/12">
      <DialogHeader>
        <DialogTitle>Select main stats for {artifactTypeKey}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-items-center">
        {getPossibleArtifactMainStats({ artifactTypeKey }).map((statKey) => (
          <Toggle
            key={statKey}
            onPressedChange={(pressed) => onMainStatToggle({ mainStatKey: statKey, pressed })}
            pressed={isMainStatToggled(statKey)}
          >
            {statKey}
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
