import { IDataContext } from "@/contexts/DataContext";
import { IArtifact } from "@/types";

export const getTotalArtifactStatValue = ({
  artifacts,
  dataContext,
  statKey,
}: {
  artifacts: Record<string, IArtifact>;
  dataContext: IDataContext;
  statKey: string;
}): number => {
  const { getArtifactMainStatMaxValue } = dataContext;

  return Object.values(artifacts).reduce((total, artifact) => {
    if (artifact.mainStatKey === statKey) {
      total += getArtifactMainStatMaxValue({ mainStatKey: statKey, rarity: artifact.rarity });
    }
    total += artifact.subStats.find((statValue) => statValue.key === statKey)?.value || 0;
    return total;
  }, 0);
};
