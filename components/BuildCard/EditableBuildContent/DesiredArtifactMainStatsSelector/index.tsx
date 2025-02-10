"use client";

import { Label } from "@/components/ui/label";
import { getMainStats } from "@/constants";
import { ArtifactType, DesiredArtifactMainStats, Stat } from "@/types";

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
        <Label className="text-md font-semibold text-primary whitespace-nowrap" data-testid="main-stats-label">
          Main Stats:
        </Label>
      </div>
      {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
        <DesiredArtifactMainStatSelector
          artifactType={artifactType}
          key={artifactType}
          mainStats={desiredArtifactMainStats[artifactType] || []}
          onUpdate={(mainStats) => onChange({ ...desiredArtifactMainStats, [artifactType]: mainStats })}
        />
      ))}
    </div>
  );
};

export default DesiredArtifactMainStatsSelector;
