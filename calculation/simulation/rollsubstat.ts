import { IDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

import { getRandomValue } from "./getrandomvalue";

export const rollSubStat = ({
  dataContext,
  rarity,
  statKey,
}: {
  dataContext: IDataContext;
  rarity: number;
  statKey: string;
}): Stat => {
  const { getPossibleArtifactSubStatRollValues } = dataContext;

  const rollValues = getPossibleArtifactSubStatRollValues({ rarity, subStatKey: statKey });
  const value = getRandomValue(rollValues);

  return { key: statKey, value };
};
