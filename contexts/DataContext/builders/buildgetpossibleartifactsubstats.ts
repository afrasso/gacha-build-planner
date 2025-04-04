import { Misc } from "@/types";

type retFn = () => string[];

export const buildGetPossibleArtifactSubStats = (misc: Misc): retFn => {
  const possibleArtifactSubStats = misc.artifactSubStatRelativeLikelihoods.map((x) => x.statKey);
  return () => possibleArtifactSubStats;
};
