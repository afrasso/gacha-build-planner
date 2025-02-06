import { ArtifactType } from "@/types";

const getArtifactTypeCombinations = ({
  artifactTypes,
  combinations = [],
  count,
  currentCombination = [],
  startIndex = 0,
}: {
  artifactTypes: ArtifactType[];
  combinations?: ArtifactType[][];
  count: number;
  currentCombination?: ArtifactType[];
  startIndex?: number;
}): ArtifactType[][] => {
  if (count > artifactTypes.length) {
    throw new Error(
      `The number of requested Artifact Types in a combination (${count}) cannot exceed the number of provided Artifact Types (${artifactTypes.length}).`
    );
  }
  if (currentCombination.length === count) {
    combinations.push([...currentCombination]);
    return combinations;
  }
  for (let i = startIndex; i < artifactTypes.length; i++) {
    currentCombination.push(artifactTypes[i]);
    getArtifactTypeCombinations({ artifactTypes, combinations, count, currentCombination, startIndex: i + 1 });
    currentCombination.pop();
  }
  return combinations;
};

export default getArtifactTypeCombinations;
