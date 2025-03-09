import { Misc } from "@/types";

type retFn = ({ artifactTypeKey, mainStatKey }: { artifactTypeKey: string; mainStatKey: string }) => number;

export const buildGetArtifactMainStatOdds = (misc: Misc): retFn => {
  const lookup = misc.artifactMainStatOddsByType.reduce<Record<string, Record<string, number>>>((acc, x) => {
    acc[x.typeKey] = x.mainStatOdds.reduce<Record<string, number>>((acc, x) => {
      acc[x.statKey] = x.odds;
      return acc;
    }, {});
    return acc;
  }, {});

  return ({ artifactTypeKey, mainStatKey }: { artifactTypeKey: string; mainStatKey: string }): number => {
    const odds = lookup[artifactTypeKey][mainStatKey];
    if (!odds) {
      throw new Error(
        `Unexpected specified combination of artifactType ${artifactTypeKey} and main stat ${mainStatKey} when retrieving odds of main stat.`
      );
    }
    return odds;
  };
};
