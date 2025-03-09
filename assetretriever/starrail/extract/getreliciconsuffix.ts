import { ArtifactType } from "../types";

const getRelicIconSuffix = (type: ArtifactType) => {
  switch (type) {
    case ArtifactType.BODY:
      return "_3";
    case ArtifactType.FOOT:
      return "_4";
    case ArtifactType.HAND:
      return "_2";
    case ArtifactType.HEAD:
      return "_1";
    case ArtifactType.NECK:
      return "_6";
    case ArtifactType.OBJECT:
      return "_5";
    default:
      throw new Error(`Unexpected artifact type ${type} was encountered.`);
  }
};

export default getRelicIconSuffix;
