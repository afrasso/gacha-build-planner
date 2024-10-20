import path from "path";

import { ArtifactSet, Character, Weapon } from "../types";
import { __datadir } from "../utils/directoryutils";
import { loadYaml } from "../utils/yamlhelper";
import BuildManager from "./BuildManager";

export default function BuildManagerServerWrapper() {
  const characters: Character[] = loadYaml<Character[]>(path.join(__datadir, "characters.yaml"));
  const weapons: Weapon[] = loadYaml<Weapon[]>(path.join(__datadir, "weapons.yaml"));
  const artifactSets: ArtifactSet[] = loadYaml<ArtifactSet[]>(path.join(__datadir, "artifactSets.yaml"));

  return <BuildManager artifactSets={artifactSets} characters={characters} weapons={weapons} />;
}
