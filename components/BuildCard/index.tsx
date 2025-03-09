import { calculateBuildSatisfaction } from "@/calculation/buildmetrics/satisfaction";
import { Card } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { BuildData } from "@/types";

import BuildSatisfactionComponent from "./BuildSatisfactionComponent";
import EditableBuildContent from "./EditableBuildContent";
import Header from "./Header";

interface BuildCardProps {
  build: BuildData;
  onRemove?: (buildId: string) => void;
  onUpdate: (buildId: string, build: Partial<BuildData>) => void;
  showInfoButton: boolean;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, onRemove, onUpdate, showInfoButton }) => {
  const dataContext = useDataContext();
  const { constructBuild, getArtifactSets } = dataContext;

  const satisfactionResults = calculateBuildSatisfaction({ build: constructBuild(build), dataContext });

  return (
    <Card className="w-full h-full">
      <Header
        build={build}
        isSatisfied={satisfactionResults.overallSatisfaction}
        onRemove={onRemove}
        showInfoButton={showInfoButton}
      />
      <BuildSatisfactionComponent result={satisfactionResults} />
      <EditableBuildContent artifactSets={getArtifactSets()} build={build} onUpdate={onUpdate} />
    </Card>
  );
};

export default BuildCard;
