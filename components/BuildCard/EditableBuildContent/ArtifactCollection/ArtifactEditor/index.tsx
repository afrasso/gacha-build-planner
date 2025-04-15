"use client";

import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Button } from "@/components/ui/button";
import { ArtifactData, ArtifactMetric, Stat } from "@/types";

import LevelSelector from "./LevelSelector";
import MainStatSelector from "./MainStatSelector";
import RaritySelector from "./RaritySelector";
import SetSelector from "./SetSelector";
import SubStatsSelector from "./SubStatsSelector";

interface ArtifactEditorProps {
  artifact?: Partial<ArtifactData>;
  artifactTypeKey: string;
  onUpdate: (artifact: ArtifactData) => void;
}

const ArtifactEditor: React.FC<ArtifactEditorProps> = ({
  artifact,
  artifactTypeKey,
  onUpdate,
}: ArtifactEditorProps) => {
  // TODO: Max rarity should be part of data context.
  const defaultRarity = 5;

  // TODO: Constructing a new artifact shouldn't be this hard. Consider changing to have the artifact editor not take a
  // full artifact, but the components of one, and have the parent component handle turning that into a valid artifact
  // type.
  const [internalArtifact, setInternalArtifact] = useState<Partial<ArtifactData>>(
    artifact || {
      _typeBrand: "ArtifactData",
      id: uuidv4(),
      isLocked: false,
      lastUpdatedDate: new Date().toISOString(),
      metricsResults: {
        [ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS]: { buildResults: {} },
        [ArtifactMetric.PLUS_MINUS]: { buildResults: {} },
        [ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS]: { buildResults: {} },
        [ArtifactMetric.RATING]: { buildResults: {} },
      },
      rarity: defaultRarity,
      typeKey: artifactTypeKey,
    }
  );

  const setSelectorRef = useRef<ISaveableContentHandle>(null);
  const mainStatSelectorRef = useRef<ISaveableContentHandle>(null);
  const subStatsSelectorRef = useRef<ISaveableContentHandle>(null);

  const save = () => {
    if (validate() && subStatsSelectorRef.current?.validate()) {
      onUpdate(internalArtifact as ArtifactData);
    }
  };

  const updateSetId = (setId: string) => {
    setInternalArtifact((prev: Partial<ArtifactData>) => ({ ...prev, setId }));
  };

  const updateRarity = (rarity: number) => {
    setInternalArtifact((prev: Partial<ArtifactData>) => ({ ...prev, rarity }));
  };

  const updateLevel = (level: number) => {
    setInternalArtifact((prev: Partial<ArtifactData>) => ({ ...prev, level }));
  };

  const updateMainStat = (mainStatKey: string) => {
    setInternalArtifact((prev: Partial<ArtifactData>) => ({ ...prev, mainStatKey }));
  };

  const updateSubStats = (subStats: Stat[]) => {
    setInternalArtifact((prev: Partial<ArtifactData>) => ({ ...prev, subStats }));
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
        artifactTypeKey={artifactTypeKey}
        onUpdate={updateSetId}
        ref={setSelectorRef}
        setId={internalArtifact?.setId}
      />
      <RaritySelector onUpdate={updateRarity} rarity={internalArtifact.rarity!} />
      <LevelSelector level={internalArtifact.level} onUpdate={updateLevel} />
      <MainStatSelector
        artifactTypeKey={artifactTypeKey}
        mainStatKey={internalArtifact.mainStatKey}
        onUpdate={updateMainStat}
        ref={mainStatSelectorRef}
      />
      <SubStatsSelector
        mainStatKey={internalArtifact.mainStatKey}
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
