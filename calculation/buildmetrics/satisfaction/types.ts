import { ArtifactSetBonusType, ArtifactType, OverallStatKey, StatKey } from "@/types";

export interface ArtifactMainStatSatisfactionDetails {
  artifactType: ArtifactType;
  desiredMainStats: StatKey[];
  mainStat: StatKey | undefined;
  satisfaction: boolean;
}

export interface ArtifactSetBonusSatisfactionDetails {
  desiredBonusType: ArtifactSetBonusType;
  desiredSetId: string;
  satisfaction: boolean;
}

export interface BuildSatisfactionResult {
  artifactMainStatsSatisfaction?: SatisfactionResult<ArtifactMainStatSatisfactionDetails>;
  artifactSetBonusesSatisfaction?: SatisfactionResult<ArtifactSetBonusSatisfactionDetails>;
  overallSatisfaction: boolean;
  statsSatisfaction?: SatisfactionResult<StatSatisfactionDetails>;
}

export interface SatisfactionResult<T> {
  details: T[];
  satisfaction: boolean;
}

export interface StatSatisfactionDetails {
  satisfaction: boolean;
  statValue: number;
  targetStatKey: OverallStatKey;
  targetStatValue: number;
}

export enum TargetStatsStrategy {
  CURRENT = "CURRENT",
  DESIRED = "DESIRED",
}
