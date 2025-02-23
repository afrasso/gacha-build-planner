import { ArtifactType } from "@/types";

import getArtifactIconSuffix from "./getartifacticonsuffix";

const getArtifactIconPath = ({ id, type }: { id: string; type: ArtifactType }): string => {
  return `/genshin/artifacts/${id}${getArtifactIconSuffix(type)}.png`;
};

export default getArtifactIconPath;
