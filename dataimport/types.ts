import { Stat } from "@/types";

export interface ImportedArtifact {
  characterId?: string;
  isLocked: boolean;
  level: number;
  mainStatKey: string;
  rarity: number;
  setId: string;
  subStats: Stat[];
  typeKey: string;
}

export interface ImportedBuild {
  characterId: string;
}

export interface ImportedData {
  artifacts: ImportedArtifact[];
  builds: ImportedBuild[];
  weaponInstances: ImportedWeaponInstance[];
}

export interface ImportedWeaponInstance {
  characterId?: string;
  id: string;
}
