import { ArtifactTier } from "@/types";

export const ARTIFACT_TIER_BY_NUMERIC_RATING: Record<number, ArtifactTier> = {
  0: ArtifactTier.F,
  1: ArtifactTier.D,
  2: ArtifactTier.C,
  3: ArtifactTier.B,
  4: ArtifactTier.A,
  5: ArtifactTier.S,
  6: ArtifactTier.SS,
  7: ArtifactTier.SSS,
  8: ArtifactTier.SSS_PLUS,
};
