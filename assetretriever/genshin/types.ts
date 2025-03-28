export type ArtifactSet = {
  hasArtifactTypes: Record<ArtifactType, boolean>;
  iconUrl: string;
  iconUrls: Record<ArtifactType, string>;
  id: string;
  name: string;
  rarities: number[];
  setBonusCounts: number[];
};

export enum ArtifactType {
  CIRCLET = "CIRCLET",
  FLOWER = "FLOWER",
  GOBLET = "GOBLET",
  PLUME = "PLUME",
  SANDS = "SANDS",
}

export type FailedArtifactIconDownload = {
  setId: string;
  setName: string;
  type: string;
};

export type FailedCharacterIconDownload = {
  id: string;
  name: string;
};

export type FailedWeaponIconDownload = {
  id: string;
  name: string;
};
