import { useRouter } from "next/navigation";
import React from "react";

import {
  AggregatedArtifactSatisfactionResults,
  ArtifactSatisfactionResultsByBuild,
} from "@/calculators/calculatesatisfactionforartifacts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import ArtifactCard from "@/components/artifacts/ArtifactCard";

interface ArtifactSatisfactionComponentProps {
  artifactSatisfaction: AggregatedArtifactSatisfactionResults;
  showMetrics: boolean;
}

const SatisfactionDetails = ({ satisfactionDetails }: { satisfactionDetails: ArtifactSatisfactionResultsByBuild }) => {
  const { getCharacter } = useGenshinDataContext();
  return (
    <div>
      {Object.entries(satisfactionDetails)
        .filter(([, result]) => result.satisfied > 0)
        .sort(([, resultA], [, resultB]) => resultB.satisfied - resultA.satisfied)
        .slice(0, 5)
        .map(([buildId, result]) => (
          <p key={buildId}>{`${getCharacter(buildId).name}: ${Math.round(
            (result.satisfied / result.total) * 100
          )}%`}</p>
        ))}
    </div>
  );
};

const ArtifactSatisfactionComponent: React.FC<ArtifactSatisfactionComponentProps> = ({
  artifactSatisfaction,
  showMetrics,
}) => {
  const router = useRouter();
  const { artifact, maxSatisfaction, satisfactionResults } = artifactSatisfaction;
  const satisfactionPercentage = ((maxSatisfaction || 0) * 100).toFixed(2);

  const routeToArtifact = () => {
    router.push(`/genshin/artifacts/${artifact.id}`);
  };

  return (
    <div className="w-full max-w-xs bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
      <div className="p-2 flex justify-center">
        <ArtifactCard
          artifact={artifact}
          artifactType={artifact.type}
          showMetrics={showMetrics}
          onClick={routeToArtifact}
        />
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
