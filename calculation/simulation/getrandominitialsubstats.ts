import { Stat, StatValue } from "@/types";

import { getInitialSubStatCount } from "./getinitialsubstatcount";
import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { rollSubStat } from "./rollsubstat";

export const getRandomInitialSubStats = ({ mainStat, rarity }: { mainStat: Stat; rarity: number }) => {
  const subStatCount = getInitialSubStatCount({ rarity });
  const subStats: StatValue<Stat>[] = [];
  for (let i = 0; i < subStatCount; i++) {
    const subStat = getRandomNewSubStat({ mainStat, subStats: subStats.map((s) => s.stat) });
    subStats.push(rollSubStat({ rarity, stat: subStat }));
  }
  return subStats;
};
