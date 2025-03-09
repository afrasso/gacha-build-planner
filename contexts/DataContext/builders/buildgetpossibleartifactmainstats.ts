import { Misc } from "@/types";

type retFn = ({ artifactTypeKey }: { artifactTypeKey: string }) => string[];

export const buildGetPossibleArtifactMainStats = (misc: Misc): retFn => {
  const lookup = misc.artifactMainStatOddsByType.reduce<Record<string, string[]>>((acc, x) => {
    acc[x.typeKey] = x.mainStatOdds.map((x) => x.statKey);
    return acc;
  }, {});

  return ({ artifactTypeKey }: { artifactTypeKey: string }): string[] => {
    const mainStatKeys = lookup[artifactTypeKey];
    if (!mainStatKeys) {
      throw new Error(`Unexpected artifact type ${artifactTypeKey} specified when retrieving possible main stats.`);
    }
    return mainStatKeys;
  };
};
