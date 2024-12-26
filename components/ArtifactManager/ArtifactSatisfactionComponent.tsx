import React from "react";
import ArtifactCard from "../BuildCard/EditableBuildContent/ArtifactCollection/ArtifactCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArtifactSatisfaction } from "./types";

interface ArtifactSatisfactionComponentProps {
  artifactSatisfaction: ArtifactSatisfaction;
}

const ArtifactSatisfactionComponent: React.FC<ArtifactSatisfactionComponentProps> = ({ artifactSatisfaction }) => {
  const { artifact, satisfaction } = artifactSatisfaction;
  const overallSatisfaction = satisfaction?.overall ?? 0;
  const satisfactionPercentage = (overallSatisfaction * 100).toFixed(2);

  return (
    <div className="w-full max-w-xs bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
      <div className="p-2 flex justify-center">
        <ArtifactCard artifactType={artifact.type} artifact={artifact} />
      </div>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-2 bg-gray-700 bg-opacity-75 w-full">
              <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${satisfactionPercentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {satisfactionPercentage}%
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-800 text-white p-2 rounded shadow-lg">
            {satisfaction && (
              <div className="text-xs">
                <p className="font-semibold mb-1">Build Satisfactions: asdjasdjasdajd</p>
                {/* {Object.entries(satisfaction.builds).map(([buildName, buildSatisfaction]) => (
                  <p key={buildName}>
                    {buildName}: {(buildSatisfaction * 100).toFixed(2)}%
                  </p>
                ))} */}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ArtifactSatisfactionComponent;
