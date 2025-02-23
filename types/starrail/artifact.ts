export interface ArtifactSet<T extends string> {
  hasArtifactTypes: Record<T, boolean>;
  iconUrl: string;
  iconUrls: Record<T, string>;
  id: string;
  name: string;
  rarities: number[];
}

export enum ArtifactType {
  BODY = "BODY",
  FOOT = "FOOT",
  HAND = "HAND",
  HEAD = "HEAD",
  NECK = "NECK",
  OBJECT = "OBJECT",
}
