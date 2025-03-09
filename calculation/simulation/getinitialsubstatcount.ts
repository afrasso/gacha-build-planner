import { IDataContext } from "@/contexts/DataContext";

export const getInitialSubStatCount = ({
  dataContext,
  rarity,
}: {
  dataContext: IDataContext;
  rarity: number;
}): number => {
  const { getInitialArtifactSubStatCountOdds } = dataContext;

  const random = Math.random();
  let cumulativeOdds = 0;
  for (const { count, odds } of getInitialArtifactSubStatCountOdds({ rarity })) {
    if (random < cumulativeOdds + odds) {
      return Number(count);
    }
    cumulativeOdds += odds;
  }
  throw new Error(
    `Unexpected error: the odds for the number of sub stats the artifact rarity ${rarity} are greater than one: ${cumulativeOdds}.`
  );
};
