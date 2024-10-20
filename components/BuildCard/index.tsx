import { ArtifactSet, Build, Weapon } from "../../types";
import { Card } from "../ui/card";
import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";
import ViewableBuildContent from "./ViewableBuildContent";

interface BuildCardProps {
  artifactSets: ArtifactSet[];
  build: Build;
  inEditMode: boolean;
  onRemove: (characterKey: string) => void;
  onToggleDesiredSubStat: (characterKey: string, stat: string) => void;
  onToggleEditMode: (characterKey: string) => void;
  onUpdate: (characterKey: string, updates: Partial<Build>) => void;
  onUpdateDesiredMainStat: (characterKey: string, type: string, value: string) => void;
  recommendArtifacts: (build: Build) => { mainStat: string; subStats: string[]; type: string }[];
  weapons: Weapon[];
}

const BuildCard: React.FC<BuildCardProps> = ({
  artifactSets,
  build,
  inEditMode,
  onRemove,
  onToggleEditMode,
  onUpdate,
  weapons,
}) => {
  return (
    <Card>
      <Header build={build} inEditMode={inEditMode} onRemove={onRemove} onToggleEditMode={onToggleEditMode} />
      {inEditMode ? (
        <EditableBuildContent artifactSets={artifactSets} build={build} onUpdate={onUpdate} weapons={weapons} />
      ) : (
        <ViewableBuildContent build={build} />
      )}
    </Card>
  );
};

export default BuildCard;
