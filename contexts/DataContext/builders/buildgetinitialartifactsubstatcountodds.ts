import { InitialArtifactSubStatCountOdds, Misc } from "@/types";

type retFn = ({ rarity }: { rarity: number }) => InitialArtifactSubStatCountOdds[];

export const buildGetInitialArtifactSubStatCountOdds = (misc: Misc): retFn => {
  const lookup = misc.initialArtifactSubStatCountOddsByRarity.reduce<Record<number, InitialArtifactSubStatCountOdds[]>>(
    (acc, x) => {
      acc[x.rarity] = x.subStatCountOdds;
      return acc;
    },
    {}
  );

  return ({ rarity }: { rarity: number }): InitialArtifactSubStatCountOdds[] => {
    const odds = lookup[rarity];
    if (!odds) {
      throw new Error(`Unexpected rarity ${rarity} specified when retrieving initial substat count odds.`);
    }
    return odds;
  };
};
