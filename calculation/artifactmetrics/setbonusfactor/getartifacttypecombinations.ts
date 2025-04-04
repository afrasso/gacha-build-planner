const getArtifactTypeCombinations = ({
  artifactTypeKeys,
  combinations = [],
  count,
  currentCombination = [],
  startIndex = 0,
}: {
  artifactTypeKeys: string[];
  combinations?: string[][];
  count: number;
  currentCombination?: string[];
  startIndex?: number;
}): string[][] => {
  if (count > artifactTypeKeys.length) {
    throw new Error(
      `The number of requested Artifact Types in a combination (${count}) cannot exceed the number of provided Artifact Types (${artifactTypeKeys.length}).`
    );
  }
  if (currentCombination.length === count) {
    combinations.push([...currentCombination]);
    return combinations;
  }
  for (let i = startIndex; i < artifactTypeKeys.length; i++) {
    currentCombination.push(artifactTypeKeys[i]);
    getArtifactTypeCombinations({ artifactTypeKeys, combinations, count, currentCombination, startIndex: i + 1 });
    currentCombination.pop();
  }
  return combinations;
};

export default getArtifactTypeCombinations;
