import { MAIN_STAT_MAX_VALUES_BY_RARITY } from "@/constants";
import { BuildArtifacts, Stat } from "@/types";

export const getTotalArtifactStatValue = ({ artifacts, stat }: { artifacts: BuildArtifacts; stat: Stat }): number => {
  return Object.values(artifacts).reduce((total, artifact) => {
    if (artifact.mainStat === stat) {
      const value = MAIN_STAT_MAX_VALUES_BY_RARITY[artifact.rarity][stat];
      if (!value) {
        // TODO: Support other rarities.
        throw new Error("Artifacts of rarity other than five are currently not supported.");
      }
      total += value;
    }
    total += artifact.subStats.find((statValue) => statValue.stat === stat)?.value || 0;
    return total;
  }, 0);
};
