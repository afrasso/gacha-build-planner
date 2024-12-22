import { Check, X } from "lucide-react";

import { calculateBuildSatisfaction } from "@/buildhelpers/calculatebuildsatisfaction";
import { calculateStats } from "@/buildhelpers/calculatestats";
import { Build } from "@/types";

interface BuildSatisfactionComponentProps {
  build: Build;
}

const BuildSatisfactionComponent: React.FC<BuildSatisfactionComponentProps> = ({ build }) => {
  const stats = calculateStats({ build });
  const filteredStats = Object.entries(stats).filter((entry) => entry[1] > 0);
  const satisfactionResults = calculateBuildSatisfaction({ build });

  return (
    <div>
      <div>
        {filteredStats.map(([stat, value]) => (
          <div key={stat}>
            {stat}: {value}
          </div>
        ))}
      </div>
      <div>{satisfactionResults.satisfaction ? <Check /> : <X />}</div>
    </div>
  );
};

export default BuildSatisfactionComponent;
