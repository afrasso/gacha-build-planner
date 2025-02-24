import { getSubStatRollValues } from "@/constants";
import { Stat, StatKey } from "@/types";

import { getRandomValue } from "./getrandomvalue";

export const rollSubStat = ({ rarity, statKey }: { rarity: number; statKey: StatKey }): Stat<StatKey> => {
  const rollValues = getSubStatRollValues({ rarity, statKey });
  const value = getRandomValue(rollValues);

  return { key: statKey, value };
};
