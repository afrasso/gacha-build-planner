import { BuildArtifacts, Character, StatKey, Weapon } from "@/types";

import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

export const calculateStandardStat = ({
  artifacts,
  character,
  min = 0,
  statKey,
  weapon,
}: {
  artifacts: BuildArtifacts;
  character: Character;
  min?: number;
  statKey: StatKey;
  weapon?: Weapon;
}) => {
  const total =
    getTotalArtifactStatValue({ artifacts, statKey }) +
    (character.ascensionStat === statKey ? character.maxLvlStats.ascensionStat : min) +
    (weapon?.mainStat === statKey ? weapon.maxLvlStats.mainStat : 0);

  return total;
};
