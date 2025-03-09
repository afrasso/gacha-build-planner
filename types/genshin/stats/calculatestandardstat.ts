import { IDataContext } from "@/contexts/DataContext";
import { IArtifact } from "@/types/artifact";

import { Character } from "../character";
import { Weapon } from "../weapon";
import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

export const calculateStandardStat = ({
  artifacts,
  character,
  dataContext,
  min = 0,
  statKey,
  weapon,
}: {
  artifacts: Record<string, IArtifact>;
  character: Character;
  dataContext: IDataContext;
  min?: number;
  statKey: string;
  weapon?: Weapon;
}) => {
  const total =
    getTotalArtifactStatValue({ artifacts, dataContext, statKey }) +
    (character.ascensionStat === statKey ? character.maxLvlStats.ascensionStat : min) +
    (weapon?.mainStatKey === statKey ? weapon.maxLvlStats.mainStatValue : 0);

  return total;
};
