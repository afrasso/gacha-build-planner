export type ArtifactSet = {
  hasArtifactTypes: Record<ArtifactType, boolean>;
  iconUrl: string;
  iconUrls: Record<ArtifactType, string>;
  id: string;
  name: string;
  rarities: number[];
};

export enum ArtifactType {
  BODY = "BODY",
  FOOT = "FOOT",
  HAND = "HAND",
  HEAD = "HEAD",
  NECK = "NECK",
  OBJECT = "OBJECT",
}

export type FailedCharacterIconDownload = {
  id: string;
  name: string;
  pathName: string;
};

export type FailedRelicIconDownload = {
  setId: string;
  setName: string;
  type: string;
};

export type FailedRelicSetIconDownload = {
  id: string;
  name: string;
};

export type FailedLightConeIconDownload = {
  id: string;
  name: string;
};

export type Stat = {
  key: string;
  value: number;
};
