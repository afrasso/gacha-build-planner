import { Misc } from "@/types";

type retFn = ({ subStatKey }: { subStatKey: string }) => number;

export const buildGetArtifactSubStatRelativeLikelihood = (misc: Misc): retFn => {
  const lookup = misc.artifactSubStatRelativeLikelihoods.reduce<Record<string, number>>((acc, x) => {
    acc[x.statKey] = x.value;
    return acc;
  }, {});

  return ({ subStatKey }: { subStatKey: string }): number => {
    const likelihood = lookup[subStatKey];
    if (!likelihood) {
      throw new Error(`Unexpected sub stat ${subStatKey} specified when retrieving sub stat likelihoods.`);
    }
    return likelihood;
  };
};
