import path from "path";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "../types";
import extractArtifactSets from "./extractartifactsets";
import extractCharacters from "./extractcharacters";
import extractWeapons from "./extractweapons";

const extract = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<{
  failedArtifactIconDownloads: FailedArtifactIconDownload[];
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedWeaponIconDownloads: FailedWeaponIconDownload[];
}> => {
  ensureDirExists(__datadir);
  ensureDirExists(path.join(__datadir, "genshin"));
  ensureDirExists(__publicdir);
  ensureDirExists(path.join(__publicdir, "genshin"));
  ensureDirExists(path.join(__publicdir, "genshin", "artifacts"));
  ensureDirExists(path.join(__publicdir, "genshin", "artifactsets"));
  ensureDirExists(path.join(__publicdir, "genshin", "characters"));
  ensureDirExists(path.join(__publicdir, "genshin", "weapons"));

  const failedCharacterIconDownloads = await extractCharacters({ downloadIcons, ids, verbose });
  const failedWeaponIconDownloads = await extractWeapons({ downloadIcons, ids, verbose });
  const failedArtifactIconDownloads = await extractArtifactSets({ downloadIcons, ids, verbose });

  return { failedArtifactIconDownloads, failedCharacterIconDownloads, failedWeaponIconDownloads };
};

export default extract;
