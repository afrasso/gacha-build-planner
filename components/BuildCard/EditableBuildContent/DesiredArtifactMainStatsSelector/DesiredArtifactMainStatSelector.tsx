"use client";

import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stat } from "@/types";

interface DesiredArtifactMainStatSelectorProps {
  mainStats: Stat[];
  onChange: (stat: Stat | undefined) => void;
  stat: Stat | undefined;
}

const DesiredArtifactMainStatsSelector: React.FC<DesiredArtifactMainStatSelectorProps> = ({
  mainStats,
  onChange,
  stat,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [internalStat, setInternalStat] = useState<Stat | undefined>(stat);

  const edit = () => {
    setIsEditing(true);
  };

  const save = () => {
    if (validate()) {
      onChange(internalStat);
      setIsEditing(false);
    }
  };

  const cancel = () => {
    setInternalStat(stat);
    setIsEditing(false);
    setIsValid(true);
  };

  const clear = () => {
    onChange(undefined);
    setInternalStat(undefined);
  };

  const update = (stat: Stat) => {
    setInternalStat(stat);
    setIsValid(true);
  };

  const validate = () => {
    const newIsValid = !!internalStat;
    setIsValid(newIsValid);
    return newIsValid;
  };

  const renderEditableContent = () => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => update(value as Stat)} value={internalStat}>
            <SelectTrigger
              className="h-10 px-3 py-2 text-left border rounded-md bg-background w-full"
              isValid={isValid}
            >
              <SelectValue placeholder="Select a main stat" />
            </SelectTrigger>
            <SelectContent>
              {mainStats.map((stat) => (
                <SelectItem key={stat} value={stat}>
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="p-1 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
            <X size={16} />
          </Button>
          <Button className="p-1 flex-shrink-0" onClick={save} size="sm" variant="ghost">
            <Check size={16} />
          </Button>
        </div>
        <div className="h-6">{!isValid && <p className="text-red-500 text-sm">Please select a main stat.</p>}</div>
      </div>
    );
  };

  const renderNonEditableContent = () => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 flex-grow">
          <div
            className="h-10 px-3 py-2 text-left flex items-center w-full rounded-md hover:bg-accent cursor-pointer"
            onClick={edit}
          >
            {internalStat ? <span>{internalStat}</span> : <span className="text-muted-foreground">Not selected</span>}
          </div>
          <Button className="p-1 flex-shrink-0" onClick={clear} size="sm" variant="ghost">
            <Trash2 size={16} />
          </Button>
          <Button className="p-1 flex-shrink-0" onClick={edit} size="sm" variant="ghost">
            <Pencil size={16} />
          </Button>
        </div>
        <div className="h-6"></div>
      </div>
    );
  };

  return isEditing ? renderEditableContent() : renderNonEditableContent();
};

export default DesiredArtifactMainStatsSelector;
