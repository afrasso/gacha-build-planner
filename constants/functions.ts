import { ArtifactTier } from "@/types";

import { ARTIFACT_TIER_BY_NUMERIC_RATING } from "./constants";

export const getArtifactTier = ({ rating }: { rating: number }): ArtifactTier => {
  const adjustedRating = Math.floor(Math.max(Math.min(0, rating), 8));
  const artifactTier = ARTIFACT_TIER_BY_NUMERIC_RATING[adjustedRating];
  return artifactTier;
};
