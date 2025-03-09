"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { MainStatsDialogContent } from "./MainStatsDialogContent";

interface DesiredArtifactMainStatSelectorProps {
  artifactTypeKey: string;
  mainStatKeys: string[];
  onUpdate: (mainStatKeys: string[]) => void;
}

const DesiredArtifactMainStatsSelector: React.FC<DesiredArtifactMainStatSelectorProps> = ({
  artifactTypeKey,
  mainStatKeys,
  onUpdate,
}) => {
  return (
    <div className={"mb-2"}>
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label
          className="text-sm font-semibold text-primary whitespace-nowrap w-24 pl-4"
          data-testid={`${artifactTypeKey}-label`}
        >
          {artifactTypeKey}:
        </Label>
        <div className="flex-grow relative">{JSON.stringify(mainStatKeys)}</div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="p-0 w-6 h-8 flex-shrink-0" size="sm" variant="ghost">
                <Pencil size={16} />
              </Button>
            </DialogTrigger>
            <MainStatsDialogContent
              artifactTypeKey={artifactTypeKey}
              mainStatKeys={mainStatKeys}
              onUpdate={onUpdate}
            ></MainStatsDialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DesiredArtifactMainStatsSelector;
