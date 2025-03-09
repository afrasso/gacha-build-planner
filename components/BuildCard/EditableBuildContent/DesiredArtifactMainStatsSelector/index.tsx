"use client";

import { Label } from "@/components/ui/label";
import { useDataContext } from "@/contexts/DataContext";

import DesiredArtifactMainStatSelector from "./DesiredArtifactMainStatSelector";

interface DesiredArtifactMainStatsSelectorProps {
  desiredArtifactMainStats: Record<string, string[]>;
  onChange: (desiredArtifactMainStats: Record<string, string[]>) => void;
}

const DesiredArtifactMainStatsSelector: React.FC<DesiredArtifactMainStatsSelectorProps> = ({
  desiredArtifactMainStats,
  onChange,
}) => {
  const { getArtifactTypesWithVariableMainStats } = useDataContext();

  return (
    <div className="mb-2">
      <div className="h-8 items-center flex">
        <Label className="text-md font-semibold text-primary whitespace-nowrap" data-testid="main-stats-label">
          Main Stats:
        </Label>
      </div>
      {getArtifactTypesWithVariableMainStats().map((artifactType) => (
        <DesiredArtifactMainStatSelector
          artifactTypeKey={artifactType.key}
          key={artifactType.key}
          mainStatKeys={desiredArtifactMainStats[artifactType.key] || []}
          onUpdate={(mainStatKeys) => onChange({ ...desiredArtifactMainStats, [artifactType.key]: mainStatKeys })}
        />
      ))}
    </div>
  );
};

export default DesiredArtifactMainStatsSelector;
