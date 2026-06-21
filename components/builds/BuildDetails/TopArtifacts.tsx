import { useEffect, useMemo, useState } from "react";

import { getTopArtifacts } from "@/calculation/artifactmetrics/gettopartifacts";
import ArtifactCard from "@/components/artifacts/ArtifactCard";
import {
  ArtifactFilter,
  ArtifactFilterDialog,
  isInFilter,
} from "@/components/artifacts/ArtifactManager/ArtifactFilterDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getArtifactMetricLabel } from "@/constants/messages";
import { useDataContext } from "@/contexts/DataContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { Artifact, ArtifactData, ArtifactMetric, BuildData } from "@/types";

interface TopBuildsProps {
  artifacts: ArtifactData[];
  build: BuildData;
  count?: number;
  showMetrics: boolean;
}

const TopArtifacts: React.FC<TopBuildsProps> = ({ artifacts, build, count = 12, showMetrics }) => {
  const { constructBuild } = useDataContext();
  const { enabledArtifactMetrics } = useSettingsContext();

  const [filter, setFilter] = useState<ArtifactFilter>();
  const [topArtifactsMetric, setTopArtifactsMetric] = useState<ArtifactMetric | undefined>();

  useEffect(() => {
    if (topArtifactsMetric && !enabledArtifactMetrics.includes(topArtifactsMetric)) {
      setTopArtifactsMetric(undefined);
    }
  }, [enabledArtifactMetrics, topArtifactsMetric]);

  const topArtifacts = useMemo((): ArtifactData[] => {
    if (!topArtifactsMetric) {
      return [];
    }
    const filteredArtifacts = artifacts.filter((artifact) => isInFilter({ artifact, filter }));
    return getTopArtifacts({
      artifacts: filteredArtifacts.map((artifact) => new Artifact(artifact)),
      build: constructBuild(build),
      metric: topArtifactsMetric,
    }).map((artifact) => artifact.toArtifactData());
  }, [artifacts, build, constructBuild, filter, topArtifactsMetric]);

  return (
    <div>
      <div className="flex">
        <Select onValueChange={(metric) => setTopArtifactsMetric(metric as ArtifactMetric)} value={topArtifactsMetric}>
          <SelectTrigger>
            <SelectValue placeholder="Select a metric" />
          </SelectTrigger>
          <SelectContent>
            {enabledArtifactMetrics.map((metric) => (
              <SelectItem key={metric} value={metric}>
                {getArtifactMetricLabel(metric)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArtifactFilterDialog filter={filter} onFilterChange={setFilter} />
      </div>

      <div className="w-full mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
          {topArtifacts.slice(0, count).map((artifact) => (
            <ArtifactCard
              artifact={artifact}
              artifactTypeKey={artifact.typeKey}
              key={artifact.id}
              showInfoButton={true}
              showMetrics={showMetrics}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopArtifacts;
