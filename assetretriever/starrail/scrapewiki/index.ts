import _ from "lodash";

import { __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

export * from "./types";

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
import { VERBOSITY } from "./types";

const scrapeWiki = async ({
  failedCharacterIconDownloads,
  failedLightConeIconDownloads,
  failedRelicIconDownloads,
  failedRelicSetIconDownloads,
  verbosity = VERBOSITY.INFO,
}: {
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedLightConeIconDownloads: FailedLightConeIconDownload[];
  failedRelicIconDownloads: FailedRelicIconDownload[];
  failedRelicSetIconDownloads: FailedRelicSetIconDownload[];
  verbosity: VERBOSITY;
}) => {
  if (
    !_.isEmpty(failedCharacterIconDownloads) ||
    !_.isEmpty(failedLightConeIconDownloads) ||
    !_.isEmpty(failedRelicIconDownloads) ||
    !_.isEmpty(failedRelicSetIconDownloads)
  ) {
    console.log("Scraping missing icons from wiki....");
    ensureDirExists(__publicdir);

    await scrapeCharacterIcons({ failedCharacterIconDownloads, verbosity });
    await scrapeLightConeIcons({ failedLightConeIconDownloads, verbosity });
    await scrapeRelicIcons({ failedRelicIconDownloads, verbosity });
    await scrapeRelicSetIcons({ failedRelicSetIconDownloads, verbosity });

    console.log("Scraping complete.");
  }
};

export default scrapeWiki;
