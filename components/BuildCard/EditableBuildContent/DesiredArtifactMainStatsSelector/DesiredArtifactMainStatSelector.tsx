"use client";

import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactType, Stat } from "@/types";

interface DesiredArtifactMainStatSelectorProps {
  artifactType: ArtifactType;
  mainStats: Stat[];
  onChange: (stat: Stat | undefined) => void;
  stat: Stat | undefined;
}

const DesiredArtifactMainStatsSelector: React.FC<DesiredArtifactMainStatSelectorProps> = ({
  artifactType,
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
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label className="text-sm font-semibold text-primary whitespace-nowrap w-24 pl-4">{artifactType}:</Label>
        <div className="flex-grow relative">
          <Select onValueChange={(value) => update(value as Stat)} value={internalStat}>
            <SelectTrigger
              aria-describedby={!isValid ? "main-stat-error" : undefined}
              aria-invalid={!isValid}
              className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
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
          {!isValid && (
            <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="main-stat-error">
              Please select a main stat.
            </p>
          )}
        </div>
        <div>
          <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
            <X size={16} />
          </Button>
          <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={save} size="sm" variant="ghost">
            <Check size={16} />
          </Button>
        </div>
      </div>
    );
  };

  const renderNonEditableContent = () => {
    return (
      <div className="flex flex-grow items-center justify-between gap-2" data-testid={artifactType}>
        <Label className="text-sm font-semibold text-primary whitespace-nowrap w-24 pl-4">{artifactType}:</Label>
        <div className="flex flex-grow items-center">
          <div
            className="h-8 px-3 text-left text-sm flex items-center flex-grow rounded-md hover:bg-accent cursor-pointer"
            onClick={edit}
          >
            {internalStat ? (
              <span data-testid="stat-populated">{internalStat}</span>
            ) : (
              <span className="text-muted-foreground" data-testid="stat-not-populated">
                Not selected
              </span>
            )}
          </div>
          <Button
            className="p-0 w-6 h-8 flex-shrink-0"
            disabled={!internalStat}
            onClick={clear}
            size="sm"
            variant="ghost"
          >
            <Trash2 size={16} />
          </Button>
          <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={edit} size="sm" variant="ghost">
            <Pencil size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${!isValid ? "mb-8" : "mb-2"}`}>
      {isEditing ? renderEditableContent() : renderNonEditableContent()}
    </div>
  );
};

export default DesiredArtifactMainStatsSelector;
