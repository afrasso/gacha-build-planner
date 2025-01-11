import { ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP } from "@/constants";
import { Artifact, ArtifactTier, Build } from "@/types";

import { calculateArtifactNumericRating } from "./calculateartifactnumericrating";
import { rollArtifact } from "./simulations/rollartifact";

export const calculateArtifactTierRating = ({
  artifact,
  build,
  iterations,
}: {
  artifact: Artifact;
  build: Build;
  iterations: number;
}): ArtifactTier => {
  let totalRating = 0;
  for (let i = 0; i < iterations; i++) {
    totalRating += calculateArtifactNumericRating({ artifact: rollArtifact(artifact), build });
  }
  const averageRating = totalRating / iterations;
  return ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP[Math.floor(averageRating)];
};
