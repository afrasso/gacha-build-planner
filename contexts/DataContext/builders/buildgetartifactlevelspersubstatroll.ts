import { Misc } from "@/types";

type retFn = () => number;

export const buildGetArtifactLevelsPerSubStatRoll = (misc: Misc): retFn => {
  return (): number => {
    return misc.artifactLevelsPerSubStatRoll;
  };
};
