"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArtifactData } from "@/types";

import PlaceholderContent from "./PlaceholderContent";
import PopulatedContent from "./PopulatedContent";

interface ArtifactCardProps {
  artifact?: ArtifactData;
  artifactTypeKey: string;
  onUpdate?: (artifact: ArtifactData) => void;
  showInfoButton?: boolean;
  showMetrics?: boolean;
  size?: "large" | "small";
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({
  artifact,
  artifactTypeKey,
  onUpdate,
  showInfoButton = false,
  showMetrics = false,
  size = "small",
}) => {
  const sizeClasses = size === "large" ? "w-96 h-120" : "w-48 h-92";

  if (!artifact && !onUpdate) {
    throw new Error("At least one of the props 'artifact' or 'onUpdate' must be provided and truthy.");
  }

  // TODO: Add lock icon if locked.
  return (
    <Card className={`${sizeClasses} m-2`}>
      <CardContent className="relative p-2 flex flex-col h-full">
        {artifact ? (
          <PopulatedContent
            artifact={artifact}
            artifactTypeKey={artifactTypeKey}
            onUpdate={onUpdate}
            showInfoButton={showInfoButton}
            showMetrics={showMetrics}
            size={size}
          />
        ) : (
          <PlaceholderContent artifactTypeKey={artifactTypeKey} onUpdate={onUpdate!} />
        )}
      </CardContent>
    </Card>
  );
};

export default ArtifactCard;
