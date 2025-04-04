import path from "path";

import { DataProvider } from "@/contexts/DataContext/starrail/DataProvider";
import { StorageProvider } from "@/contexts/StorageContext";
import { ArtifactSet } from "@/types";
import { Misc } from "@/types/misc";
import { CharacterData } from "@/types/starrail/character";
import { WeaponData } from "@/types/starrail/weapon";
import { __datadir } from "@/utils/directoryutils";
import { loadYaml } from "@/utils/yamlhelper";

const artifactSets: ArtifactSet[] = loadYaml<ArtifactSet[]>(path.join(__datadir, "starrail", "relicsets.yaml"));
const characterDatas = loadYaml<CharacterData[]>(path.join(__datadir, "starrail", "characters.yaml"));
const misc = loadYaml<Misc>(path.join(__datadir, "starrail", "misc.yaml"));
const weaponDatas = loadYaml<WeaponData[]>(path.join(__datadir, "starrail", "lightcones.yaml"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StorageProvider game="starrail">
      <DataProvider artifactSets={artifactSets} characterDatas={characterDatas} misc={misc} weaponDatas={weaponDatas}>
        {children}
      </DataProvider>
    </StorageProvider>
  );
}
