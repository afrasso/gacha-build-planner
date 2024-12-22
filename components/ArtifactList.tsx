import { Fragment } from "react";

import { Artifact, Build } from "@/types";

import ArtifactSatisfactionComponent from "./ArtifactSatisfactionComponent";
import ArtifactCard from "./BuildCard/EditableBuildContent/ArtifactCollection/ArtifactCard";

interface ArtifactListProps {
  artifacts: Artifact[];
  builds: Build[];
}

const ArtifactList: React.FC<ArtifactListProps> = ({ artifacts, builds }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artifacts.map((artifact) => (
        <Fragment key={artifact.id}>
          <ArtifactCard artifact={artifact} artifactType={artifact.type} />
          <ArtifactSatisfactionComponent artifact={artifact} builds={builds} />
        </Fragment>
      ))}
    </div>
  );
};

export default ArtifactList;
