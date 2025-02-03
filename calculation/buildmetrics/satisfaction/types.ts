import { ArtifactSetBonusType, ArtifactType, OverallStat, Stat } from "@/types";

export interface ArtifactMainStatSatisfactionDetails {
  artifactType: ArtifactType;
  desiredMainStat: Stat;
  mainStat: Stat | undefined;
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
  targetStat: OverallStat;
  targetStatValue: number;
}

export enum TargetStatsStrategy {
  CURRENT = "CURRENT",
  DESIRED = "DESIRED",
}
