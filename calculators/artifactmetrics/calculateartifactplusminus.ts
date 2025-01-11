import { Artifact, Build } from "@/types";

import { calculateArtifactNumericRating } from "./calculateartifactnumericrating";
import { rollArtifact } from "./simulations/rollartifact";

export const calculateArtifactPlusMinus = ({
  artifact,
  build,
  iterations,
}: {
  artifact: Artifact;
  build: Build;
  iterations: number;
}): number => {
  let currentArtifactTotalRating = 0;
  let newArtifactTotalRating = 0;
  if (!build.artifacts[artifact.type]) {
    return 0;
  }
  for (let i = 0; i < iterations; i++) {
    const currentArtifact = rollArtifact(build.artifacts[artifact.type]!);
    currentArtifactTotalRating += calculateArtifactNumericRating({ artifact: currentArtifact, build });

    const newArtifact = rollArtifact(artifact);
    newArtifactTotalRating += calculateArtifactNumericRating({ artifact: newArtifact, build });
  }

  return (newArtifactTotalRating - currentArtifactTotalRating) / iterations;
};
