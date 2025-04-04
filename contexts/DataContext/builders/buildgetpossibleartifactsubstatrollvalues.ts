import { Misc } from "@/types";

type retFn = ({ rarity, subStatKey }: { rarity: number; subStatKey: string }) => number[];

export const buildGetPossibleArtifactSubStatRollValues = (misc: Misc): retFn => {
  const lookup = misc.artifactSubStatRollValuesByRarity.reduce<Record<number, Record<string, number[]>>>((acc, x) => {
    acc[x.rarity] = x.subStatRollValues.reduce<Record<string, number[]>>((acc, x) => {
      acc[x.statKey] = x.values;
      return acc;
    }, {});
    return acc;
  }, {});

  return ({ rarity, subStatKey }: { rarity: number; subStatKey: string }): number[] => {
    const subStatKeyLookup = lookup[rarity];
    if (!subStatKeyLookup) {
      throw new Error(`Unexpected specified rarity ${rarity} when retrieving possible artifact sub stat roll values.`);
    }
    const rollValues = subStatKeyLookup[subStatKey];
    if (!rollValues) {
      throw new Error(
        `Unexpected specified rarity ${rarity} and sub stat ${subStatKey} when retrieving possible artifact sub stat roll values.`
      );
    }
    return rollValues;
  };
};
