import { getTopBuilds } from "@/calculation/artifactmetrics/gettopbuilds";
import { Artifact, ArtifactMetric, ArtifactMetricResult, Build } from "@/types";

interface TopBuildsProps {
  artifact: Artifact;
  builds: Build[];
  topBuildsMetric: ArtifactMetric;
}

const TopBuilds: React.FC<TopBuildsProps> = ({ artifact, builds, topBuildsMetric }) => {
  const topBuilds = getTopBuilds({ artifact, builds, metric: topBuildsMetric });
  if (!artifact.metricResults || !artifact.metricResults[topBuildsMetric]) {
    return <div>Refresh metrics to calculate top builds.</div>;
  }
  const metricResults = artifact.metricResults[topBuildsMetric];

  return (
    <div className="space-y-4">
      {topBuilds.map((build, index) => (
        <BuildCard build={build} key={build.characterId} rank={index + 1} result={metricResults[build.characterId]} />
      ))}
    </div>
  );
};

const BuildCard: React.FC<{
  build: Build;
  rank: number;
  result: ArtifactMetricResult;
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
