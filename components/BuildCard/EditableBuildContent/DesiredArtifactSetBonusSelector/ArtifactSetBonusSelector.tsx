"use client";

import { Check, PlusCircle, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactSet, ArtifactSetBonus } from "@/types";

interface ArtifactSetBonusSelectorProps {
  artifactSetBonuses: ArtifactSetBonus[];
  artifactTypeCount: number;
  getArtifactSet: (id: string) => ArtifactSet;
  getArtifactSets: () => ArtifactSet[];
  onChange: (artifactSetBonuses: ArtifactSetBonus[]) => void;
  title: string;
}

const ArtifactSetBonusSelector: React.FC<ArtifactSetBonusSelectorProps> = ({
  artifactSetBonuses = [],
  artifactTypeCount,
  getArtifactSet,
  getArtifactSets,
  onChange,
  title,
}) => {
  const [isAddingSetBonus, setIsAddingSetBonus] = useState(false);
  const [setId, setSetId] = useState<string | undefined>(undefined);
  const [bonusCount, setBonusCount] = useState<number | undefined>(undefined);
  const [isSetValid, setIsSetValid] = useState(true);
  const [isBonusTypeValid, setIsBonusTypeValid] = useState(true);

  const addSelector = () => {
    setIsAddingSetBonus(true);
  };

  const updateSetId = (setId: string) => {
    setSetId(setId);
    setIsSetValid(true);
  };

  const updateBonusCount = (bonusCountString: string) => {
    const bonusCount = !!bonusCountString ? parseInt(bonusCountString) : undefined;
    setBonusCount(bonusCount);
    setIsBonusTypeValid(true);
  };

  const cancel = () => {
    setSetId(undefined);
    setIsSetValid(true);
    setBonusCount(undefined);
    setIsBonusTypeValid(true);
    setIsAddingSetBonus(false);
  };

  const validate = () => {
    const newIsSetValid = !!setId;
    setIsSetValid(newIsSetValid);
    const newIsBonusTypeValid = !!bonusCount;
    setIsBonusTypeValid(newIsBonusTypeValid);
    return newIsSetValid && newIsBonusTypeValid;
  };

  const confirm = () => {
    if (validate()) {
      const bonus: ArtifactSetBonus = { bonusCount: bonusCount!, setId: setId! };
      setSetId(undefined);
      setBonusCount(undefined);
      setIsAddingSetBonus(false);
      onChange([...artifactSetBonuses, bonus]);
    }
  };

  const remove = (setId: string) => {
    onChange(artifactSetBonuses.filter((bonus) => bonus.setId !== setId));
  };

  const getTotalBonusPieceCount = () => {
    return artifactSetBonuses.reduce((total, bonus) => total + bonus.bonusCount, 0);
  };

  const canAddBonus = () => {
    return getTotalBonusPieceCount() < artifactTypeCount;
  };

  const shouldDisableBonusType = (bonusCount: number) => {
    return artifactTypeCount - getTotalBonusPieceCount() < bonusCount;
  };

  return (
    <div className={`${!isSetValid || !isBonusTypeValid ? "mb-8" : "mb-2"}`}>
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label className="text-md font-semibold text-primary whitespace-nowrap w-24">{title}</Label>
        <div className="flex-grow flex items-center">
          <div className="flex items-center flex-grow h-8 px-3 text-left text-sm">
            {!(artifactSetBonuses?.length > 0) && <span className="text-sm text-muted-foreground">None selected</span>}
          </div>
          <div className="flex ml-2 gap-1">
            <Button
              className="p-0 w-6 h-8 flex-shrink-0"
              disabled={!canAddBonus() || isAddingSetBonus}
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
        {artifactSetBonuses.map((bonus) => {
          const artifactSet = getArtifactSet(bonus.setId);
          return (
            <div className="flex-grow flex items-center" key={bonus.setId}>
              <div className="h-8 px-3 text-left text-sm flex items-center flex-grow">
                <Image alt={artifactSet.name} class-name="mr-2" height={32} src={artifactSet.iconUrl} width={32} />
                {artifactSet.name}
                <span className="text-muted-foreground ml-1">({bonus.bonusCount})</span>
              </div>
              <div className="flex ml-2 gap-1">
                <Button
                  className="p-0 w-6 h-8 flex-shrink-0"
                  onClick={() => remove(bonus.setId)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-grow items-center justify-between gap-2">
        {isAddingSetBonus && (
          <>
            <div className="flex-grow relative">
              <Select onValueChange={(value) => updateSetId(value)}>
                <SelectTrigger
                  aria-describedby={!isSetValid ? "artifact-set-error" : undefined}
                  aria-invalid={!isSetValid}
                  className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                  isValid={isSetValid}
                >
                  <SelectValue placeholder="Select an artifact set" />
                </SelectTrigger>
                <SelectContent>
                  {getArtifactSets().map((artifactSet) => (
                    <SelectItem key={artifactSet.id} value={artifactSet.id}>
                      <div className="flex items-center">
                        <Image
                          alt={artifactSet.name}
                          className="mr-2"
                          height={32}
                          src={artifactSet.iconUrl}
                          width={32}
                        />
                        {artifactSet.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isSetValid && (
                <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="artifact-set-error">
                  Please select an artifact set.
                </p>
              )}
            </div>
            <div className="flex-grow relative">
              <Select onValueChange={updateBonusCount}>
                <SelectTrigger
                  aria-describedby={!isBonusTypeValid ? "bonus-type-error" : undefined}
                  aria-invalid={!isBonusTypeValid}
                  className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                  isValid={isBonusTypeValid}
                >
                  <SelectValue placeholder="Select a bonus type" />
                </SelectTrigger>
                <SelectContent>
                  {(setId ? getArtifactSet(setId).setBonusCounts : []).map((bonusCount) => (
                    <SelectItem
                      className="flex items-center"
                      disabled={shouldDisableBonusType(bonusCount)}
                      key={bonusCount}
                      value={String(bonusCount)}
                    >
                      {bonusCount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isBonusTypeValid && (
                <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="bonus-type-error">
                  Please select a bonus type.
                </p>
              )}
            </div>
            <div className="flex ml-2 gap-1">
              <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
                <X size={16} />
              </Button>
              <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={confirm} size="sm" variant="ghost">
                <Check size={16} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtifactSetBonusSelector;
