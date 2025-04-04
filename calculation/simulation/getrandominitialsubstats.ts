import { IDataContext } from "@/contexts/DataContext";
import { Stat } from "@/types";

import { getInitialSubStatCount } from "./getinitialsubstatcount";
import { getRandomNewSubStat } from "./getrandomnewsubstat";
import { rollSubStat } from "./rollsubstat";

export const getRandomInitialSubStats = ({
  dataContext,
  mainStatKey,
  rarity,
}: {
  dataContext: IDataContext;
  mainStatKey: string;
  rarity: number;
}) => {
  const substatCount = getInitialSubStatCount({ dataContext, rarity });
  const substats: Stat[] = [];
  for (let i = 0; i < substatCount; i++) {
    const statKey = getRandomNewSubStat({ dataContext, mainStatKey, subStatKeys: substats.map((s) => s.key) });
    substats.push(rollSubStat({ dataContext, rarity, statKey }));
  }
  return substats;
};
