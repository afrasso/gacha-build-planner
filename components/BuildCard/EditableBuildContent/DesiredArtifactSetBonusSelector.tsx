"use client";

import { Check, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtifactSet, ArtifactSetBonus, ArtifactSetBonusType } from "@/types";

interface DesiredArtifactSetBonusSelectorProps {
  artifactSets: ArtifactSet[];
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  onChange: (desiredArtifactSetBonuses: ArtifactSetBonus[]) => void;
}

const DesiredArtifactSetBonusSelector: React.FC<DesiredArtifactSetBonusSelectorProps> = ({
  artifactSets,
  desiredArtifactSetBonuses = [],
  onChange,
}) => {
  const [isSelectingSet, setIsSelectingSet] = useState(false);
  const [artifactSet, setArtifactSet] = useState<ArtifactSet | undefined>(undefined);
  const [bonusType, setBonusType] = useState<ArtifactSetBonusType | undefined>(undefined);
  const [isArtifactSetValid, setIsArtifactSetValid] = useState(true);
  const [isBonusTypeValid, setIsBonusTypeValid] = useState(true);

  const addSelector = () => {
    setIsSelectingSet(true);
  };

  const updateSet = (artifactSet: ArtifactSet) => {
    setArtifactSet(artifactSet);
    setIsArtifactSetValid(true);
  };

  const updateBonusType = (artifactSetBonusType: ArtifactSetBonusType) => {
    setBonusType(artifactSetBonusType);
    setIsBonusTypeValid(true);
  };

  const cancel = () => {
    setArtifactSet(undefined);
    setBonusType(undefined);
    setIsSelectingSet(false);
    setIsArtifactSetValid(true);
    setIsBonusTypeValid(true);
  };

  const validate = () => {
    const newIsSetValid = !!artifactSet;
    setIsArtifactSetValid(newIsSetValid);
    const newIsBonusTypeValid = !!bonusType;
    setIsBonusTypeValid(newIsBonusTypeValid);
    return newIsSetValid && newIsBonusTypeValid;
  };

  const handleConfirmSelection = () => {
    if (validate()) {
      const bonus: ArtifactSetBonus = { artifactSet: artifactSet!, bonusType: bonusType! };
      setArtifactSet(undefined);
      setBonusType(undefined);
      setIsSelectingSet(false);
      onChange([...desiredArtifactSetBonuses, bonus]);
    }
  };

  const MAX_TOTAL_BONUS_PIECE_COUNT = 4;

  const handleRemoveBonus = (index: number) => {
    onChange(desiredArtifactSetBonuses.filter((bonus, idx) => idx !== index));
  };

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
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <Label className="text-md font-semibold text-primary whitespace-nowrap">Artifact Sets:</Label>
        <Button className="p-1 flex-shrink-0" disabled={!canAddBonus()} onClick={addSelector} size="sm" variant="ghost">
          <PlusCircle size={16} />
        </Button>
      </div>
      <div className="space-y-0">
        {desiredArtifactSetBonuses.map((bonus, index) => (
          <div className="flex items-center space-x-2 py-1 rounded" key={bonus.artifactSet.id}>
            <Image alt={bonus.artifactSet.name} height={32} src={bonus.artifactSet.iconUrl} width={32} />
            <span>{bonus.artifactSet.name}</span>
            <span className="text-sm text-muted-foreground">{bonus.bonusType}</span>
            <Button className="ml-auto" onClick={() => handleRemoveBonus(index)} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2 mt-2">
          {isSelectingSet && (
            <>
              <Select
                onValueChange={(value) =>
                  updateSet(artifactSets.find((artifactSet) => artifactSet.name === value) as ArtifactSet)
                }
              >
                <SelectTrigger className="w-[220px]" isValid={isArtifactSetValid}>
                  <SelectValue placeholder="Select an artifact set" />
                </SelectTrigger>
                <SelectContent>
                  {artifactSets.map((artifactSet) => (
                    <SelectItem className="flex items-center" key={artifactSet.name} value={artifactSet.name}>
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
              <Select onValueChange={updateBonusType}>
                <SelectTrigger className="w-[220px]" isValid={isBonusTypeValid}>
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
              <Button onClick={cancel} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
              {artifactSet && bonusType && (
                <Button onClick={handleConfirmSelection} size="sm" variant="ghost">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

DesiredArtifactSetBonusSelector.displayName = "DesiredArtifactSetsSelector";

export default DesiredArtifactSetBonusSelector;
