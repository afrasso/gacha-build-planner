import path from "path";
import { StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import ensureDirExists from "@/utils/ensuredirexists";

import {
  FailedCharacterIconDownload,
  FailedLightConeIconDownload,
  FailedRelicIconDownload,
  FailedRelicSetIconDownload,
} from "../types";
import extractCharacters from "./extractcharacters";
import extractLightCones from "./extractlightcones";
import extractRelicSets from "./extractrelicsets";

const extract = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<{
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedLightConeIconDownloads: FailedLightConeIconDownload[];
  failedRelicIconDownloads: FailedRelicIconDownload[];
  failedRelicSetIconDownloads: FailedRelicSetIconDownload[];
}> => {
  ensureDirExists(path.join(__datadir, "starrail"));
  ensureDirExists(__publicdir);
  ensureDirExists(path.join(__publicdir, "starrail"));
  ensureDirExists(path.join(__publicdir, "starrail", "characters"));
  ensureDirExists(path.join(__publicdir, "starrail", "lightcones"));
  ensureDirExists(path.join(__publicdir, "starrail", "relics"));
  ensureDirExists(path.join(__publicdir, "starrail", "relicsets"));

  const client = new StarRail({});

  const failedCharacterIconDownloads = await extractCharacters({ client, downloadIcons, ids, verbose });
  const failedLightConeIconDownloads = await extractLightCones({ client, downloadIcons, ids, verbose });
  const { failures: failedRelicIconDownloads, setFailures: failedRelicSetIconDownloads } = await extractRelicSets({
    client,
    downloadIcons,
    ids,
    verbose,
  });

  return {
    failedCharacterIconDownloads,
    failedLightConeIconDownloads,
    failedRelicIconDownloads,
    failedRelicSetIconDownloads,
  };
};

export default extract;
