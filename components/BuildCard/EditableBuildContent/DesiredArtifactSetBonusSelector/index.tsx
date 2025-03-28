"use client";

import React from "react";

import { useDataContext } from "@/contexts/DataContext";
import { ArtifactSet, ArtifactSetBonus } from "@/types";

import ArtifactSetBonusSelector from "./ArtifactSetBonusSelector";

interface DesiredArtifactSetBonusSelectorProps {
  desiredArtifactSetBonuses: ArtifactSetBonus[];
  onChange: (desiredArtifactSetBonuses: ArtifactSetBonus[]) => void;
}

const DesiredArtifactSetBonusSelector: React.FC<DesiredArtifactSetBonusSelectorProps> = ({
  desiredArtifactSetBonuses = [],
  onChange,
}) => {
  const { getArtifactSet, getArtifactSets, getArtifactTypes } = useDataContext();

  const sets = getArtifactSets();
  const artifactTypeCount = getArtifactTypes().length;
  const uncategorizedArtifactSets = sets.filter((set) => !set.category);
  const artifactSetsGroupedByCategory = sets.reduce<Record<string, ArtifactSet[]>>((acc, set) => {
    if (set.category) {
      if (!acc[set.category]) {
        acc[set.category] = [];
      }
      acc[set.category].push(set);
    }
    return acc;
  }, {});

  getArtifactSets().forEach((artifactSet: ArtifactSet) => {
    if (artifactSet.category) {
      if (!artifactSetsGroupedByCategory[artifactSet.category]) {
        artifactSetsGroupedByCategory[artifactSet.category] = [];
      }
      artifactSetsGroupedByCategory[artifactSet.category].push(artifactSet);
    } else {
      uncategorizedArtifactSets.push(artifactSet);
    }
  });

  const getSetBonusesForCategory = (category?: string) => {
    return desiredArtifactSetBonuses.filter((setBonus) => getArtifactSet(setBonus.setId).category === category);
  };

  const onChangeOfSetBonusesForCategory = (category?: string) => {
    const unchangedSetBonuses = desiredArtifactSetBonuses.filter(
      (setBonus) => getArtifactSet(setBonus.setId).category !== category
    );
    return (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
      onChange([...unchangedSetBonuses, ...desiredArtifactSetBonuses]);
    };
  };

  return (
    <>
      {uncategorizedArtifactSets.length > 0 && (
        <ArtifactSetBonusSelector
          artifactSetBonuses={getSetBonusesForCategory(undefined)}
          artifactTypeCount={artifactTypeCount}
          getArtifactSet={getArtifactSet}
          getArtifactSets={() => uncategorizedArtifactSets}
          onChange={onChangeOfSetBonusesForCategory(undefined)}
          title="Set Bonuses:"
        />
      )}
      {Object.entries(artifactSetsGroupedByCategory).map(([category, artifactSets]) => (
        <ArtifactSetBonusSelector
          artifactSetBonuses={getSetBonusesForCategory(category)}
          artifactTypeCount={artifactTypeCount}
          getArtifactSet={getArtifactSet}
          getArtifactSets={() => artifactSets}
          key={category}
          onChange={onChangeOfSetBonusesForCategory(category)}
          title={`Set Bonuses (${category}):`}
        />
      ))}
    </>
  );
};

export default DesiredArtifactSetBonusSelector;
