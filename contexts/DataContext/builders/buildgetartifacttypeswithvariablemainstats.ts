import { ArtifactType, Misc } from "@/types";

type retFn = () => ArtifactType[];

export const buildGetArtifactTypesWithVariableMainStats = (misc: Misc): retFn => {
  const artifactTypesWithVariableMainStats: ArtifactType[] = [];
  for (const artifactType of misc.artifactTypes) {
    const mainStatOdds = misc.artifactMainStatOddsByType.find((x) => x.typeKey === artifactType.key)?.mainStatOdds;
    if (!mainStatOdds) {
      throw new Error(`Artifact type ${artifactType.key} not found in artifactMainStatOddsByType data.`);
    }
    if (mainStatOdds.length > 1) {
      artifactTypesWithVariableMainStats.push(artifactType);
    }
  }

  return () => artifactTypesWithVariableMainStats;
};
