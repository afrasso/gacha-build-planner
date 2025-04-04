import { ArtifactSetBonus } from "@/types";

export interface ArtifactMainStatSatisfactionDetails {
  artifactTypeKey: string;
  currentMainStatKey: string;
  desiredMainStatKeys: string[];
  satisfaction: boolean;
}

export interface ArtifactSetBonusSatisfactionDetails {
  desiredSetBonus: ArtifactSetBonus;
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
  currentStatValue: number;
  satisfaction: boolean;
  statKey: string;
  targetStatValue: number;
}

export enum TargetStatsStrategy {
  CURRENT = "CURRENT",
  DESIRED = "DESIRED",
}
