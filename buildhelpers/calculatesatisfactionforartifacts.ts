import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, ArtifactType, Build } from "@/types";

import { calculateBuildSatisfaction } from "./calculatebuildsatisfaction";
import { rollArtifact } from "./rollartifact";

interface ArtifactSatisfactionResult {
  satisfied: number;
  total: number;
}

export type ArtifactSatisfactionResultsByBuild = Record<string, ArtifactSatisfactionResult>;

export interface AggregatedArtifactSatisfactionResults {
  artifact: Artifact;
  maxSatisfaction?: number;
  satisfactionResults?: ArtifactSatisfactionResultsByBuild;
}

export const calculateSatisfactionForArtifacts = ({
  artifacts,
  builds,
  genshinDataContext,
  numIterations,
  progressCallback,
}: {
  artifacts: Artifact[];
  builds: Build[];
  genshinDataContext: GenshinDataContext;
  numIterations: number;
  progressCallback: (curr: number, total: number) => void;
}): AggregatedArtifactSatisfactionResults[] => {
  const hasCompleteArtifacts = (build: Build): boolean => {
    return Object.values(ArtifactType).every((type) => build.artifacts[type]);
  };

  const hasMainStatCriteria = (build: Build): boolean => {
    return !!(
      build.desiredArtifactMainStats.SANDS ||
      build.desiredArtifactMainStats.GOBLET ||
      build.desiredArtifactMainStats.CIRCLET
    );
  };

  const hasSetBonusCriteria = (build: Build): boolean => {
    return build.desiredArtifactSetBonuses.length > 0;
  };

  const hasStatCriteria = (build: Build): boolean => {
    return build.desiredStats.length > 0;
  };

  const hasValidCriteria = (build: Build) => {
    return hasMainStatCriteria(build) || hasSetBonusCriteria(build) || hasStatCriteria(build);
  };

  const calculateSatisfactionForArtifactWithIncompleteBuild = ({
    artifact,
    build,
  }: {
    artifact: Artifact;
    build: Build;
  }): ArtifactSatisfactionResult => {
    if (build.desiredArtifactSetBonuses.length === 0 || !build.desiredArtifactMainStats[artifact.type]) {
      return {
        satisfied: 0,
        total: 0,
      };
    }

    const satisfied =
      build.desiredArtifactSetBonuses.length > 0 &&
      build.desiredArtifactSetBonuses.map((bonus) => bonus.setId).includes(artifact.setId) &&
      build.desiredArtifactMainStats[artifact.type] === artifact.mainStat
        ? 1
        : 0;

    return {
      satisfied,
      total: 1,
    };
  };

  const calculateSatisfactionForArtifact = ({
    artifact,
    build,
  }: {
    artifact: Artifact;
    build: Build;
  }): ArtifactSatisfactionResult => {
    if (!hasValidCriteria) {
      return {
        satisfied: 0,
        total: 0,
      };
    }

    if (!hasCompleteArtifacts(build)) {
      return calculateSatisfactionForArtifactWithIncompleteBuild({ artifact, build });
    }

    const modifiedArtifacts = { ...build.artifacts, [artifact.type]: artifact };
    const modifiedBuild = { ...build, artifacts: modifiedArtifacts };
    const { overallSatisfaction } = calculateBuildSatisfaction({
      build: modifiedBuild,
      genshinDataContext,
      relaxSetCriteria: false,
    });
    return {
      satisfied: overallSatisfaction ? 1 : 0,
      total: 1,
    };
  };

  const validBuilds = builds.filter((build) => hasValidCriteria(build));
  const totalCalculations = numIterations * artifacts.length * validBuilds.length;
  let currentCalculations = 0;

  const calculateAggregatedSatisfactionForArtifact = (artifact: Artifact): AggregatedArtifactSatisfactionResults => {
    const satisfactionResults = {} as ArtifactSatisfactionResultsByBuild;
    for (let i = 0; i < numIterations; i++) {
      const rolledArtifact = rollArtifact(artifact);
      for (const build of validBuilds) {
        const characterId = build.characterId;
        if (!satisfactionResults[characterId]) {
          satisfactionResults[characterId] = { satisfied: 0, total: 0 };
        }
        const result = calculateSatisfactionForArtifact({ artifact: rolledArtifact, build });
        satisfactionResults[build.characterId].satisfied += result.satisfied;
        satisfactionResults[build.characterId].total += result.total;
        currentCalculations++;
        if (currentCalculations % Math.round(totalCalculations / 100) == 0) {
          progressCallback(currentCalculations, totalCalculations);
        }
      }
    }
    let maxSatisfaction = 0;
    for (const characterId in satisfactionResults) {
      const satisfactionRating = satisfactionResults[characterId].satisfied / satisfactionResults[characterId].total;
      if (maxSatisfaction < satisfactionRating) {
        maxSatisfaction = satisfactionRating;
      }
    }
    return {
      artifact,
      maxSatisfaction,
      satisfactionResults,
    };
  };

  return artifacts.map(calculateAggregatedSatisfactionForArtifact);
};
