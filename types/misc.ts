export interface ArtifactMainStatMaxValue {
  statKey: string;
  value: number;
}

export interface ArtifactMainStatMaxValuesByRarity {
  mainStatMaxValues: ArtifactMainStatMaxValue[];
  rarity: number;
}

export interface ArtifactMainStatOdds {
  odds: number;
  statKey: string;
}

export interface ArtifactMainStatOddsByType {
  mainStatOdds: ArtifactMainStatOdds[];
  typeKey: string;
}

export interface ArtifactMaxLevelByRarity {
  maxLevel: number;
  rarity: number;
}

export interface ArtifactSubStatRelativeLikelihood {
  statKey: string;
  value: number;
}

export interface ArtifactSubStatRollValues {
  statKey: string;
  values: number[];
}

export interface ArtifactSubStatRollValuesByRarity {
  rarity: number;
  subStatRollValues: ArtifactSubStatRollValues[];
}

export interface ArtifactType {
  css: string;
  iconUrl: string;
  key: string;
}

export interface InitialArtifactSubStatCountOdds {
  count: number;
  odds: number;
}

export interface InitialArtifactSubStatCountOddsByRarity {
  rarity: number;
  subStatCountOdds: InitialArtifactSubStatCountOdds[];
}

export interface Misc {
  artifactLevelsPerSubstatRoll: number;
  artifactMainStatMaxValuesByRarity: ArtifactMainStatMaxValuesByRarity[];
  artifactMainStatOddsByType: ArtifactMainStatOddsByType[];
  artifactMaxLevelByRarity: ArtifactMaxLevelByRarity[];
  artifactSubStatRelativeLikelihoods: ArtifactSubStatRelativeLikelihood[];
  artifactSubStatRollValuesByRarity: ArtifactSubStatRollValuesByRarity[];
  artifactTypes: ArtifactType[];
  initialArtifactSubStatCountOddsByRarity: InitialArtifactSubStatCountOddsByRarity[];
  maxArtifactSubStatCount: number;
  overallStats: OverallStatDefinition[];
  stats: StatDefinition[];
}

export interface OverallStatDefinition {
  css: string;
  iconUrl: string;
  key: string;
}

export interface StatDefinition {
  css: string;
  iconUrl: string;
  key: string;
  overallStatKey: string;
}
