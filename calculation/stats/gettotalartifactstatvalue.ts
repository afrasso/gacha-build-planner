import { getMainStatMaxValue } from "@/constants";
import { BuildArtifacts, StatKey } from "@/types";

export const getTotalArtifactStatValue = ({
  artifacts,
  statKey,
}: {
  artifacts: BuildArtifacts;
  statKey: StatKey;
}): number => {
  return Object.values(artifacts).reduce((total, artifact) => {
    if (artifact.mainStat === statKey) {
      const value = getMainStatMaxValue({ mainStat: statKey, rarity: artifact.rarity });
      if (!value) {
        throw new Error(
          `The max value of an artifact with main stat ${statKey} and of rarity ${artifact.rarity} could not be identified.`
        );
      }
      total += value;
    }
    total += artifact.subStats.find((statValue) => statValue.key === statKey)?.value || 0;
    return total;
  }, 0);
};
