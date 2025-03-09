import { ArtifactType } from "./types";

const getArtifactIconSuffix = (type: ArtifactType) => {
  switch (type) {
    case ArtifactType.CIRCLET:
      return "_5";
    case ArtifactType.FLOWER:
      return "_1";
    case ArtifactType.GOBLET:
      return "_4";
    case ArtifactType.PLUME:
      return "_2";
    case ArtifactType.SANDS:
      return "_3";
    default:
      throw new Error(`Unexpected artifact type ${type} was encountered.`);
  }
};

export default getArtifactIconSuffix;
