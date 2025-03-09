import { Misc } from "@/types";

type retFn = ({ mainStatKey, rarity }: { mainStatKey: string; rarity: number }) => number;

export const buildGetArtifactMainStatMaxValue = (misc: Misc): retFn => {
  const lookup = misc.artifactMainStatMaxValuesByRarity.reduce<Record<number, Record<string, number>>>((acc, x) => {
    acc[x.rarity] = x.mainStatMaxValues.reduce<Record<string, number>>((acc, x) => {
      acc[x.statKey] = x.value;
      return acc;
    }, {});
    return acc;
  }, {});

  return ({ mainStatKey, rarity }: { mainStatKey: string; rarity: number }): number => {
    const maxValue = lookup[rarity][mainStatKey];
    if (!maxValue) {
      throw new Error(
        `Unexpected specified combination of main stat ${mainStatKey} and rarity ${rarity} when retrieving the main stat max value.`
      );
    }
    return maxValue;
  };
};
