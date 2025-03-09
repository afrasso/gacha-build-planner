import { IArtifact } from "@/types";

import { ArtifactMainStatSatisfactionDetails, SatisfactionResult } from "./types";

export const calculateArtifactMainStatsSatisfaction = ({
  artifacts,
  desiredArtifactMainStats,
}: {
  artifacts: Record<string, IArtifact>;
  desiredArtifactMainStats: Record<string, string[]>;
}): SatisfactionResult<ArtifactMainStatSatisfactionDetails> => {
  const details = (Object.entries(desiredArtifactMainStats) as [string, string[]][]).map(
    ([artifactTypeKey, mainStatKeys]) => {
      const currentMainStatKey = artifacts[artifactTypeKey]?.mainStatKey;
      return {
        artifactTypeKey,
        currentMainStatKey,
        desiredMainStatKeys: mainStatKeys,
        satisfaction: !!currentMainStatKey && mainStatKeys.includes(currentMainStatKey),
      };
    }
  );

  return {
    details,
    satisfaction: details.every((x) => x.satisfaction),
  };
};
