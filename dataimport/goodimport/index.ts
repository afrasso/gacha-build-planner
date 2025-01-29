import { GenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Artifact, Build, Weapon } from "@/types";

import { Artifact as GOODArtifact, Character as GOODCharacter, Weapon as GOODWeapon } from "./types";
import { artifactMapper } from "./artifactmapper";
import { createNewBuild } from "./createnewbuild";
import { artifactSetLookup, buildLookup, characterLookup, weaponLookup } from "./lookups";

export const updateBuildsWithGameData = ({
  artifacts,
  builds,
  genshinDataContext,
  goodArtifacts,
  goodCharacters,
  goodWeapons,
}: {
  artifacts: Artifact[];
  builds: Build[];
  genshinDataContext: GenshinDataContext;
  goodArtifacts: GOODArtifact[];
  goodCharacters: GOODCharacter[];
  goodWeapons: GOODWeapon[];
}): { artifacts: Artifact[]; builds: Build[] } => {
  const { lookupArtifactSet } = artifactSetLookup({ genshinDataContext });
  const { addBuild, lookupBuild } = buildLookup({ builds, genshinDataContext });
  const { lookupCharacter } = characterLookup({ genshinDataContext });
  const { lookupWeapon } = weaponLookup({ genshinDataContext });

  const mapGOODWeaponToWeapon = ({ goodWeapon }: { goodWeapon: GOODWeapon }): Weapon => {
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
      addBuild(createNewBuild({ lookupCharacter, goodCharacter }));
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
  const updatedArtifacts: Artifact[] = [];
  for (const goodArtifact of goodArtifacts) {
    const artifact = mapGOODArtifactToArtifact({ goodArtifact });
    if (goodArtifact.location && goodArtifact.location !== "") {
      const build = lookupBuild({ goodCharacterKey: goodArtifact.location, throwErrorOnNotFound: true });
      build.artifacts[artifact.type] = artifact;
    }
    updatedArtifacts.push(artifact);
  }

  return { artifacts: updatedArtifacts, builds };
};
