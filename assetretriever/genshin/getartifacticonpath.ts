import path from "path";

import { ArtifactType } from "@/types";
import { __publicdir } from "@/utils/directoryutils";

import getArtifactIconSuffix from "./getartifacticonsuffix";

const getArtifactIconPath = ({ id, type }: { id: string; type: ArtifactType }): string => {
  return path.join(__publicdir, "genshin", "artifacts", `${id}${getArtifactIconSuffix(type)}.png`);
};

export default getArtifactIconPath;
