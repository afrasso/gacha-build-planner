import Image from "next/image";

import StarSelector from "@/components/ui/custom/StarSelector";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

import MetricChart from "../../ArtifactDetails/MetricChart";
import Header from "./Header";

interface PopulatedContentProps {
  artifact: ArtifactData;
  artifactTypeKey: string;
  characterId?: string;
  onUpdate?: (artifact: ArtifactData) => void;
  showInfoButton: boolean;
  showMetrics: boolean;
  size: "large" | "small";
}

const PopulatedContent: React.FC<PopulatedContentProps> = ({
  artifact,
  artifactTypeKey,
  characterId,
  onUpdate,
  showInfoButton,
  showMetrics,
  size,
}) => {
  const artifactImageHeight = size === "large" ? 120 : 64;
  const artifactImageWidth = size === "large" ? 120 : 64;
  const characterImageHeight = size === "large" ? 64 : 48;
  const characterImageWidth = size === "large" ? 64 : 48;
  const textSize1 = size === "large" ? "text-xl" : "text-sm";
  const textSize2 = size === "large" ? "text-base" : "text-xs";

  const { getArtifactSet, getCharacter } = useDataContext();

  const artifactSet = getArtifactSet(artifact.setId);
  const character = artifact?.characterId ? getCharacter(artifact?.characterId) : undefined;

  return (
    <>
      <Header
        artifact={artifact}
        artifactTypeKey={artifactTypeKey}
        onUpdate={onUpdate}
        showInfoButton={showInfoButton}
        showMetrics={showMetrics}
      />

      {/* Set Name & Level / Set Icon */}
      <div className="flex items-center mb-2">
        <div className="ml-2 flex-1">
          <h3 className={`font-semibold ${textSize1} leading-tight line-clamp-2`}>{artifactSet.name}</h3>
          <span className={`${textSize2} text-muted-foreground`}>Level {artifact.level}</span>
        </div>
        <Image
          alt={artifactSet.name}
          className="rounded-md"
          height={artifactImageHeight}
          src={artifactSet.iconUrls[artifact.typeKey]}
          width={artifactImageWidth}
        />
      </div>

      {/* Rarity */}
      <div className="flex justify-center items-center">
        <StarSelector max={5} value={artifact.rarity} />
      </div>

      {/* Main Stat */}
      <p className={`font-medium ${textSize1} text-center mb-2 rounded p-1`}>{artifact.mainStatKey}</p>

      {/* Sub Stats */}
      <div className="flex-grow">
        <div className="grid grid-cols-5 gap-x-1 gap-y-1 text-xs">
          <div className="col-span-4 space-y-1">
            {[...Array(4)].map((_, index) => (
              <div
                className={`p-0.5 text-left overflow-hidden rounded ${artifact.subStats[index] ? "" : "invisible"}`}
                key={artifact.subStats[index]?.key || `empty-${index}`}
              >
                <span className={`font-medium block truncate ${textSize2}`}>{artifact.subStats[index]?.key || ""}</span>
              </div>
            ))}
          </div>
          <div className="col-span-1 space-y-1">
            {[...Array(4)].map((_, index) => (
              <div
                className={`p-0.5 text-right rounded ${artifact.subStats[index] ? "bg-secondary" : "invisible"}`}
                key={artifact.subStats[index]?.key || `empty-value-${index}`}
              >
                <span className={textSize2}>{artifact.subStats[index]?.value || ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {showMetrics && artifact.metricsResults && (
        <div className="mt-2 cursor-default bg-background border p-1">
          <MetricChart characterId={characterId} metricsResults={artifact.metricsResults} />
        </div>
      )}

      {/* Character Icon */}
      {character && (
        <div className="absolute -top-4 -left-4 rounded-full overflow-hidden border-2 border-primary bg-secondary">
          <Image
            alt={character.name}
            className="object-cover"
            height={characterImageHeight}
            src={character.iconUrl}
            width={characterImageWidth}
          />
        </div>
      )}
    </>
  );
};

export default PopulatedContent;
