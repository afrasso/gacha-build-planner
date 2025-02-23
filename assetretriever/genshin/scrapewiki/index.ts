import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "../types";
import scrapeArtifactIcons from "./scrapeartifacticons";
import scrapeCharacterIcons from "./scrapecharactericons";
import scrapeWeaponIcons from "./scrapeweaponicons";

const scrapeWiki = async ({
  artifacts,
  characters,
  verbose,
  weapons,
}: {
  artifacts: FailedArtifactIconDownload[];
  characters: FailedCharacterIconDownload[];
  verbose: boolean;
  weapons: FailedWeaponIconDownload[];
}) => {
  if (!_.isEmpty(characters) || !_.isEmpty(weapons) || !_.isEmpty(artifacts)) {
    console.log("Scraping missing icons from wiki....");
    ensureDirExists(__publicdir);
    ensureDirExists(path.join(__publicdir, "genshin"));
    ensureDirExists(path.join(__publicdir, "genshin", "artifacts"));
    ensureDirExists(path.join(__publicdir, "genshin", "artifactsets"));
    ensureDirExists(path.join(__publicdir, "genshin", "characters"));
    ensureDirExists(path.join(__publicdir, "genshin", "weapons"));

    await scrapeCharacterIcons({ characters, verbose });
    await scrapeWeaponIcons({ verbose, weapons });
    await scrapeArtifactIcons({ artifacts, verbose });

    console.log("Scraping complete.");
  }
};

export default scrapeWiki;
