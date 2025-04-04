import { Info, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StarSelector from "@/components/ui/custom/StarSelector";
import { DialogTrigger } from "@/components/ui/dialog";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

import MetricChart from "../ArtifactDetails/MetricChart";

interface ArtifactCardProps {
  artifact?: ArtifactData;
  artifactTypeKey: string;
  characterId?: string;
  onEdit?: () => void;
  showInfoButton: boolean;
  showMetrics: boolean;
  size?: "large" | "small";
}

const ArtifactCard = forwardRef<HTMLDivElement, ArtifactCardProps>(
  (
    { artifact, artifactTypeKey, characterId, onEdit, showInfoButton = true, showMetrics = false, size = "small" },
    ref
  ) => {
    const artifactImageHeight = size === "large" ? 120 : 64;
    const artifactImageWidth = size === "large" ? 120 : 64;
    const characterImageHeight = size === "large" ? 64 : 48;
    const characterImageWidth = size === "large" ? 64 : 48;
    const headerMargin = size === "large" ? "mb-4" : "mb-0";
    const sizeClasses = size === "large" ? "w-96 h-120" : "w-48 h-92";
    const textSize1 = size === "large" ? "text-xl" : "text-sm";
    const textSize2 = size === "large" ? "text-base" : "text-xs";

    const { getArtifactSet, getCharacter, resolvePath } = useDataContext();

    const artifactSet = artifact?.setId ? getArtifactSet(artifact.setId) : undefined;
    const character = artifact?.characterId ? getCharacter(artifact?.characterId) : undefined;

    // TODO: Add lock icon if locked.
    return artifact && artifactSet ? (
      <Card className={`${sizeClasses} m-2`} ref={ref}>
        <CardContent className="relative p-2 flex flex-col h-full">
          <>
            <div className={`flex justify-between items-center ${headerMargin}`}>
              <div className="flex">
                <div className={`w-6 h-8 ${!onEdit && !showInfoButton && "invisible"}`} />
                <div className={`w-6 h-8 ${(!onEdit || !showInfoButton) && "invisible"}`} />
              </div>
              <p className={`${textSize2} text-muted-foreground mb-1 text-center`}>{artifactTypeKey}</p>
              <div className="flex">
                {onEdit ? (
                  <DialogTrigger asChild>
                    <Button
                      className="p-0 w-6 h-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.();
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                ) : (
                  <div className="p-0 w-6 h-8 flex-shrink-0 invisible"></div>
                )}
                {showInfoButton ? (
                  <Button asChild className="p-0 w-6 h-8 flex-shrink-0" size="sm" variant="ghost">
                    <Link href={resolvePath(`/artifacts/${artifact.id}`)}>
                      <Info size={16} />
                    </Link>
                  </Button>
                ) : (
                  <div className="p-0 w-6 h-8 flex-shrink-0 invisible"></div>
                )}
              </div>
            </div>
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
            <div className="flex justify-center items-center">
              <StarSelector max={5} value={artifact.rarity} />
            </div>
            <p className={`font-medium ${textSize1} text-center mb-2 rounded p-1`}>{artifact.mainStatKey}</p>
            <div className="flex-grow">
              <div className="grid grid-cols-5 gap-x-1 gap-y-1 text-xs">
                <div className="col-span-4 space-y-1">
                  {[...Array(4)].map((_, index) => (
                    <div
                      className={`p-0.5 text-left overflow-hidden rounded ${
                        artifact.subStats[index] ? "" : "invisible"
                      }`}
                      key={artifact.subStats[index]?.key || `empty-${index}`}
                    >
                      <span className={`font-medium block truncate ${textSize2}`}>
                        {artifact.subStats[index]?.key || ""}
                      </span>
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
            {showMetrics && artifact.metricsResults && (
              <div className="mt-2 cursor-default bg-background border p-1">
                <MetricChart characterId={characterId} metricsResults={artifact.metricsResults} />
              </div>
            )}
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
        </CardContent>
      </Card>
    ) : (
      <Card className={`${sizeClasses} cursor-pointer`} onClick={onEdit} ref={ref}>
        <CardContent className="p-2 flex flex-col h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
              <span className="text-2xl text-muted-foreground">+</span>
            </div>
            <p className="text-sm font-medium">{artifactTypeKey}</p>
            <p className="text-xs text-muted-foreground">Click to add</p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ArtifactCard.displayName = "ArtifactCard";

export default ArtifactCard;
