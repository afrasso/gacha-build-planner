import { Misc } from "@/types";

type retFn = () => number;

export const buildGetArtifactMaxSubStatCount = (misc: Misc): retFn => {
  return () => misc.maxArtifactSubStatCount;
};
