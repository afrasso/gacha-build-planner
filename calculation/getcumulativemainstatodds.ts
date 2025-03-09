import { IDataContext } from "@/contexts/DataContext";

const getCumulativeMainStatOdds = ({
  artifactTypeKey,
  dataContext,
  mainStatKeys,
}: {
  artifactTypeKey: string;
  dataContext: IDataContext;
  mainStatKeys?: string[];
}): number => {
  const { getArtifactMainStatOdds } = dataContext;

  // If no main stats are specified, we can assume that any main stat is acceptable, and thus the odds of getting an
  // main stat is 1.
  if (!mainStatKeys || mainStatKeys.length === 0) {
    return 1;
  }

  return mainStatKeys.reduce((acc, mainStatKey) => {
    acc += getArtifactMainStatOdds({ artifactTypeKey, mainStatKey });
    return acc;
  }, 0);
};

export default getCumulativeMainStatOdds;
