import { Misc } from "@/types";

type retFn = () => number;

export const buildGetArtifactLevelsPerSubstatRoll = (misc: Misc): retFn => {
  return (): number => {
    return misc.artifactLevelsPerSubstatRoll;
  };
};
