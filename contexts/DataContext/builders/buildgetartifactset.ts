import { ArtifactSet } from "@/types";

type retFn = (id: string) => ArtifactSet;

export const buildGetArtifactSet = (artifactSets: ArtifactSet[]): retFn => {
  const lookup = artifactSets.reduce<Record<string, ArtifactSet>>((acc, x) => {
    acc[x.id] = x;
    return acc;
  }, {});

  return (id: string): ArtifactSet => {
    const artifactSet = lookup[id];
    if (!artifactSet) {
      throw new Error(`Could not find artifact set with ID ${id}.`);
    }
    return artifactSet;
  };
};
