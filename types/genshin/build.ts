import { IDataContext } from "@/contexts/DataContext";

import { Artifact, ArtifactData, IArtifact } from "../artifact";
import { ArtifactSetBonus } from "../artifactset";
import { BuildData, IBuild } from "../build";
import { DesiredOverallStat } from "../stat";
import { calculateStats } from "./stats";

export class Build implements IBuild {
  private _artifacts: Record<string, IArtifact>;
  private _characterId: string;
  private _desiredArtifactMainStats: Record<string, string[]>;
  private _desiredArtifactSetBonuses: ArtifactSetBonus[];
  private _desiredOverallStats: DesiredOverallStat[];
  private _lastUpdatedDate: string;
  private _sortOrder: number;
  private _weaponId?: string;

  public readonly _typeBrand: "IBuild";

  constructor({
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
  }) {
    this._artifacts = {};
    if (artifacts) {
      for (const key in artifacts) {
        this._artifacts[key] = new Artifact(artifacts[key]);
      }
    }
    this._characterId = characterId;
    this._desiredArtifactMainStats = desiredArtifactMainStats || {};
    this._desiredArtifactSetBonuses = desiredArtifactSetBonuses || [];
    this._desiredOverallStats = desiredOverallStats || [];
    this._lastUpdatedDate = lastUpdatedDate || new Date().toISOString();
    this._sortOrder = sortOrder || 0;
    this._weaponId = weaponId;
    this._typeBrand = "IBuild";
  }

  private updateLastUpdatedDate(): void {
    this._lastUpdatedDate = new Date().toISOString();
  }

  public calculateStats({
    artifacts,
    dataContext,
  }: {
    artifacts?: Record<string, IArtifact>;
    dataContext: IDataContext;
  }): Record<string, number> {
    return calculateStats({ artifacts: artifacts || this._artifacts, build: this, dataContext });
  }

  public toBuildData(): BuildData {
    const artifacts = Object.entries(this._artifacts).reduce<Record<string, ArtifactData>>(
      (acc, [typeKey, artifact]) => {
        acc[typeKey] = artifact.toArtifactData();
        return acc;
      },
      {}
    );

    return {
      _typeBrand: "BuildData",
      artifacts,
      characterId: this._characterId,
      desiredArtifactMainStats: this._desiredArtifactMainStats,
      desiredArtifactSetBonuses: this._desiredArtifactSetBonuses,
      desiredOverallStats: this._desiredOverallStats,
      lastUpdatedDate: this._lastUpdatedDate,
      sortOrder: this._sortOrder,
      weaponId: this._weaponId,
    };
  }

  public get artifacts(): Record<string, IArtifact> {
    return this._artifacts;
  }

  public set artifacts(artifacts: Record<string, IArtifact>) {
    this._artifacts = artifacts;
    this.updateLastUpdatedDate();
  }

  public get characterId(): string {
    return this._characterId;
  }

  public get desiredArtifactMainStats(): Record<string, string[]> {
    return this._desiredArtifactMainStats;
  }

  public set desiredArtifactMainStats(desiredArtifactMainStats: Record<string, string[]>) {
    this._desiredArtifactMainStats = desiredArtifactMainStats;
    this.updateLastUpdatedDate();
  }

  public get desiredArtifactSetBonuses(): ArtifactSetBonus[] {
    return this._desiredArtifactSetBonuses;
  }

  public set desiredArtifactSetBonuses(desiredArtifactSetBonuses: ArtifactSetBonus[]) {
    this._desiredArtifactSetBonuses = desiredArtifactSetBonuses;
    this.updateLastUpdatedDate();
  }

  public get desiredOverallStats(): DesiredOverallStat[] {
    return this._desiredOverallStats;
  }

  public set desiredOverallStats(desiredOverallStats: DesiredOverallStat[]) {
    this._desiredOverallStats = desiredOverallStats;
    this.updateLastUpdatedDate();
  }

  public get lastUpdatedDate(): string {
    return this._lastUpdatedDate;
  }

  public get sortOrder(): number {
    return this._sortOrder;
  }

  public set sortOrder(sortOrder: number) {
    this._sortOrder = sortOrder;
    this.updateLastUpdatedDate();
  }

  public get weaponId(): string | undefined {
    return this._weaponId;
  }

  public set weaponId(weaponId: string | undefined) {
    this._weaponId = weaponId;
    this.updateLastUpdatedDate();
  }
}
