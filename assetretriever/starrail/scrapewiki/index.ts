import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

import {
  FailedCharacterIconDownload,
  FailedLightConeIconDownload,
  FailedRelicIconDownload,
  FailedRelicSetIconDownload,
} from "../types";
import { scrapeCharacterIcons } from "./scrapecharactericons";
import scrapeLightConeIcons from "./scrapelightconeicons";
import scrapeRelicIcons from "./scraperelicicons";
import scrapeRelicSetIcons from "./scraperelicseticons";

const scrapeWiki = async ({
  failedCharacterIconDownloads,
  failedLightConeIconDownloads,
  failedRelicIconDownloads,
  failedRelicSetIconDownloads,
  verbose,
}: {
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedLightConeIconDownloads: FailedLightConeIconDownload[];
  failedRelicIconDownloads: FailedRelicIconDownload[];
  failedRelicSetIconDownloads: FailedRelicSetIconDownload[];
  verbose: boolean;
}) => {
  if (
    !_.isEmpty(failedCharacterIconDownloads) ||
    !_.isEmpty(failedLightConeIconDownloads) ||
    !_.isEmpty(failedRelicIconDownloads) ||
    !_.isEmpty(failedRelicSetIconDownloads)
  ) {
    console.log("Scraping missing icons from wiki....");
    ensureDirExists(__publicdir);
    ensureDirExists(path.join(__publicdir, "starrail"));
    ensureDirExists(path.join(__publicdir, "starrail", "characters"));
    ensureDirExists(path.join(__publicdir, "starrail", "lightcones"));
    ensureDirExists(path.join(__publicdir, "starrail", "relics"));
    ensureDirExists(path.join(__publicdir, "starrail", "relicsets"));

    await scrapeCharacterIcons({ failedCharacterIconDownloads, verbose });
    await scrapeLightConeIcons({ failedLightConeIconDownloads, verbose });
    await scrapeRelicIcons({ failedRelicIconDownloads, verbose });
    await scrapeRelicSetIcons({ failedRelicSetIconDownloads, verbose });

    console.log("Scraping complete.");
  }
};

export default scrapeWiki;
