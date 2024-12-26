import { Card } from "@/components/ui/card";
import { ArtifactSet, Build, Weapon } from "@/types";

import BuildSatisfactionComponent from "./BuildSatisfactionComponent";
import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";
import { calculateStats } from "@/buildhelpers/calculatestats";
import { calculateBuildSatisfaction } from "@/buildhelpers/calculatebuildsatisfaction";

interface BuildCardProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onRemove: (buildId: string) => void;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
  weapons: Weapon[];
}

const BuildCard: React.FC<BuildCardProps> = ({ artifactSets, build, onRemove, onUpdate, weapons }) => {
  const stats = calculateStats({ build });
  // const filteredStats = Object.entries(stats).filter((entry) => entry[1] > 0);
  const satisfactionResults = calculateBuildSatisfaction({ build });

  return (
    <Card className="w-full h-full">
      <Header build={build} onRemove={onRemove} isSatisfied={satisfactionResults.overallSatisfaction} />
      <BuildSatisfactionComponent result={satisfactionResults} />
      <EditableBuildContent artifactSets={artifactSets} build={build} onUpdate={onUpdate} weapons={weapons} />
    </Card>
  );
};

export default BuildCard;
