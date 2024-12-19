import { Check, X } from "lucide-react";

import { calculateBuildSatisfaction } from "@/buildhelpers/calculatebuildsatisfaction";
import { Build } from "@/types";

interface BuildSatisfactionComponentProps {
  build: Build;
}

const BuildSatisfactionComponent: React.FC<BuildSatisfactionComponentProps> = ({ build }) => {
  const satisfactionResults = calculateBuildSatisfaction({ build });
  console.log(satisfactionResults);

  return <div>{satisfactionResults.satisfaction ? <Check /> : <X />}</div>;
};

export default BuildSatisfactionComponent;
