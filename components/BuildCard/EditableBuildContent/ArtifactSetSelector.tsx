import { PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React from "react";

import { ArtifactSet } from "../../../types";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface ArtifactSetSelectorProps {
  artifactSets: ArtifactSet[];
  onChange: (artifactSets: ArtifactSet[]) => void;
  selectedArtifactSets: ArtifactSet[];
}

const ArtifactSetSelector: React.FC<ArtifactSetSelectorProps> = ({ artifactSets, onChange, selectedArtifactSets }) => {
  const handleAddArtifactSetSelector = () => {
    if (selectedArtifactSets.length < 2) {
      onChange([...selectedArtifactSets, { iconUrl: "", id: "0", name: "", rarities: [] }]);
    }
  };

  const handleArtifactSetSelection = (artifactSet: ArtifactSet, index: number) => {
    const newArtifactSetSelections = [...selectedArtifactSets];
    newArtifactSetSelections[index] = artifactSet;
    onChange(newArtifactSetSelections);
  };

  const handleRemoveArtifactSetSelector = (index: number) => {
    const newArtifactSetSelections = selectedArtifactSets.filter((artifactSet, idx) => idx !== index);
    onChange(newArtifactSetSelections);
  };

  return (
    <>
      <Label>Artifact Sets</Label>
      <div className="flex flex-wrap items-center gap-4">
        {selectedArtifactSets.map((artifactSetSelection, index) => (
          <div className="flex items-center" key={index}>
            <Select
              onValueChange={(value) =>
                handleArtifactSetSelection(
                  artifactSets.find((artifactSet) => artifactSet.name === value) as ArtifactSet,
                  index
                )
              }
              value={artifactSetSelection.name}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select an item">
                  {artifactSetSelection && (
                    <div className="flex items-center">
                      <Image
                        alt={artifactSetSelection.name}
                        className="mr-2"
                        height={32}
                        src={artifactSetSelection.iconUrl}
                        width={32}
                      />
                      {artifactSetSelection.name}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {artifactSets.map((artifactSet) => (
                  <SelectItem className="flex items-center" key={artifactSet.name} value={artifactSet.name}>
                    <div className="flex items-center">
                      <Image alt={artifactSet.name} className="mr-2" height={32} src={artifactSet.iconUrl} width={32} />
                      {artifactSet.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="h-9 w-9 ml-2"
              onClick={() => handleRemoveArtifactSetSelector(index)}
              size="icon"
              variant="ghost"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove artifact set</span>
            </Button>
          </div>
        ))}
        {selectedArtifactSets.length < 2 && (
          <Button className="h-9 w-9 ml-2" onClick={handleAddArtifactSetSelector} size="icon" variant="ghost">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add artifact set</span>
          </Button>
        )}
      </div>
    </>
  );
};

export default ArtifactSetSelector;
