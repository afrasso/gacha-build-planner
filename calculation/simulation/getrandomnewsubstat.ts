import { IDataContext } from "@/contexts/DataContext";

export const getRandomNewSubStat = ({
  dataContext,
  mainStatKey,
  subStatKeys,
}: {
  dataContext: IDataContext;
  mainStatKey: string;
  subStatKeys: string[];
}): string => {
  const { getArtifactSubStatRelativeLikelihood, getPossibleArtifactSubStats } = dataContext;

  const currentStatKeys = new Set([mainStatKey, ...subStatKeys]);
  const remainingStatKeys = getPossibleArtifactSubStats().filter((subStatKey) => !currentStatKeys.has(subStatKey));
  const remainingSubstatWeights: [string, number][] = remainingStatKeys.map((subStatKey) => {
    const weight = getArtifactSubStatRelativeLikelihood({ subStatKey });
    return [subStatKey, weight];
  });
  const total = remainingSubstatWeights.reduce((sum, [, weight]) => sum + weight, 0);
  const random = Math.random() * total;
  let current = 0;
  for (const [key, value] of remainingSubstatWeights) {
    if (random < current + value) {
      return key;
    }
    current += value;
  }
  throw new Error("Unexpected error: value greater than total substat weights.");
};
