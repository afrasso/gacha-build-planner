import getArtifactIconSuffix from "./getartifacticonsuffix";
import { ArtifactType } from "./types";

const getArtifactIconPath = ({ id, type }: { id: string; type: ArtifactType }): string => {
  return `/genshin/artifacts/${id}${getArtifactIconSuffix(type)}.png`;
};

export default getArtifactIconPath;
