import { calculateBuildSatisfaction } from "@/buildhelpers/calculatebuildsatisfaction";
import { rollArtifact } from "@/buildhelpers/rollartifact";
import { Artifact, Build } from "@/types";

interface ArtifactSatisfactionComponentProps {
  artifact: Artifact;
  builds: Build[];
}

const ArtifactSatisfactionComponent: React.FC<ArtifactSatisfactionComponentProps> = ({ artifact, builds }) => {
  const calculateSatisfactions = () => {
    console.log(artifact);

    const results = {} as Record<string, { satisfied: number; total: number }>;

    for (let i = 0; i < 10; i++) {
      const rolledArtifact = rollArtifact(artifact);
      for (const build of builds) {
        if (!results[build.character.id]) {
          results[build.character.id] = {
            satisfied: 0,
            total: 0,
          };
        }
        results[build.character.id].total += 1;
        const artifacts = { ...build.artifacts, [rolledArtifact.type]: rolledArtifact };
        console.log(build.artifacts);
        console.log(artifacts);
        const modifiedBuild = { ...build, artifacts };
        const { satisfaction } = calculateBuildSatisfaction({ build: modifiedBuild });
        if (satisfaction) {
          results[build.character.id].satisfied += 1;
        }
      }
    }
    console.log(results);
    return results;
  };

  const satisfactions = calculateSatisfactions();
  let maxSatisfaction = 0;
  for (const characterId in satisfactions) {
    const satisfactionRating = satisfactions[characterId].satisfied / satisfactions[characterId].total;
    if (maxSatisfaction < satisfactionRating) {
      maxSatisfaction = satisfactionRating;
    }
  }

  return maxSatisfaction;
};

export default ArtifactSatisfactionComponent;
