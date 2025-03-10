import { IDataContext } from "@/contexts/DataContext";
import { IArtifact } from "@/types/artifact";

import { Weapon } from "../weapon";
import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

export const calculateStandardStat = ({
  artifacts,
  dataContext,
  min = 0,
  statKey,
  weapon,
}: {
  artifacts: Record<string, IArtifact>;
  dataContext: IDataContext;
  min?: number;
  statKey: string;
  weapon?: Weapon;
}) => {
  const getWeaponContribution = (): number => {
    if (statKey === "ATK") {
      return weapon?.maxLvlStats.ATK || 0;
    } else if (statKey === "DEF") {
      return weapon?.maxLvlStats.DEF || 0;
    } else if (statKey === "MAX_HP") {
      return weapon?.maxLvlStats.HP || 0;
    }
    return 0;
  };

  const total = getTotalArtifactStatValue({ artifacts, dataContext, statKey }) + min + getWeaponContribution();

  return total;
};
