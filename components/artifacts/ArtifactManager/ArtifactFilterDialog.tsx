"use client";

import { Filter } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactType, Stat } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import DebouncedNumericInput from "@/components/ui/custom/DebouncedNumericInput";

export interface ArtifactFilter {
  mainStats: Partial<Record<Stat, boolean>>;
  maxLevel: number;
  maxRarity: number;
  minLevel: number;
  minRarity: number;
  setIds: Partial<Record<string, boolean>>;
  types: Partial<Record<ArtifactType, boolean>>;
}

interface ArtifactFilterDialogProps {
  filter?: ArtifactFilter;
  onFilterChange: (filter: ArtifactFilter) => void;
}

export const isInFilter = ({ artifact, filter }: { artifact: Artifact; filter: ArtifactFilter | undefined }) => {
  if (!filter) {
    return true;
  }
  if (Object.values(filter.types).includes(true) && filter.types[artifact.type] === false) {
    return false;
  }
  if (artifact.level < filter.minLevel || artifact.level > filter.maxLevel) {
    return false;
  }
  if (artifact.rarity < filter.minRarity || artifact.rarity > filter.maxRarity) {
    return false;
  }
  if (Object.values(filter.mainStats).includes(true) && filter.mainStats[artifact.mainStat] === false) {
    return false;
  }
  if (Object.values(filter.setIds).includes(true) && filter.setIds[artifact.setId] === false) {
    return false;
  }
  return true;
};

export function ArtifactFilterDialog({ filter, onFilterChange }: ArtifactFilterDialogProps) {
  const { artifactSets } = useGenshinDataContext();

  const [mainStats, setMainStats] = useState<Partial<Record<Stat, boolean>>>(filter?.mainStats || {});
  const [maxLevel, setMaxLevel] = useState<number>(20);
  const [maxRarity, setMaxRarity] = useState<number>(5);
  const [minLevel, setMinLevel] = useState<number>(0);
  const [minRarity, setMinRarity] = useState<number>(1);
  const [setIds, setSetIds] = useState<Partial<Record<string, boolean>>>(filter?.setIds || {});
  const [types, setTypes] = useState<Partial<Record<ArtifactType, boolean>>>(filter?.types || {});

  const clearFilters = () => {
    setMainStats({});
    setSetIds({});
    setTypes({});
  };

  const onMainStatToggle = ({ mainStat, pressed }: { mainStat: Stat; pressed: boolean }) =>
    setMainStats((prev) => ({ ...prev, [mainStat]: pressed }));

  const onSetIdToggle = ({ pressed, setId }: { pressed: boolean; setId: string }) =>
    setSetIds((prev) => ({ ...prev, [setId]: pressed }));

  const onTypeToggle = ({ pressed, type }: { pressed: boolean; type: ArtifactType }) =>
    setTypes((prev) => ({ ...prev, [type]: pressed }));

  const isMainStatToggled = (mainStat: Stat) => mainStats[mainStat];

  const isSetIdToggled = (setId: string) => setIds[setId];

  const isTypeToggled = (type: ArtifactType) => types[type];

  const onMaxLevelChange = (level?: number) => {
    if (!level) {
      setMaxLevel(20);
    } else {
      setMaxLevel(Math.min(20, level));
      setMinLevel(Math.min(minLevel, level));
    }
  };

  const onMinLevelChange = (level?: number) => {
    if (!level) {
      setMinLevel(1);
    } else {
      setMinLevel(Math.max(0, level));
      setMaxLevel(Math.max(maxLevel, level));
    }
  };

  const onMaxRarityChange = (rarity?: number) => {
    if (!rarity) {
      setMaxRarity(5);
    } else {
      setMaxRarity(Math.min(5, rarity));
      setMinRarity(Math.min(minRarity, rarity));
    }
  };

  const onMinRarityChange = (rarity?: number) => {
    if (!rarity) {
      setMinRarity(1);
    } else {
      setMinRarity(Math.max(1, rarity));
      setMaxRarity(Math.max(maxRarity, rarity));
    }
  };

  const onSubmit = () => {
    onFilterChange({ mainStats, maxLevel, maxRarity, minLevel, minRarity, setIds, types });
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
        <div>{JSON.stringify(filter)}</div>
        <div>{JSON.stringify(mainStats)}</div>
        <div>{JSON.stringify(setIds)}</div>
        <div>{JSON.stringify(types)}</div>
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Type</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Object.values(ArtifactType).map((type) => (
                <Toggle
                  key={type}
                  onPressedChange={(pressed) => onTypeToggle({ pressed, type })}
                  pressed={isTypeToggled(type)}
                >
                  {type}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-1/3 bg-gray-300 h-px" role="separator" aria-hidden="true" />
          </div>
          <div className="p-4 mb-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Rarity</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-sm font-semibold text-primary">Min</Label>
              <DebouncedNumericInput min={1} max={5} onChange={onMinRarityChange} value={minRarity} />
              <Label className="text-sm font-semibold text-primary">Max</Label>
              <DebouncedNumericInput min={1} max={5} onChange={onMaxRarityChange} value={maxRarity} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-1/3 bg-gray-300 h-px" role="separator" aria-hidden="true" />
          </div>
          <div className="p-4 mb-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Level</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-sm font-semibold text-primary">Min</Label>
              <DebouncedNumericInput min={0} max={20} onChange={onMinLevelChange} value={minLevel} />
              <Label className="text-sm font-semibold text-primary">Max</Label>
              <DebouncedNumericInput min={0} max={20} onChange={onMaxLevelChange} value={maxLevel} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-1/3 bg-gray-300 h-px" role="separator" aria-hidden="true" />
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Main Stat</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-items-center">
              {Object.values(Stat).map((stat) => (
                <Toggle
                  key={stat}
                  onPressedChange={(pressed) => onMainStatToggle({ mainStat: stat, pressed })}
                  pressed={isMainStatToggled(stat)}
                >
                  {stat}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-1/3 bg-gray-300 h-px" role="separator" aria-hidden="true" />
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Label className="text-md font-semibold text-primary">Set</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
              {artifactSets.map((set) => (
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
