import Image from "next/image";
import { forwardRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactType } from "@/types";

interface ArtifactCardProps {
  artifact?: Artifact;
  artifactType: ArtifactType;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const ArtifactCard = forwardRef<HTMLDivElement, ArtifactCardProps>(({ artifact, artifactType, onClick }, ref) => {
  const { getArtifactSet } = useGenshinDataContext();
  const artifactSet = artifact?.setId ? getArtifactSet(artifact.setId) : undefined;

  return (
    <Card className="w-48 h-56 cursor-pointer hover:bg-accent" onClick={onClick} ref={ref}>
      <CardContent className="p-2 flex flex-col h-full">
        {artifact && artifactSet ? (
          <>
            <p className="text-xs text-muted-foreground mb-1 text-center">
              Type: {artifactType}
              {/* <br></br>
              Level: {artifact.level}
              <br></br>
              ID: {artifact.id} */}
            </p>
            <div className="flex items-start mb-2">
              <Image alt={artifactSet.name} className="rounded-md" height={48} src={artifactSet.iconUrl} width={48} />
              <div className="ml-2 flex-1">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">{artifactSet.name}</h3>
              </div>
            </div>
            <p className="font-medium text-sm text-center mb-2 rounded p-1">{artifact.mainStat}</p>
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
                      <span className="font-medium block truncate">{artifact.subStats[index]?.stat || ""}</span>
                    </div>
                  ))}
                </div>
                <div className="col-span-1 space-y-1">
                  {[...Array(4)].map((_, index) => (
                    <div
                      className={`p-0.5 text-right rounded ${artifact.subStats[index] ? "bg-secondary" : "invisible"}`}
                      key={artifact.subStats[index]?.stat || `empty-value-${index}`}
                    >
                      <span>{artifact.subStats[index]?.value != null ? artifact.subStats[index]?.value : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
});

ArtifactCard.displayName = "ArtifactCard";

export default ArtifactCard;
