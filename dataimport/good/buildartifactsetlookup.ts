import { IDataContext } from "@/contexts/DataContext";
import { ArtifactSet } from "@/types";

import { toPascalCase } from "./topascalcase";

export const buildArtifactSetLookup = ({ dataContext }: { dataContext: IDataContext }) => {
  const { getArtifactSets } = dataContext;

  const lookup = getArtifactSets().reduce<Record<string, ArtifactSet>>((acc, artifactSet) => {
    acc[toPascalCase(artifactSet.name)] = artifactSet;
    return acc;
  }, {});

  const lookupArtifactSet = (key: string): ArtifactSet => {
    const artifactSet = lookup[key];
    if (!artifactSet) {
      console.error(`Unexpected error: the artifact set ${key} could not be found.`);
    }
    return artifactSet;
  };

  return lookupArtifactSet;
};
