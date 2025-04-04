"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

export enum EquipStatus {
  EQUIPPED = "EQUIPPED",
  UNEQUIPPED = "UNEQUIPPED",
}

export enum LockStatus {
  LOCKED = "LOCKED",
  UNLOCKED = "UNLOCKED",
}

export interface ArtifactFilter {
  equipStatuses: Partial<Record<EquipStatus, boolean>>;
  lockStatuses: Partial<Record<LockStatus, boolean>>;
  mainStatKeys: Partial<Record<string, boolean>>;
  maxLevel: number;
  maxRarity: number;
  minLevel: number;
  minRarity: number;
  setIds: Partial<Record<string, boolean>>;
  typeKeys: Partial<Record<string, boolean>>;
}

const MIN_LEVEL = 0;
const MIN_RARITY = 1;
const MAX_LEVEL = 20;
const MAX_RARITY = 5;

interface ArtifactFilterDialogProps {
  filter?: ArtifactFilter;
  onFilterChange: (filter: ArtifactFilter) => void;
}

export const isInFilter = ({ artifact, filter }: { artifact: ArtifactData; filter: ArtifactFilter | undefined }) => {
  if (!filter) {
    return true;
  }
  if (
    Object.values(filter.equipStatuses).includes(true) &&
    ((!filter.equipStatuses[EquipStatus.EQUIPPED] && artifact.characterId) ||
      (!filter.equipStatuses[EquipStatus.UNEQUIPPED] && !artifact.characterId))
  ) {
    return false;
  }
  if (
    Object.values(filter.lockStatuses).includes(true) &&
    ((!filter.lockStatuses[LockStatus.LOCKED] && artifact.isLocked) ||
      (!filter.lockStatuses[LockStatus.UNLOCKED] && !artifact.isLocked))
  ) {
    return false;
  }
  if (artifact.level < filter.minLevel || artifact.level > filter.maxLevel) {
    return false;
  }
  if (artifact.rarity < filter.minRarity || artifact.rarity > filter.maxRarity) {
    return false;
  }
  if (Object.values(filter.mainStatKeys).includes(true) && !filter.mainStatKeys[artifact.mainStatKey]) {
    return false;
  }
  if (Object.values(filter.setIds).includes(true) && !filter.setIds[artifact.setId]) {
    return false;
  }
  if (Object.values(filter.typeKeys).includes(true) && !filter.typeKeys[artifact.typeKey]) {
    return false;
  }
  return true;
};

export function ArtifactFilterDialog({ filter, onFilterChange }: ArtifactFilterDialogProps) {
  const { getArtifactSets, getArtifactTypes, getStatDefinitions } = useDataContext();

  const [equipStatuses, setEquipStatuses] = useState<Partial<Record<EquipStatus, boolean>>>(
    filter?.equipStatuses || {}
  );
  const [lockStatuses, setLockStatuses] = useState<Partial<Record<LockStatus, boolean>>>(filter?.lockStatuses || {});
  const [mainStatKeys, setMainStatKeys] = useState<Partial<Record<string, boolean>>>(filter?.mainStatKeys || {});
  const [maxLevel, setMaxLevel] = useState<number>(MAX_LEVEL);
  const [maxRarity, setMaxRarity] = useState<number>(MAX_RARITY);
  const [minLevel, setMinLevel] = useState<number>(MIN_LEVEL);
  const [minRarity, setMinRarity] = useState<number>(MIN_RARITY);
  const [setIds, setSetIds] = useState<Partial<Record<string, boolean>>>(filter?.setIds || {});
  const [typeKeys, setTypeKeys] = useState<Partial<Record<string, boolean>>>(filter?.typeKeys || {});

  const clearFilters = () => {
    setEquipStatuses({});
    setLockStatuses({});
    setMainStatKeys({});
    setMinLevel(MIN_LEVEL);
    setMinRarity(MIN_RARITY);
    setMaxLevel(MAX_LEVEL);
    setMaxRarity(MAX_RARITY);
    setSetIds({});
    setTypeKeys({});
  };

  const onEquipStatusToggle = ({ equipStatus, pressed }: { equipStatus: EquipStatus; pressed: boolean }) => {
    setEquipStatuses((prev) => ({ ...prev, [equipStatus]: pressed }));
  };

  const onLockStatusToggle = ({ lockStatus, pressed }: { lockStatus: LockStatus; pressed: boolean }) => {
    setLockStatuses((prev) => ({ ...prev, [lockStatus]: pressed }));
  };

  const onMainStatToggle = ({ mainStatKey, pressed }: { mainStatKey: string; pressed: boolean }) =>
    setMainStatKeys((prev) => ({ ...prev, [mainStatKey]: pressed }));

  const onSetIdToggle = ({ pressed, setId }: { pressed: boolean; setId: string }) =>
    setSetIds((prev) => ({ ...prev, [setId]: pressed }));

  const onTypeToggle = ({ pressed, typeKey }: { pressed: boolean; typeKey: string }) =>
    setTypeKeys((prev) => ({ ...prev, [typeKey]: pressed }));

  const isEquipStatusToggled = (equipStatus: EquipStatus) => !!equipStatuses[equipStatus];

  const isLockStatusToggled = (lockStatus: LockStatus) => !!lockStatuses[lockStatus];

  const isMainStatToggled = (mainStatKey: string) => !!mainStatKeys[mainStatKey];

  const isSetIdToggled = (setId: string) => !!setIds[setId];

  const isTypeToggled = (typeKey: string) => !!typeKeys[typeKey];

  const onMaxLevelChange = (level?: number) => {
    if (!level) {
      setMaxLevel(MAX_LEVEL);
    } else {
      setMaxLevel(Math.min(MAX_LEVEL, level));
      setMinLevel(Math.min(minLevel, level));
    }
  };

  const onMinLevelChange = (level?: number) => {
    if (!level) {
      setMinLevel(MIN_LEVEL);
    } else {
      setMinLevel(Math.max(MIN_LEVEL, level));
      setMaxLevel(Math.max(maxLevel, level));
    }
  };

  const onMaxRarityChange = (rarity?: number) => {
    if (!rarity) {
      setMaxRarity(MAX_RARITY);
    } else {
      setMaxRarity(Math.min(MAX_RARITY, rarity));
      setMinRarity(Math.min(minRarity, rarity));
    }
  };

  const onMinRarityChange = (rarity?: number) => {
    if (!rarity) {
      setMinRarity(MIN_RARITY);
    } else {
      setMinRarity(Math.max(MIN_RARITY, rarity));
      setMaxRarity(Math.max(maxRarity, rarity));
    }
  };

  const onSubmit = () => {
    onFilterChange({
      equipStatuses,
      lockStatuses,
      mainStatKeys,
      maxLevel,
      maxRarity,
      minLevel,
      minRarity,
      setIds,
      typeKeys,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] w-11/12">
        <DialogHeader>
          <DialogTitle>Filter Artifacts</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Equip Status</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(EquipStatus).map((equipStatus) => (
                <Toggle
                  key={equipStatus}
                  onPressedChange={(pressed) => onEquipStatusToggle({ equipStatus, pressed })}
                  pressed={isEquipStatusToggled(equipStatus)}
                >
                  {equipStatus}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Lock Status</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(LockStatus).map((lockStatus) => (
                <Toggle
                  key={lockStatus}
                  onPressedChange={(pressed) => onLockStatusToggle({ lockStatus, pressed })}
                  pressed={isLockStatusToggled(lockStatus)}
                >
                  {lockStatus}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Type</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {getArtifactTypes().map((artifactType) => (
                <Toggle
                  key={artifactType.key}
                  onPressedChange={(pressed) => onTypeToggle({ pressed, typeKey: artifactType.key })}
                  pressed={isTypeToggled(artifactType.key)}
                >
                  {artifactType.key}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="p-4 mb-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Rarity</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-sm font-semibold text-primary">Min</Label>
              <DebouncedNumericInput max={MAX_RARITY} min={MIN_RARITY} onChange={onMinRarityChange} value={minRarity} />
              <Label className="text-sm font-semibold text-primary">Max</Label>
              <DebouncedNumericInput max={MAX_RARITY} min={MIN_RARITY} onChange={onMaxRarityChange} value={maxRarity} />
            </div>
          </div>
          <div className="p-4 mb-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Level</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-sm font-semibold text-primary">Min</Label>
              <DebouncedNumericInput max={MAX_LEVEL} min={MIN_LEVEL} onChange={onMinLevelChange} value={minLevel} />
              <Label className="text-sm font-semibold text-primary">Max</Label>
              <DebouncedNumericInput max={MAX_LEVEL} min={MIN_LEVEL} onChange={onMaxLevelChange} value={maxLevel} />
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Main Stat</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-items-center">
              {getStatDefinitions().map((statDefinition) => (
                <Toggle
                  key={statDefinition.key}
                  onPressedChange={(pressed) => onMainStatToggle({ mainStatKey: statDefinition.key, pressed })}
                  pressed={isMainStatToggled(statDefinition.key)}
                >
                  {statDefinition.key}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Set</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
              {getArtifactSets().map((set) => (
                <Toggle
                  key={set.id}
                  onPressedChange={(pressed) => onSetIdToggle({ pressed, setId: set.id })}
                  pressed={isSetIdToggled(set.id)}
                >
                  {set.name}
                </Toggle>
              ))}
            </div>
          </div>
        </ScrollArea>
        <Button onClick={clearFilters} variant="outline">
          Clear All
        </Button>
        <DialogTrigger asChild>
          <Button onClick={onSubmit} type="submit">
            Apply Filters
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
