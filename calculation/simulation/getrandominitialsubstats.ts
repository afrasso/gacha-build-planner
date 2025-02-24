import { Stat, StatKey } from "@/types";

import { getInitialSubStatCount } from "./getinitialsubstatcount";
import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { rollSubStat } from "./rollsubstat";

export const getRandomInitialSubStats = ({ mainStat, rarity }: { mainStat: StatKey; rarity: number }) => {
  const subStatCount = getInitialSubStatCount({ rarity });
  const subStats: Stat<StatKey>[] = [];
  for (let i = 0; i < subStatCount; i++) {
    const statKey = getRandomNewSubStat({ mainStat, subStats: subStats.map((s) => s.key) });
    subStats.push(rollSubStat({ rarity, statKey }));
  }
  return subStats;
};
