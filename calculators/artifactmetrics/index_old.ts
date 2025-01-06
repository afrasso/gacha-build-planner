import { Artifact, ArtifactTier, Build, SatisfactionCalculationType } from "@/types";
import { getEnumValues } from "@/utils/getenumvalues";

export const calculateBuildSatisfactionForArtifact = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  artifact,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculationType,
}: {
  artifact: Artifact;
  build: Build;
  calculationType: SatisfactionCalculationType;
}): number => {
  // Implement the satisfaction rating calculation logic here
  // This is a placeholder implementation
  return Math.random() * 100;
};

export const calculateTierRatingForArtifact = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  artifact,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build,
}: {
  artifact: Artifact;
  build: Build;
}): ArtifactTier => {
  // Implement the tier rating calculation logic here
  // This is a placeholder implementation
  const tiers = Object.values(ArtifactTier) as ArtifactTier[];
  return tiers[Math.floor(Math.random() * tiers.length)];
};

// export const getMaxTierRatingForArtifact = ({ artifact }: { artifact: Artifact }): string | undefined => {
//   if (!artifact.metrics) {
//     return;
//   }

//   const lookup = {
//     [ArtifactTier.A]: 4,
//     [ArtifactTier.B]: 3,
//     [ArtifactTier.C]: 2,
//     [ArtifactTier.D]: 1,
//     [ArtifactTier.F]: 0,
//     [ArtifactTier.S]: 5,
//     [ArtifactTier.SS]: 6,
//     [ArtifactTier.SSS]: 7,
//     [ArtifactTier.SSS_PLUS]: 8,
//   };

//   const reverseLookup = [
//     ArtifactTier.F,
//     ArtifactTier.D,
//     ArtifactTier.C,
//     ArtifactTier.B,
//     ArtifactTier.A,
//     ArtifactTier.S,
//     ArtifactTier.SS,
//     ArtifactTier.SSS,
//     ArtifactTier.SSS_PLUS,
//   ];

//   return reverseLookup[
//     Math.max(
//       ...Object.values(artifact.metrics.rollTierRatingCalculations).map((calculation) => lookup[calculation.tierRating])
//     )
//   ];
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const calculatePlusMinusForArtifact = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  artifact,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build,
}: {
  artifact: Artifact;
  build: Build;
}): number => {
  // Implement the improvement rating calculation logic here
  // This is a placeholder implementation
  return Math.floor(Math.random() * 5);
};

// export const getMaxPlusMinusForArtifact = ({ artifact }: { artifact: Artifact }): number | undefined => {
//   if (!artifact.metrics) {
//     return;
//   }
//   return Math.max(
//     ...Object.values(artifact.metrics.rollPlusMinusCalculations).map((calculation) => calculation.plusMinus)
//   );
// };

// export const updateAllCalculationsForArtifact = ({ artifact, builds }: { artifact: Artifact; builds: Build[] }) => {
//   if (!artifact.metrics) {
//     artifact.metrics = {
//       rollPlusMinusCalculations: {},
//       rollTierRatingCalculations: {},
//       satisfactionCalculations: {
//         [SatisfactionCalculationType.CURRENT_STATS_CURRENT_ARTIFACTS]: {},
//         [SatisfactionCalculationType.CURRENT_STATS_RANDOM_ARTIFACTS]: {},
//         [SatisfactionCalculationType.DESIRED_STATS_CURRENT_ARTIFACTS]: {},
//         [SatisfactionCalculationType.DESIRED_STATS_RANDOM_ARTIFACTS]: {},
//       },
//     };
//   }

//   for (const build of builds) {
//     for (const calculationType of getEnumValues(SatisfactionCalculationType)) {
//       artifact.metrics.satisfactionCalculations[calculationType][build.characterId] =
//         calculateBuildSatisfactionForArtifact({
//           artifact,
//           build,
//           calculationType,
//         });
//       artifact.metrics.rollTierRatingCalculations[build.characterId] = calculateTierRatingForArtifact({
//         artifact,
//         build,
//       });
//       artifact.metrics.rollPlusMinusCalculations[build.characterId] = calculatePlusMinusForArtifact({
//         artifact,
//         build,
//       });
//     }
//   }
// };
