import { ArtifactSet, Character, Weapon } from "@/types";
import { loadYaml } from "@/utils/yamlLoader";

import BuildManager from "./BuildManager";

export default function BuildManagerServerWrapper() {
  const characters: Character[] = loadYaml<Character[]>("characters.yaml");
  const weapons: Weapon[] = loadYaml<Weapon[]>("weapons.yaml");
  const artifactSets: ArtifactSet[] = loadYaml<ArtifactSet[]>("artifactSets.yaml");

  return <BuildManager artifactSets={artifactSets} characters={characters} weapons={weapons} />;
}
