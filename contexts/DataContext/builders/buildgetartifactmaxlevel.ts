import { Misc } from "@/types";

type retFn = ({ rarity }: { rarity: number }) => number;

export const buildGetArtifactMaxLevel = (misc: Misc): retFn => {
  const lookup = misc.artifactMaxLevelByRarity.reduce<Record<number, number>>((acc, x) => {
    acc[x.rarity] = x.maxLevel;
    return acc;
  }, {});

  return ({ rarity }: { rarity: number }): number => {
    const maxLevel = lookup[rarity];
    if (!maxLevel) {
      throw new Error(`Unexpected rarity ${rarity} specified when retrieving max level.`);
    }
    return maxLevel;
  };
};
