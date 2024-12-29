import React from "react";

import {
  AggregatedArtifactSatisfactionResults,
  ArtifactSatisfactionResultsByBuild,
} from "@/buildhelpers/calculatesatisfactionforartifacts";
// TODO: Move the ArtifactCard component on it's own since it's now used in multiple places.
import ArtifactCard from "@/components/BuildCard/EditableBuildContent/ArtifactCollection/ArtifactCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";

interface ArtifactSatisfactionComponentProps {
  artifactSatisfaction: AggregatedArtifactSatisfactionResults;
}

const SatisfactionDetails = ({ satisfactionDetails }: { satisfactionDetails: ArtifactSatisfactionResultsByBuild }) => {
  const { getCharacter } = useGenshinDataContext();
  return (
    <div>
      {Object.entries(satisfactionDetails)
        .filter(([buildId, result]) => result.satisfied > 0)
        .sort((a, b) => b[1].satisfied - a[1].satisfied)
        .slice(0, 5)
        .map(([buildId, result]) => (
          <p key={buildId}>{`${getCharacter(buildId).name}: ${Math.round(
            (result.satisfied / result.total) * 100
          )}%`}</p>
        ))}
    </div>
  );
};

const ArtifactSatisfactionComponent: React.FC<ArtifactSatisfactionComponentProps> = ({ artifactSatisfaction }) => {
  const { artifact, maxSatisfaction, satisfactionResults } = artifactSatisfaction;
  const satisfactionPercentage = ((maxSatisfaction || 0) * 100).toFixed(2);

  if (artifact.id === "d742f9d5-3bf3-4a32-851a-b268bc4b816c") {
    console.log(artifact);
    console.log(maxSatisfaction);
    console.log(satisfactionResults);
  }

  return (
    <div className="w-full max-w-xs bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
      <div className="p-2 flex justify-center">
        <ArtifactCard artifact={artifact} artifactType={artifact.type} />
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
                  {maxSatisfaction ? `${satisfactionPercentage}%` : "N/A"}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          {satisfactionResults && (
            <TooltipContent className="bg-gray-800 text-white p-2 rounded shadow-lg" side="bottom">
              <div className="text-xs">
                <SatisfactionDetails satisfactionDetails={satisfactionResults} />
                {/* <p className="font-semibold mb-1">{`Build Satisfactions: ${JSON.stringify(satisfactionResults)}`}</p> */}
                {/* {Object.entries(satisfaction.builds).map(([buildName, buildSatisfaction]) => (
                  <p key={buildName}>
                    {buildName}: {(buildSatisfaction * 100).toFixed(2)}%
                  </p>
                ))} */}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ArtifactSatisfactionComponent;
