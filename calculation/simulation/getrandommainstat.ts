import { IDataContext } from "@/contexts/DataContext";

import getCumulativeMainStatOdds from "../getcumulativemainstatodds";

export const getRandomMainStat = ({
  artifactTypeKey,
  dataContext,
  mainStatKeys,
}: {
  artifactTypeKey: string;
  dataContext: IDataContext;
  mainStatKeys?: string[];
}): string => {
  const { getArtifactMainStatOdds, getPossibleArtifactMainStats } = dataContext;

  const unfilteredMainStatKeys = getPossibleArtifactMainStats({ artifactTypeKey });
  const filteredMainStatKeys =
    mainStatKeys && mainStatKeys.length > 0
      ? unfilteredMainStatKeys.filter((statKey) => mainStatKeys?.includes(statKey))
      : unfilteredMainStatKeys;
  const cumulativeOdds = getCumulativeMainStatOdds({
    artifactTypeKey,
    dataContext,
    mainStatKeys: filteredMainStatKeys,
  });

  const random = Math.random() * cumulativeOdds;
  let currentCumulativeOdds = 0;
  for (const mainStatKey of filteredMainStatKeys) {
    const odds = getArtifactMainStatOdds({ artifactTypeKey, mainStatKey });
    if (random < currentCumulativeOdds + odds) {
      return mainStatKey;
    }
    currentCumulativeOdds += odds;
  }

  throw new Error(
    `Unexpected error: the actual cumulative main stat odds for the artifact type ${artifactTypeKey} are greater than the expected cumulative odds: ${currentCumulativeOdds}.`
  );
};
