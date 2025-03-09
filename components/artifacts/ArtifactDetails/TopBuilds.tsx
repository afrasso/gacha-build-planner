import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { getTopBuilds } from "@/calculation/artifactmetrics/gettopbuilds";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataContext } from "@/contexts/DataContext";
import { Artifact, ArtifactData, ArtifactMetric, ArtifactMetricsResults, BuildData } from "@/types";

import MetricChart from "./MetricChart";

interface TopBuildsProps {
  artifact: ArtifactData;
  builds: BuildData[];
}

const TopBuilds: React.FC<TopBuildsProps> = ({ artifact, builds }) => {
  const { constructBuild } = useDataContext();

  const [topBuildsMetric, setTopBuildsMetric] = useState<ArtifactMetric | undefined>();

  const topBuilds: BuildData[] | undefined =
    topBuildsMetric &&
    getTopBuilds({ artifact: new Artifact(artifact), builds: builds.map(constructBuild), metric: topBuildsMetric }).map(
      (build) => build.toBuildData()
    );

  return (
    <div>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 mt-4 gap-4 place-items-center">
        {topBuilds &&
          topBuilds.map((build, index) => (
            <BuildCard
              build={build}
              key={build.characterId}
              metricsResults={artifact.metricsResults}
              rank={index + 1}
            />
          ))}
      </div>
    </div>
  );
};

interface BuildCardProps {
  build: BuildData;
  metricsResults: ArtifactMetricsResults;
  rank: number;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, metricsResults, rank }) => {
  const { getCharacter } = useDataContext();

  const character = getCharacter(build.characterId);

  return (
    <div className="bg-secondary p-1 rounded-lg flex items-center w-full max-w-96 h-28 gap-2">
      <div className="text-3xl font-bold text-right mr-1 w-12">{rank}.</div>
      <div className="flex flex-col items-center w-24">
        <Link href={`/genshin/builds/${build.characterId}`}>
          <Image alt={character.name} className="rounded-full" height={50} src={character.iconUrl} width={50} />
        </Link>
        <div className="text-center text-l font-semibold">{character.name}</div>
      </div>
      <div className="cursor-default bg-background border p-1 w-full">
        <MetricChart characterId={build.characterId} metricsResults={metricsResults} />
      </div>
    </div>
  );
};

export default TopBuilds;
