import { IDataContext } from "@/contexts/DataContext";
import { ArtifactData, BuildData, IWeapon } from "@/types";

import { artifactMapper } from "./artifactmapper";
import { createNewBuild } from "./createnewbuild";
import { artifactSetLookup, buildLookup, characterLookup, weaponLookup } from "./lookups";
import { Artifact as GOODArtifact, Character as GOODCharacter, Weapon as GOODWeapon } from "./types";

export const updateBuildsWithGameData = ({
  artifacts,
  builds,
  dataContext,
  goodArtifacts,
  goodCharacters,
  goodWeapons,
}: {
  artifacts: ArtifactData[];
  builds: BuildData[];
  dataContext: IDataContext;
  goodArtifacts: GOODArtifact[];
  goodCharacters: GOODCharacter[];
  goodWeapons: GOODWeapon[];
}): { artifacts: ArtifactData[]; builds: BuildData[] } => {
  const { lookupArtifactSet } = artifactSetLookup({ dataContext });
  const { lookupCharacter } = characterLookup({ dataContext });
  const { lookupWeapon } = weaponLookup({ dataContext });

  const updatedBuilds = builds.map((build) => structuredClone(build));
  const updatedArtifacts: ArtifactData[] = [];
  const { addBuild, lookupBuild } = buildLookup({ builds: updatedBuilds, dataContext });

  const mapGOODWeaponToWeapon = ({ goodWeapon }: { goodWeapon: GOODWeapon }): IWeapon => {
    const weapon = lookupWeapon(goodWeapon.key);
    if (!weapon) {
      throw new Error(`Could not find the weapon ${goodWeapon.key}.`);
    }
    return weapon;
  };

  // Create any builds that don't exist.
  console.log("Updating builds...");
  for (const goodCharacter of goodCharacters) {
    if (!lookupBuild({ goodCharacterKey: goodCharacter.key })) {
      const build = createNewBuild({ goodCharacter, lookupCharacter });
      updatedBuilds.push(build);
      addBuild(build);
    }
  }

  // Assign weapons to builds.
  console.log("Updating weapons...");
  for (const goodWeapon of goodWeapons.filter((goodWeapon) => goodWeapon.location && goodWeapon.location !== "")) {
    const build = lookupBuild({ goodCharacterKey: goodWeapon.location, throwErrorOnNotFound: true });
    const weapon = mapGOODWeaponToWeapon({ goodWeapon });
    build.weaponId = weapon.id;
  }

  // Get artifacts and assign to builds.
  console.log("Updating artifacts...");
  const { mapGOODArtifactToArtifact } = artifactMapper({ artifacts, lookupArtifactSet, lookupCharacter });
  for (const goodArtifact of goodArtifacts) {
    const artifact = mapGOODArtifactToArtifact({ goodArtifact });
    if (goodArtifact.location && goodArtifact.location !== "") {
      const build = lookupBuild({ goodCharacterKey: goodArtifact.location, throwErrorOnNotFound: true });
      build.artifacts[artifact.typeKey] = artifact;
    }
    updatedArtifacts.push(artifact);
  }

  const sortedBuilds = updatedBuilds.sort((a, b) => a.sortOrder - b.sortOrder);
  for (let i = 0; i < sortedBuilds.length; i++) {
    sortedBuilds[i].sortOrder = i;
  }

  return { artifacts: updatedArtifacts, builds: updatedBuilds };
};
