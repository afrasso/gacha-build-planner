import { v4 as uuidv4 } from "uuid";

import { ArtifactMetric, ArtifactMetricsResults } from "./artifactmetrics";
import { Stat } from "./stat";

export interface ArtifactData {
  readonly _typeBrand: "ArtifactData";
  characterId?: string;
  id: string;
  isLocked: boolean;
  lastUpdatedDate: string;
  level: number;
  mainStatKey: string;
  metricsResults: ArtifactMetricsResults;
  rarity: number;
  setId: string;
  subStats: Stat[];
  typeKey: string;
}

export interface IArtifact {
  readonly _typeBrand: "IArtifact";
  characterId?: string;
  id: string;
  isLocked: boolean;
  lastUpdatedDate: string;
  level: number;
  mainStatKey: string;
  metricsResults: ArtifactMetricsResults;
  rarity: number;
  setId: string;
  subStats: Stat[];
  toArtifactData: () => ArtifactData;
  typeKey: string;
}

export class Artifact implements IArtifact {
  private _characterId?: string;
  private _id: string;
  private _isLocked: boolean;
  private _lastUpdatedDate: string;
  private _level: number;
  private _mainStatKey: string;
  private _metricsResults: ArtifactMetricsResults;
  private _rarity: number;
  private _setId: string;
  private _subStats: Stat[];
  private _typeKey: string;

  public readonly _typeBrand: "IArtifact";

  constructor({
    characterId,
    id,
    isLocked,
    lastUpdatedDate,
    level,
    mainStatKey,
    metricsResults,
    rarity,
    setId,
    subStats,
    typeKey,
  }: {
    characterId?: string;
    id?: string;
    isLocked?: boolean;
    lastUpdatedDate?: string;
    level: number;
    mainStatKey: string;
    metricsResults?: ArtifactMetricsResults;
    rarity: number;
    setId: string;
    subStats: Stat[];
    typeKey: string;
  }) {
    this._characterId = characterId;
    this._id = id || uuidv4();
    this._isLocked = !!isLocked;
    this._lastUpdatedDate = lastUpdatedDate || new Date().toISOString();
    this._level = level;
    this._mainStatKey = mainStatKey;
    this._metricsResults = metricsResults || {
      [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
      [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
      [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
      [ArtifactMetric.RATING]: { buildResults: {} },
    };
    this._rarity = rarity;
    this._setId = setId;
    this._subStats = subStats;
    this._typeKey = typeKey;
    this._typeBrand = "IArtifact";
  }

  private updateLastUpdatedDate(): void {
    this._lastUpdatedDate = new Date().toISOString();
  }

  public toArtifactData(): ArtifactData {
    return {
      _typeBrand: "ArtifactData",
      characterId: this._characterId,
      id: this._id,
      isLocked: this._isLocked,
      lastUpdatedDate: this._lastUpdatedDate,
      level: this._level,
      mainStatKey: this._mainStatKey,
      metricsResults: this._metricsResults,
      rarity: this._rarity,
      setId: this._setId,
      subStats: this._subStats,
      typeKey: this._typeKey,
    };
  }

  public get characterId(): string | undefined {
    return this._characterId;
  }

  public set characterId(characterId: string) {
    this._characterId = characterId;
    this.updateLastUpdatedDate();
  }

  public get id(): string {
    return this._id;
  }

  public get isLocked(): boolean {
    return this._isLocked;
  }

  public set isLocked(isLocked: boolean) {
    this._isLocked = isLocked;
    this.updateLastUpdatedDate();
  }

  public get lastUpdatedDate(): string {
    return this._lastUpdatedDate;
  }

  public get level(): number {
    return this._level;
  }

  public set level(level: number) {
    this._level = level;
    this.updateLastUpdatedDate();
  }

  public get mainStatKey(): string {
    return this._mainStatKey;
  }

  public get metricsResults(): ArtifactMetricsResults {
    return this._metricsResults;
  }

  public set metricsResults(metricsResults: ArtifactMetricsResults) {
    this._metricsResults = metricsResults;
  }

  public get rarity(): number {
    return this._rarity;
  }

  public get setId(): string {
    return this._setId;
  }

  public get subStats(): Stat[] {
    return this._subStats;
  }

  public set subStats(subStats: Stat[]) {
    this._subStats = subStats;
  }

  public get typeKey(): string {
    return this._typeKey;
  }
}

export const ArtifactSchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/Artifact",
  properties: {
    _typeBrand: { const: "ArtifactData", type: "string" },
    characterId: { type: "string" },
    id: { type: "string" },
    isLocked: { type: "boolean" },
    lastUpdatedDate: { format: "date-time", type: "string" },
    level: { type: "integer" },
    mainStatKey: { type: "string" },
    metricsResults: { $ref: "https://gacha-build-planner.vercel.app/schemas/ArtifactMetricsResults" },
    rarity: { type: "integer" },
    setId: { type: "string" },
    subStats: {
      items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Stat" },
      type: "array",
    },
    typeKey: { type: "string" },
  },
  required: [
    "_typeBrand",
    "id",
    "isLocked",
    "lastUpdatedDate",
    "level",
    "mainStatKey",
    "metricsResults",
    "rarity",
    "setId",
    "subStats",
    "typeKey",
  ],
  type: "object",
};

export const ArtifactArraySchema = {
  $id: "https://gacha-build-planner.vercel.app/schemas/ArtifactArray",
  items: { $ref: "https://gacha-build-planner.vercel.app/schemas/Artifact" },
  type: "array",
};
