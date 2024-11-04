"use client";

import React, { useRef, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { Artifact, ArtifactSet, ArtifactType, Stat, StatValue } from "@/types";

import MainStatSelector from "./MainStatSelector";
import SetSelector from "./SetSelector";
import SubStatsSelector from "./SubStatsSelector";

interface ArtifactEditorProps {
  artifact?: Partial<Artifact>;
  artifactSets: ArtifactSet[];
  artifactType: ArtifactType;
  onUpdate: (artifact: Artifact) => void;
}

const ArtifactEditor: React.FC<ArtifactEditorProps> = ({
  artifact,
  artifactSets,
  artifactType,
  onUpdate,
}: ArtifactEditorProps) => {
  const [internalArtifact, setInternalArtifact] = useState<Partial<Artifact>>(artifact || { type: artifactType });

  const setSelectorRef = useRef<ISaveableContentHandle>(null);
  const mainStatSelectorRef = useRef<ISaveableContentHandle>(null);
  const subStatsSelectorRef = useRef<ISaveableContentHandle>(null);

  const save = () => {
    if (validate() && subStatsSelectorRef.current?.validate()) {
      onUpdate(internalArtifact as Artifact);
    }
  };

  const updateSet = (set: ArtifactSet) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, set }));
  };

  const updateMainStat = (mainStat: Stat) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, mainStat }));
  };

  const updateSubStats = (subStats: StatValue[]) => {
    setInternalArtifact((prev: Partial<Artifact>) => ({ ...prev, subStats }));
  };

  const validate = () => {
    const setIsValid = setSelectorRef.current?.validate();
    const mainStatIsValid = mainStatSelectorRef.current?.validate();
    const subStatsAreValid = subStatsSelectorRef.current?.validate();
    console.log(`setIsValid=${setIsValid}`);
    console.log(`mainStatIsValid=${mainStatIsValid}`);
    console.log(`subStatsAreValid=${subStatsAreValid}`);
    return (
      internalArtifact &&
      internalArtifact.type &&
      internalArtifact.mainStat &&
      setIsValid &&
      mainStatIsValid &&
      subStatsAreValid
    );
  };

  return (
    <>
      <div className="space-y-2">
        <SetSelector
          artifactSets={artifactSets}
          artifactType={artifactType}
          onUpdate={updateSet}
          ref={setSelectorRef}
          set={internalArtifact.set}
        />
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
        <Button className="w-full mt-4" onClick={() => save()}>
          Save Artifact
        </Button>
      </div>
    </>
  );
};

export default ArtifactEditor;
