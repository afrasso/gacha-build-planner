import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import { FailedLightConeIconDownload } from "../types";

const scrapeLightConeIcons = async ({
  failedLightConeIconDownloads,
  verbose,
}: {
  failedLightConeIconDownloads: FailedLightConeIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedLightConeIconDownloads)) {
    return;
  }

  console.log("Scraping light cone icons...");

  const url = "https://honkai-star-rail.fandom.com/wiki/Light_Cone/List";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const section = $("h2:has(#List)").nextUntil("h2");
    const rows = section.find("tr").toArray();

    for (const row of rows) {
      const name = $(row).find("td:nth-child(1) a").text();
      const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");
      const lightCone = failedLightConeIconDownloads.find((lightCone) => lightCone.name === name);
      if (name && smallIconUrl && lightCone) {
        const url = smallIconUrl.split(".png")[0] + ".png";
        const savePath = path.join(__publicdir, "starrail", "lightcones", `${lightCone.id}.png`);
        console.log(`Downloading icon for ${name} (${lightCone.id}) from ${url}.`);
        await downloadImage({ savePath, url, verbose });
      }
    }
  } catch (err) {
    console.error(`Error scraping light cone icons: ${err}`);
  }
  console.log("Light cone icon scraping complete.");
};

export default scrapeLightConeIcons;
