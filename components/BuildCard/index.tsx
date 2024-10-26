import { useRef } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Card } from "@/components/ui/card";
import { ArtifactSet, Build, Weapon } from "@/types";

import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";
import ViewableBuildContent from "./ViewableBuildContent";

interface BuildCardProps {
  artifactSets: ArtifactSet[];
  build: Build;
  inEditMode: boolean;
  onRemove: (characterKey: string) => void;
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
  const editableBuildContentRef = useRef<ISaveableContentHandle>(null);

  const onCancel = () => {
    editableBuildContentRef.current?.cancel();
  };

  const onSave = () => {
    if (editableBuildContentRef.current?.validate()) {
      return editableBuildContentRef.current.save();
    } else {
      console.error("Validation failed");
      return false;
    }
  };

  return (
    <Card>
      <Header
        build={build}
        inEditMode={inEditMode}
        onCancel={onCancel}
        onRemove={onRemove}
        onSave={onSave}
        onToggleEditMode={onToggleEditMode}
      />
      {inEditMode ? (
        <EditableBuildContent
          artifactSets={artifactSets}
          build={build}
          onUpdate={onUpdate}
          ref={editableBuildContentRef}
          weapons={weapons}
        />
      ) : (
        <ViewableBuildContent build={build} />
      )}
    </Card>
  );
};

export default BuildCard;
