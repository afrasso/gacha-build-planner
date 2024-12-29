"use client";

import { Check, PlusCircle, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactSetBonus, ArtifactSetBonusType } from "@/types";

interface DesiredArtifactSetBonusSelectorProps {
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  onChange: (desiredArtifactSetBonuses: ArtifactSetBonus[]) => void;
}

const DesiredArtifactSetBonusSelector: React.FC<DesiredArtifactSetBonusSelectorProps> = ({
  desiredArtifactSetBonuses = [],
  onChange,
}) => {
  const { artifactSets, getArtifactSet } = useGenshinDataContext();

  const [isAddingSetBonus, setIsAddingSetBonus] = useState(false);
  const [setId, setSetId] = useState<string | undefined>(undefined);
  const [bonusType, setBonusType] = useState<ArtifactSetBonusType | undefined>(undefined);
  const [isSetValid, setIsSetValid] = useState(true);
  const [isBonusTypeValid, setIsBonusTypeValid] = useState(true);

  const addSelector = () => {
    setIsAddingSetBonus(true);
  };

  const updateSetId = (setId: string) => {
    setSetId(setId);
    setIsSetValid(true);
  };

  const updateBonusType = (artifactSetBonusType: ArtifactSetBonusType) => {
    setBonusType(artifactSetBonusType);
    setIsBonusTypeValid(true);
  };

  const cancel = () => {
    setSetId(undefined);
    setIsSetValid(true);
    setBonusType(undefined);
    setIsBonusTypeValid(true);
    setIsAddingSetBonus(false);
  };

  const validate = () => {
    const newIsSetValid = !!setId;
    setIsSetValid(newIsSetValid);
    const newIsBonusTypeValid = !!bonusType;
    setIsBonusTypeValid(newIsBonusTypeValid);
    return newIsSetValid && newIsBonusTypeValid;
  };

  const confirm = () => {
    if (validate()) {
      const bonus: ArtifactSetBonus = { bonusType: bonusType!, setId: setId! };
      setSetId(undefined);
      setBonusType(undefined);
      setIsAddingSetBonus(false);
      onChange([...desiredArtifactSetBonuses, bonus]);
    }
  };

  const remove = (setId: string) => {
    onChange(desiredArtifactSetBonuses.filter((bonus) => bonus.setId !== setId));
  };

  const MAX_TOTAL_BONUS_PIECE_COUNT = 4;

  const getPieceCount = (bonusType: ArtifactSetBonusType) => {
    return bonusType === ArtifactSetBonusType.TWO_PIECE ? 2 : 4;
  };

  const getTotalBonusPieceCount = () => {
    return desiredArtifactSetBonuses.reduce((total, bonus) => total + getPieceCount(bonus.bonusType), 0);
  };

  const canAddBonus = () => {
    return getTotalBonusPieceCount() < MAX_TOTAL_BONUS_PIECE_COUNT;
  };

  const shouldDisableBonusType = (bonusType: ArtifactSetBonusType) => {
    return MAX_TOTAL_BONUS_PIECE_COUNT - getTotalBonusPieceCount() < getPieceCount(bonusType);
  };

  return (
    <div className={`${!isSetValid || !isBonusTypeValid ? "mb-8" : "mb-2"}`}>
      <div className="flex flex-grow items-center justify-between gap-2">
        <Label className="text-md font-semibold text-primary whitespace-nowrap w-24">Set Bonuses:</Label>
        <div className="flex-grow flex items-center">
          <div className="flex items-center flex-grow h-8 px-3 text-left text-sm">
            {!(desiredArtifactSetBonuses?.length > 0) && (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
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
        {desiredArtifactSetBonuses.map((bonus) => {
          const artifactSet = getArtifactSet(bonus.setId);
          return (
            <div className="flex-grow flex items-center" key={bonus.setId}>
              <div className="h-8 px-3 text-left text-sm flex items-center flex-grow">
                <Image alt={artifactSet.name} class-name="mr-2" height={32} src={artifactSet.iconUrl} width={32} />
                {artifactSet.name}
                <span className="text-muted-foreground ml-1">({bonus.bonusType})</span>
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
                  {artifactSets.map((artifactSet) => (
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
              <Select onValueChange={updateBonusType}>
                <SelectTrigger
                  aria-describedby={!isBonusTypeValid ? "bonus-type-error" : undefined}
                  aria-invalid={!isBonusTypeValid}
                  className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
                  isValid={isBonusTypeValid}
                >
                  <SelectValue placeholder="Select a bonus type" />
                </SelectTrigger>
                <SelectContent>
                  {[ArtifactSetBonusType.TWO_PIECE, ArtifactSetBonusType.FOUR_PIECE].map((bonusType) => (
                    <SelectItem
                      className="flex items-center"
                      disabled={shouldDisableBonusType(bonusType)}
                      key={bonusType}
                      value={bonusType}
                    >
                      {bonusType}
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

export default DesiredArtifactSetBonusSelector;
