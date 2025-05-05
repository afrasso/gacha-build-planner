export * from "./types";

import { IDataContext } from "@/contexts/DataContext";
import { Artifact, ArtifactData, BuildData, Plan } from "@/types";

import { calculateArtifactHash } from "./calculateartifacthash";

export const updatePlan = ({
  data,
  dataContext,
  plan,
}: {
  data: unknown;
  dataContext: IDataContext;
  plan: Plan;
}): Plan => {
  const { constructBuild, validateImport } = dataContext;
  const {
    artifacts: importedArtifacts,
    builds: importedBuilds,
    weaponInstances: importedWeaponInstances,
  } = validateImport({ data, dataContext });

  const artifactLookup = plan.artifacts.reduce<Record<string, ArtifactData>>((acc, artifact) => {
    const hash = calculateArtifactHash(artifact);
    acc[hash] = artifact;
    return acc;
  }, {});
  const buildLookup = plan.builds.reduce<Record<string, BuildData>>((acc, build) => {
    acc[build.characterId] = build;
    return acc;
  }, {});
  const updatedArtifacts: ArtifactData[] = [];

  // Create any builds that don't exist.
  console.log("Updating builds...");
  for (const build of importedBuilds) {
    if (!buildLookup[build.characterId]) {
      const newBuild = constructBuild({ characterId: build.characterId }).toBuildData();
      buildLookup[newBuild.characterId] = newBuild;
      plan.builds.push(newBuild);
    }
  }

  // Assign weapons to builds.
  for (const weaponInstance of importedWeaponInstances) {
    if (weaponInstance.characterId) {
      const build = buildLookup[weaponInstance.characterId];
      if (!build) {
        console.warn(`Found weapon for missing build associated character ID ${weaponInstance.characterId}`);
      } else {
        build.weaponId = weaponInstance.id;
      }
    }
  }

  // Get artifacts and assign to builds.
  console.log("Updating artifacts...");
  for (const artifact of importedArtifacts) {
    const hash = calculateArtifactHash(artifact);
    const existingArtifact = artifactLookup[hash];
    // If the artifact already exists, we don't want to wipe out existing metrics since those can be expensive to
    // calculate, so prefer to use the existing artifact if it matches.
    // TODO: Is this really true? Does the artifact matter at all? Or just the build? Since we can't use classes
    // everywhere in the UI layer anyway, why even have the class type getters and setters that auto-update the last
    // updated date? Is that worth it? Maybe we should simplify and dump all this, at least on an import.
    if (existingArtifact) {
      if (existingArtifact.characterId !== artifact.characterId) {
        existingArtifact.characterId = artifact.characterId;
        if (existingArtifact.characterId) {
          const build = buildLookup[existingArtifact.characterId];
          build.lastUpdatedDate = new Date().toISOString();
        }
      }
      existingArtifact.isLocked = artifact.isLocked;
      existingArtifact.lastUpdatedDate = new Date().toISOString();
      updatedArtifacts.push(existingArtifact);
    } else {
      const newArtifact = new Artifact(artifact).toArtifactData();
      if (newArtifact.characterId) {
        const build = buildLookup[newArtifact.characterId];
        if (!build) {
          // There are some edge cases where a build might not exist in the import separately, but does exist and has
          // artifacts assigned to it (for example, with the two March 7ths in HSR). If that happens, just create the build.
          const newBuild = constructBuild({ characterId: newArtifact.characterId }).toBuildData();
          newBuild.artifacts[newArtifact.typeKey] = newArtifact;
          buildLookup[newBuild.characterId] = newBuild;
          plan.builds.push(newBuild);
        } else {
          build.artifacts[newArtifact.typeKey] = newArtifact;
        }
      }
      updatedArtifacts.push(newArtifact);
    }
  }

  plan.artifacts = updatedArtifacts;

  return plan;
};
