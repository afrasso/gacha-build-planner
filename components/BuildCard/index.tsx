import { calculateBuildSatisfaction } from "@/calculation/buildmetrics/satisfaction";
import { Card } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactSet, Build, Weapon } from "@/types";

import BuildSatisfactionComponent from "./BuildSatisfactionComponent";
import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";

interface BuildCardProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onRemove: (buildId: string) => void;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
  weapons: Weapon[];
}

const BuildCard: React.FC<BuildCardProps> = ({ build, onRemove, onUpdate }) => {
  const genshinDataContext = useGenshinDataContext();
  const { artifactSets } = genshinDataContext;

  const satisfactionResults = calculateBuildSatisfaction({ build, genshinDataContext });

  return (
    <Card className="w-full h-full">
      <Header build={build} isSatisfied={satisfactionResults.overallSatisfaction} onRemove={onRemove} />
      <BuildSatisfactionComponent result={satisfactionResults} />
      <EditableBuildContent artifactSets={artifactSets} build={build} onUpdate={onUpdate} />
    </Card>
  );
};

export default BuildCard;
