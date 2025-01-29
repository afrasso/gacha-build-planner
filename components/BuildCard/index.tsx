import { calculateBuildSatisfaction } from "@/calculation/buildmetrics/satisfaction";
import { Card } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build } from "@/types";

import BuildSatisfactionComponent from "./BuildSatisfactionComponent";
import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";

interface BuildCardProps {
  build: Build;
  onRemove?: (buildId: string) => void;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
  showInfoButton: boolean;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, onRemove, onUpdate, showInfoButton }) => {
  const genshinDataContext = useGenshinDataContext();
  const { artifactSets } = genshinDataContext;

  const satisfactionResults = calculateBuildSatisfaction({ build, genshinDataContext });

  return (
    <Card className="w-full h-full">
      <Header
        build={build}
        isSatisfied={satisfactionResults.overallSatisfaction}
        onRemove={onRemove}
        showInfoButton={showInfoButton}
      />
      <BuildSatisfactionComponent result={satisfactionResults} />
      <EditableBuildContent artifactSets={artifactSets} build={build} onUpdate={onUpdate} />
    </Card>
  );
};

export default BuildCard;
