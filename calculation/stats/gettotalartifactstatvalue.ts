import { getMainStatMaxValue } from "@/constants";
import { BuildArtifacts, Stat } from "@/types";

export const getTotalArtifactStatValue = ({ artifacts, stat }: { artifacts: BuildArtifacts; stat: Stat }): number => {
  return Object.values(artifacts).reduce((total, artifact) => {
    if (artifact.mainStat === stat) {
      const value = getMainStatMaxValue({ mainStat: stat, rarity: artifact.rarity });
      if (!value) {
        throw new Error(
          `The max value of an artifact with main stat ${stat} and of rarity ${artifact.rarity} could not be identified.`
        );
      }
      total += value;
    }
    total += artifact.subStats.find((statValue) => statValue.stat === stat)?.value || 0;
    return total;
  }, 0);
};
