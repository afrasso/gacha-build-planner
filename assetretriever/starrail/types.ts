export interface FailedCharacterIconDownload {
  id: string;
  name: string;
  pathName: string;
}

export interface FailedRelicIconDownload {
  setId: string;
  setName: string;
  type: string;
}

export interface FailedRelicSetIconDownload {
  id: string;
  name: string;
}

export interface FailedLightConeIconDownload {
  id: string;
  name: string;
}

export type Stat = {
  key: string;
  value: number;
};
