import { getSubStatRollValues } from "@/constants";
import { Stat, StatValue } from "@/types";

import { getRandomValue } from "./getrandomvalue";

export const rollSubStat = ({ rarity, stat }: { rarity: number; stat: Stat }): StatValue<Stat> => {
  const rollValues = getSubStatRollValues({ rarity, subStat: stat });
  const value = getRandomValue(rollValues);

  return { stat, value };
};
