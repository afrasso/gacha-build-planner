import {
  ArtifactData,
  ArtifactSet,
  ArtifactSetBonus,
  ArtifactType,
  DesiredOverallStat,
  IBuild,
  ICharacter,
  InitialArtifactSubStatCountOdds,
  IWeapon,
  OverallStatDefinition,
  StatDefinition,
} from "@/types";

export interface IDataContext {
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
  getArtifactLevelsPerSubStatRoll: () => number;
  getArtifactMainStatMaxValue: ({ mainStatKey, rarity }: { mainStatKey: string; rarity: number }) => number;
  getArtifactMainStatOdds: ({
    artifactTypeKey,
    mainStatKey,
  }: {
    artifactTypeKey: string;
    mainStatKey: string;
  }) => number;
  getArtifactMaxLevel: ({ rarity }: { rarity: number }) => number;
  getArtifactMaxSubStatCount: () => number;
  getArtifactSet: (id: string) => ArtifactSet;
  getArtifactSets: () => ArtifactSet[];
  getArtifactSubStatRelativeLikelihood: ({ subStatKey }: { subStatKey: string }) => number;
  getArtifactTypes: () => ArtifactType[];
  getArtifactTypesWithVariableMainStats: () => ArtifactType[];
  getCharacter: (id: string) => ICharacter;
  getCharacters: () => ICharacter[];
  getInitialArtifactSubStatCountOdds: ({ rarity }: { rarity: number }) => InitialArtifactSubStatCountOdds[];
  getOverallStatDefinition: (key: string) => OverallStatDefinition;
  getOverallStatDefinitions: () => OverallStatDefinition[];

  getPossibleArtifactMainStats: ({ artifactTypeKey }: { artifactTypeKey: string }) => string[];
  getPossibleArtifactSubStatRollValues: ({ rarity, subStatKey }: { rarity: number; subStatKey: string }) => number[];
  getPossibleArtifactSubStats: () => string[];
  getStatDefinition: (key: string) => StatDefinition;
  getStatDefinitions: () => StatDefinition[];
  getWeapon: (id: string) => IWeapon;
  getWeapons: () => IWeapon[];
  resolvePath: (path: string) => string;
}
