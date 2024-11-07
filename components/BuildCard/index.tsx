import { Card } from "@/components/ui/card";
import { ArtifactSet, Build, Weapon } from "@/types";

import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";

interface BuildCardProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onRemove: (buildId: string) => void;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
  weapons: Weapon[];
}

const BuildCard: React.FC<BuildCardProps> = ({ artifactSets, build, onRemove, onUpdate, weapons }) => {
  return (
    <Card className="w-full h-full">
      <Header build={build} onRemove={onRemove} />
      <EditableBuildContent artifactSets={artifactSets} build={build} onUpdate={onUpdate} weapons={weapons} />
    </Card>
  );
};

export default BuildCard;
