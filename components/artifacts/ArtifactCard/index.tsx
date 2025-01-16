import Image from "next/image";
import { forwardRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactType } from "@/types";
import MetricChart from "../ArtifactDetails/MetricChart";

interface ArtifactCardProps {
  artifact?: Artifact;
  artifactType: ArtifactType;
  onClick?: () => void;
  showMetrics: boolean;
  size?: "large" | "small";
}

const ArtifactCard = forwardRef<HTMLDivElement, ArtifactCardProps>(
  ({ artifact, artifactType, onClick, showMetrics = false, size = "small" }, ref) => {
    const sizeClasses = size === "large" ? "w-96 h-120" : "w-48 h-80";
    const imageHeight = size === "large" ? 120 : 64;
    const imageWidth = size === "large" ? 120 : 64;
    const textSize1 = size === "large" ? "text-xl" : "text-sm";
    const textSize2 = size === "large" ? "text-base" : "text-xs";
    const { getArtifactSet } = useGenshinDataContext();
    const artifactSet = artifact?.setId ? getArtifactSet(artifact.setId) : undefined;

    return (
      <Card className={`${sizeClasses} cursor-pointer hover:bg-accent`} onClick={onClick} ref={ref}>
        <CardContent className="p-2 flex flex-col h-full">
          {artifact && artifactSet ? (
            <>
              <p className="text-xs text-muted-foreground mb-1 text-center">{artifactType}</p>
              <div className="flex items-start mb-2">
                <Image
                  alt={artifactSet.name}
                  className="rounded-md"
                  height={imageHeight}
                  src={artifactSet.iconUrl}
                  width={imageWidth}
                />
                <div className="ml-2 flex-1">
                  <h3 className={`font-semibold ${textSize1} leading-tight line-clamp-2`}>{artifactSet.name}</h3>
                  <span className="text-sm text-muted-foreground">Level {artifact.level}</span>
                </div>
              </div>
              <p className={`font-medium ${textSize1} text-center mb-2 rounded p-1`}>{artifact.mainStat}</p>
              <div className="flex-grow">
                <div className="grid grid-cols-5 gap-x-1 gap-y-1 text-xs">
                  <div className="col-span-4 space-y-1">
                    {[...Array(4)].map((_, index) => (
                      <div
                        className={`p-0.5 text-left overflow-hidden rounded ${
                          artifact.subStats[index] ? "" : "invisible"
                        }`}
                        key={artifact.subStats[index]?.stat || `empty-${index}`}
                      >
                        <span className={`font-medium block truncate ${textSize2}`}>
                          {artifact.subStats[index]?.stat || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-1 space-y-1">
                    {[...Array(4)].map((_, index) => (
                      <div
                        className={`p-0.5 text-right rounded ${
                          artifact.subStats[index] ? "bg-secondary" : "invisible"
                        }`}
                        key={artifact.subStats[index]?.stat || `empty-value-${index}`}
                      >
                        <span className={textSize2}>{artifact.subStats[index]?.value || ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {showMetrics && artifact.metricResults && (
                <div className="mt-2 cursor-default bg-background border p-1">
                  <MetricChart metricResults={artifact.metricResults} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">+</span>
              </div>
              <p className="text-sm font-medium">{artifactType}</p>
              <p className="text-xs text-muted-foreground">Click to add</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ArtifactCard.displayName = "ArtifactCard";

export default ArtifactCard;
