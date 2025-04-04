"use client";

import { ImportedData } from "@/dataimport";
import { ArtifactData, ArtifactSet, ArtifactSetBonus, DesiredOverallStat, IBuild, ICharacter, IWeapon } from "@/types";
import { Misc } from "@/types/misc";

import {
  buildGetArtifactLevelsPerSubStatRoll,
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
import { IDataContext } from "./types";

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
  gamePathSegment: string;
  misc: Misc;
  validateImport: ({ data, dataContext }: { data: unknown; dataContext: IDataContext }) => ImportedData;
  weapons: IWeapon[];
}

export const DataProvider: React.FC<DataProviderProps> = ({
  artifactSets,
  characters,
  children,
  constructBuild,
  gamePathSegment,
  misc,
  validateImport,
  weapons,
}) => {
  const getArtifactLevelsPerSubStatRoll = buildGetArtifactLevelsPerSubStatRoll(misc);
  const getArtifactMainStatMaxValue = buildGetArtifactMainStatMaxValue(misc);
  const getArtifactMainStatOdds = buildGetArtifactMainStatOdds(misc);
  const getArtifactMaxLevel = buildGetArtifactMaxLevel(misc);
  const getArtifactMaxSubStatCount = buildGetArtifactMaxSubStatCount(misc);
  const getArtifactSet = buildGetArtifactSet(artifactSets);
  const getArtifactSets = () => artifactSets.sort((a, b) => a.name.localeCompare(b.name));
  const getArtifactSubStatRelativeLikelihood = buildGetArtifactSubStatRelativeLikelihood(misc);
  const getArtifactTypes = buildGetArtifactTypes(misc);
  const getArtifactTypesWithVariableMainStats = buildGetArtifactTypesWithVariableMainStats(misc);
  const getCharacter = buildGetCharacter(characters);
  const getCharacters = () => characters.sort((a, b) => a.name.localeCompare(b.name));
  const getInitialArtifactSubStatCountOdds = buildGetInitialArtifactSubStatCountOdds(misc);
  const getPossibleArtifactMainStats = buildGetPossibleArtifactMainStats(misc);
  const getPossibleArtifactSubStatRollValues = buildGetPossibleArtifactSubStatRollValues(misc);
  const getPossibleArtifactSubStats = buildGetPossibleArtifactSubStats(misc);
  const getOverallStatDefinition = buildGetOverallStatDefinition(misc);
  const getOverallStatDefinitions = buildGetOverallStatDefinitions(misc);
  const getStatDefinition = buildGetStatDefinition(misc);
  const getStatDefinitions = buildGetStatDefinitions(misc);
  const getWeapon = buildGetWeapon(weapons);
  const getWeapons = () => weapons.sort((a, b) => a.name.localeCompare(b.name));
  const resolvePath = (path: string) => `/${gamePathSegment}${path}`;

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
        resolvePath,
        validateImport,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
