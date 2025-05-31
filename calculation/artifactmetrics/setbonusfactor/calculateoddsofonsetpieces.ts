import getCumulativeMainStatOdds from "@/calculation/getcumulativemainstatodds";
import { IDataContext } from "@/contexts/DataContext";

const factorials: Record<number, number> = {
  1: 1,
  2: 2,
  3: 6,
  4: 24,
  5: 120,
};

const calculateOddsOfOnSetPieces = ({
  artifactTypeKeys,
  dataContext,
  desiredArtifactMainStats,
}: {
  artifactTypeKeys: string[];
  dataContext: IDataContext;
  desiredArtifactMainStats: Record<string, string[]>;
}): number => {
  const { getArtifactTypes } = dataContext;

  const numArtifactTypes = getArtifactTypes().length;

  // Total odds are the odds that all of the specified artifacts are on-set.
  const initialOdds = artifactTypeKeys.reduce((acc, artifactTypeKey) => {
    const odds = getCumulativeMainStatOdds({
      artifactTypeKey,
      dataContext,
      mainStatKeys: desiredArtifactMainStats[artifactTypeKey],
    });
    // Divide by the number of artifact types due to the raw odds of even getting this artifact type.
    acc = acc * odds;
    return acc / numArtifactTypes;
  }, 1);

  return initialOdds * factorials[artifactTypeKeys.length];
};

export default calculateOddsOfOnSetPieces;
