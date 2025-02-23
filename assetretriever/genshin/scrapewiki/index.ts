import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "../types";
import scrapeArtifactIcons from "./scrapeartifacticons";
import scrapeCharacterIcons from "./scrapecharactericons";
import scrapeWeaponIcons from "./scrapeweaponicons";

const scrapeWiki = async ({
  failedArtifactIconDownloads,
  failedCharacterIconDownloads,
  failedWeaponIconDownloads,
  verbose,
}: {
  failedArtifactIconDownloads: FailedArtifactIconDownload[];
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedWeaponIconDownloads: FailedWeaponIconDownload[];
  verbose: boolean;
}) => {
  if (
    !_.isEmpty(failedArtifactIconDownloads) ||
    !_.isEmpty(failedCharacterIconDownloads) ||
    !_.isEmpty(failedWeaponIconDownloads)
  ) {
    console.log("Scraping missing icons from wiki....");
    ensureDirExists(__publicdir);
    ensureDirExists(path.join(__publicdir, "genshin"));
    ensureDirExists(path.join(__publicdir, "genshin", "artifacts"));
    ensureDirExists(path.join(__publicdir, "genshin", "artifactsets"));
    ensureDirExists(path.join(__publicdir, "genshin", "characters"));
    ensureDirExists(path.join(__publicdir, "genshin", "weapons"));

    await scrapeCharacterIcons({ failedCharacterIconDownloads, verbose });
    await scrapeWeaponIcons({ failedWeaponIconDownloads, verbose });
    await scrapeArtifactIcons({ failedArtifactIconDownloads, verbose });

    console.log("Scraping complete.");
  }
};

export default scrapeWiki;
