import { BuildArtifacts, Character, Stat, Weapon } from "@/types";

import { getTotalArtifactStatValue } from "./gettotalartifactstatvalue";

export const calculateStandardStat = ({
  artifacts,
  character,
  min = 0,
  stat,
  weapon,
}: {
  artifacts: BuildArtifacts;
  character: Character;
  min?: number;
  stat: Stat;
  weapon?: Weapon;
}) => {
  const total =
    getTotalArtifactStatValue({ artifacts, stat }) +
    (character.ascensionStat === stat ? character.maxLvlStats.ascensionStat : min) +
    (weapon?.mainStat === stat ? weapon.maxLvlStats.mainStat : 0);

  return total;
};
