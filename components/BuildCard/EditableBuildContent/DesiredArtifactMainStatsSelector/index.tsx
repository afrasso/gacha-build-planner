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
    <div className="mb-4">
      <Label className="text-md font-semibold text-primary whitespace-nowrap mb-2 block">Artifact Main Stats:</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
          <div className="flex flex-col space-y-2" key={artifactType}>
            <Label className="text-sm font-semibold text-primary whitespace-nowrap">{artifactType}</Label>
            <DesiredArtifactMainStatSelector
              mainStats={MAIN_STATS_BY_ARTIFACT_TYPE[artifactType]}
              onChange={(stat) => onChange({ ...desiredArtifactMainStats, [artifactType]: stat })}
              stat={desiredArtifactMainStats[artifactType]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

DesiredArtifactMainStatsSelector.displayName = "DesiredArtifactMainStatsSelector";

export default DesiredArtifactMainStatsSelector;
