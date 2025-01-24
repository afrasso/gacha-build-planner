import { useState } from "react";

import { getTopBuilds } from "@/calculation/artifactmetrics/gettopbuilds";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Artifact, ArtifactMetric, Build } from "@/types";

interface TopBuildsProps {
  artifact: Artifact;
  builds: Build[];
}

const TopBuilds: React.FC<TopBuildsProps> = ({ artifact, builds }) => {
  const [topBuildsMetric, setTopBuildsMetric] = useState<ArtifactMetric | undefined>();

  const topBuilds = topBuildsMetric && getTopBuilds({ artifact, builds, metric: topBuildsMetric });

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Top Builds</h2>
      <Select onValueChange={(metric) => setTopBuildsMetric(metric as ArtifactMetric)} value={topBuildsMetric}>
        <SelectTrigger>
          <SelectValue placeholder="Select a metric" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ArtifactMetric).map((metric) => (
            <SelectItem key={metric} value={metric}>
              {metric}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-4">
        {topBuilds &&
          topBuilds.map((build, index) => (
            <BuildCard
              build={build}
              key={build.characterId}
              rank={index + 1}
              result={artifact.metricsResults[topBuildsMetric].buildResults[build.characterId].result}
            />
          ))}
      </div>
    </div>
  );
};

const BuildCard: React.FC<{
  build: Build;
  rank: number;
  result?: number;
}> = ({ build, rank, result }) => (
  <div className="bg-secondary p-4 rounded-lg flex items-center">
    <div className="text-3xl font-bold mr-4">#{rank}</div>
    <div>
      <h3 className="text-xl font-semibold">{build.characterId}</h3>
      <p className="text-sm text-muted-foreground">The build.</p>
      {JSON.stringify(result)}
    </div>
  </div>
);

export default TopBuilds;
