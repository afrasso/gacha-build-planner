import path from "path";

import { GenshinDataProvider } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactSet, Character, Weapon } from "@/types";
import { __datadir } from "@/utils/directoryutils";
import { loadYaml } from "@/utils/yamlhelper";

const characters: Character[] = loadYaml<Character[]>(path.join(__datadir, "genshin", "characters.yaml"));
const weapons: Weapon[] = loadYaml<Weapon[]>(path.join(__datadir, "genshin", "weapons.yaml"));
const artifactSets: ArtifactSet[] = loadYaml<ArtifactSet[]>(path.join(__datadir, "genshin", "artifactsets.yaml"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GenshinDataProvider artifactSets={artifactSets} characters={characters} weapons={weapons}>
      {children}
    </GenshinDataProvider>
  );
}
