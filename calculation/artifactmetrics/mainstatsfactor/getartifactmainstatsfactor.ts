import getCumulativeMainStatOdds from "@/calculation/getcumulativemainstatodds";
import { IDataContext } from "@/contexts/DataContext";
import { IArtifact } from "@/types";

const getArtifactMainStatsFactor = ({
  artifact,
  dataContext,
  desiredArtifactMainStats,
}: {
  artifact: IArtifact;
  dataContext: IDataContext;
  desiredArtifactMainStats: Record<string, string[]>;
}): number => {
  const { getArtifactTypes } = dataContext;

  // The factor is equal to the odds that we'll obtain the other artifacts with matching main stats before this one.
  // Unlike with set bonuses where we had to take into account the likelihood of main stats into account, here we don't
  // need to because when farming from a domain, the likelihood of getting a particular set on an artifact is the same
  // regardless of the artifact type (50%).

  const factor = getArtifactTypes()
    // Filter out the current artifact type, since what we're calculating is the odds we _won't_ get it before the
    // others.
    .filter((artifactType) => artifactType.key !== artifact.typeKey)
    // Multiply the odds to get the total odds.
    .reduce((acc, artifactType) => {
      acc =
        acc *
        getCumulativeMainStatOdds({
          artifactTypeKey: artifactType.key,
          dataContext,
          mainStatKeys: desiredArtifactMainStats[artifactType.key],
        });
      return acc;
    }, 1);
  return factor;
};

export default getArtifactMainStatsFactor;
