"use client";

import { Label } from "@/components/ui/label";
import { MAIN_STATS_BY_ARTIFACT_TYPE } from "@/constants";
import { ArtifactType, DesiredArtifactMainStats } from "@/types";

import DesiredArtifactMainStatSelector from "./DesiredArtifactMainStatSelector";

interface DesiredArtifactMainStatsSelectorProps {
  desiredArtifactMainStats: DesiredArtifactMainStats;
  onChange: (desiredArtifactMainStats: DesiredArtifactMainStats) => void;
}

const DesiredArtifactMainStatsSelector: React.FC<DesiredArtifactMainStatsSelectorProps> = ({
  desiredArtifactMainStats,
  onChange,
}) => {
  return (
    <div className="mb-2">
      <div className="h-8 items-center flex">
        <Label className="text-md font-semibold text-primary whitespace-nowrap">Main Stats:</Label>
      </div>
      {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
        <DesiredArtifactMainStatSelector
          artifactType={artifactType}
          key={artifactType}
          mainStats={MAIN_STATS_BY_ARTIFACT_TYPE[artifactType]}
          onChange={(stat) => onChange({ ...desiredArtifactMainStats, [artifactType]: stat })}
          stat={desiredArtifactMainStats[artifactType]}
        />
      ))}
    </div>
  );
};

export default DesiredArtifactMainStatsSelector;
