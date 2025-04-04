import { ArtifactType, Misc } from "@/types";

type retFn = () => ArtifactType[];

export const buildGetArtifactTypes = (misc: Misc): retFn => {
  return () => misc.artifactTypes;
};
