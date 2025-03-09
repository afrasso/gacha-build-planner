"use client";

import { ArtifactData, ArtifactSet, ArtifactSetBonus, DesiredOverallStat, IBuild, ICharacter, IWeapon } from "@/types";
import { Misc } from "@/types/misc";

import {
  buildGetArtifactLevelsPerSubstatRoll,
  buildGetArtifactMainStatMaxValue,
  buildGetArtifactMainStatOdds,
  buildGetArtifactMaxLevel,
  buildGetArtifactMaxSubStatCount,
  buildGetArtifactSet,
  buildGetArtifactSubStatRelativeLikelihood,
  buildGetArtifactTypes,
  buildGetArtifactTypesWithVariableMainStats,
  buildGetCharacter,
  buildGetInitialArtifactSubStatCountOdds,
  buildGetOverallStatDefinition,
  buildGetOverallStatDefinitions,
  buildGetPossibleArtifactMainStats,
  buildGetPossibleArtifactSubStatRollValues,
  buildGetPossibleArtifactSubStats,
  buildGetStatDefinition,
  buildGetStatDefinitions,
  buildGetWeapon,
} from "./builders";
import { DataContext } from "./DataContext";

interface DataProviderProps {
  artifactSets: ArtifactSet[];
  characters: ICharacter[];
  children: React.ReactNode;
  constructBuild: ({
    artifacts,
    characterId,
    desiredArtifactMainStats,
    desiredArtifactSetBonuses,
    desiredOverallStats,
    lastUpdatedDate,
    sortOrder,
    weaponId,
  }: {
    artifacts?: Record<string, ArtifactData>;
    characterId: string;
    desiredArtifactMainStats?: Record<string, string[]>;
    desiredArtifactSetBonuses?: ArtifactSetBonus[];
    desiredOverallStats?: DesiredOverallStat[];
    lastUpdatedDate?: string;
    sortOrder?: number;
    weaponId?: string;
  }) => IBuild;
  misc: Misc;
  weapons: IWeapon[];
}

export const DataProvider: React.FC<DataProviderProps> = ({
  artifactSets,
  characters,
  children,
  constructBuild,
  misc,
  weapons,
}) => {
  const getArtifactLevelsPerSubStatRoll = buildGetArtifactLevelsPerSubstatRoll(misc);
  const getArtifactMainStatMaxValue = buildGetArtifactMainStatMaxValue(misc);
  const getArtifactMainStatOdds = buildGetArtifactMainStatOdds(misc);
  const getArtifactMaxLevel = buildGetArtifactMaxLevel(misc);
  const getArtifactMaxSubStatCount = buildGetArtifactMaxSubStatCount(misc);
  const getArtifactSet = buildGetArtifactSet(artifactSets);
  const getArtifactSets = () => artifactSets;
  const getArtifactSubStatRelativeLikelihood = buildGetArtifactSubStatRelativeLikelihood(misc);
  const getArtifactTypes = buildGetArtifactTypes(misc);
  const getArtifactTypesWithVariableMainStats = buildGetArtifactTypesWithVariableMainStats(misc);
  const getCharacter = buildGetCharacter(characters);
  const getCharacters = () => characters;
  const getInitialArtifactSubStatCountOdds = buildGetInitialArtifactSubStatCountOdds(misc);
  const getPossibleArtifactMainStats = buildGetPossibleArtifactMainStats(misc);
  const getPossibleArtifactSubStatRollValues = buildGetPossibleArtifactSubStatRollValues(misc);
  const getPossibleArtifactSubStats = buildGetPossibleArtifactSubStats(misc);
  const getOverallStatDefinition = buildGetOverallStatDefinition(misc);
  const getOverallStatDefinitions = buildGetOverallStatDefinitions(misc);
  const getStatDefinition = buildGetStatDefinition(misc);
  const getStatDefinitions = buildGetStatDefinitions(misc);
  const getWeapon = buildGetWeapon(weapons);
  const getWeapons = () => weapons;

  return (
    <DataContext.Provider
      value={{
        constructBuild,
        getArtifactLevelsPerSubStatRoll,
        getArtifactMainStatMaxValue,
        getArtifactMainStatOdds,
        getArtifactMaxLevel,
        getArtifactMaxSubStatCount,
        getArtifactSet,
        getArtifactSets,
        getArtifactSubStatRelativeLikelihood,
        getArtifactTypes,
        getArtifactTypesWithVariableMainStats,
        getCharacter,
        getCharacters,
        getInitialArtifactSubStatCountOdds,
        getOverallStatDefinition,
        getOverallStatDefinitions,
        getPossibleArtifactMainStats,
        getPossibleArtifactSubStatRollValues,
        getPossibleArtifactSubStats,
        getStatDefinition,
        getStatDefinitions,
        getWeapon,
        getWeapons,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
