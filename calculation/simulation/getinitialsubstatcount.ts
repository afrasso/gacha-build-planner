import { getInitialSubstatCountOdds } from "@/constants";

export const getInitialSubStatCount = ({ rarity }: { rarity: number }): number => {
  const random = Math.random();
  let cumulativeOdds = 0;
  for (const [count, odds] of Object.entries(getInitialSubstatCountOdds({ rarity }))) {
    if (random < cumulativeOdds + odds) {
      return Number(count);
    }
    cumulativeOdds += odds;
  }
  throw new Error(
    `Unexpected error: the odds for the number of sub stats the artifact rarity ${rarity} are greater than one: ${cumulativeOdds}.`
  );
};
