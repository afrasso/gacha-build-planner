import path from "path";

import { DataProvider } from "@/contexts/DataContext/genshin/DataProvider";
import { StorageProvider } from "@/contexts/StorageContext";
import { ArtifactSet } from "@/types";
import { CharacterData } from "@/types/genshin/character";
import { WeaponData } from "@/types/genshin/weapon";
import { Misc } from "@/types/misc";
import { __datadir } from "@/utils/directoryutils";
import { loadYaml } from "@/utils/yamlhelper";

const artifactSets: ArtifactSet[] = loadYaml<ArtifactSet[]>(path.join(__datadir, "genshin", "artifactsets.yaml"));
const characterDatas = loadYaml<CharacterData[]>(path.join(__datadir, "genshin", "characters.yaml"));
const misc = loadYaml<Misc>(path.join(__datadir, "genshin", "misc.yaml"));
const weaponDatas = loadYaml<WeaponData[]>(path.join(__datadir, "genshin", "weapons.yaml"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StorageProvider game="genshin">
      <DataProvider artifactSets={artifactSets} characterDatas={characterDatas} misc={misc} weaponDatas={weaponDatas}>
        {children}
      </DataProvider>
    </StorageProvider>
  );
}
