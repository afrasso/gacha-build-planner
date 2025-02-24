"use client";

import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Artifact, ArtifactType, Stat, StatKey } from "@/types";

import LevelSelector from "./LevelSelector";
import MainStatSelector from "./MainStatSelector";
import RaritySelector from "./RaritySelector";
import SetSelector from "./SetSelector";
import SubStatsSelector from "./SubStatsSelector";

interface ArtifactEditorProps {
  artifact?: Partial<Artifact>;
  artifactType: ArtifactType;
  onUpdate: (artifact: Artifact) => void;
}

const ArtifactEditor: React.FC<ArtifactEditorProps> = ({ artifact, artifactType, onUpdate }: ArtifactEditorProps) => {
  const [internalArtifact, setInternalArtifact] = useState<Partial<Artifact>>(
    artifact || { id: uuidv4(), type: artifactType }
  );

  const setSelectorRef = useRef<ISaveableContentHandle>(null);
  const mainStatSelectorRef = useRef<ISaveableContentHandle>(null);
  const subStatsSelectorRef = useRef<ISaveableContentHandle>(null);

  const save = () => {
    if (validate() && subStatsSelectorRef.current?.validate()) {
      onUpdate(internalArtifact as Artifact);
    }
  };

  const updateSetId = (setId: string) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, setId }));
  };

  const updateRarity = (rarity: number) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, rarity }));
  };

  const updateLevel = (level: number) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, level }));
  };

  const updateMainStat = (mainStat: StatKey) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, mainStat }));
  };

  const updateSubStats = (subStats: Stat<StatKey>[]) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, subStats }));
  };

  const validate = () => {
    const setIsValid = setSelectorRef.current?.validate();
    const mainStatIsValid = mainStatSelectorRef.current?.validate();
    const subStatsAreValid = subStatsSelectorRef.current?.validate();
    return setIsValid && mainStatIsValid && subStatsAreValid;
  };

  return (
    <div>
      <SetSelector
        artifactType={artifactType}
        onUpdate={updateSetId}
        ref={setSelectorRef}
        setId={internalArtifact?.setId}
      />
      <RaritySelector onUpdate={updateRarity} rarity={internalArtifact.rarity} />
      <LevelSelector level={internalArtifact.level} onUpdate={updateLevel} />
      <MainStatSelector
        artifactType={artifactType}
        mainStat={internalArtifact.mainStat}
        onUpdate={updateMainStat}
        ref={mainStatSelectorRef}
      />
      <SubStatsSelector
        mainStat={internalArtifact.mainStat}
        onUpdate={updateSubStats}
        ref={subStatsSelectorRef}
        subStats={internalArtifact?.subStats}
      />
      <Button className="w-full mt-2" onClick={() => save()}>
        Save Artifact
      </Button>
    </div>
  );
};

export default ArtifactEditor;
