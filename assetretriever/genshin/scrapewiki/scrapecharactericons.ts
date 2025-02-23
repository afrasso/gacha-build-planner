import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import { FailedCharacterIconDownload } from "../types";

const scrapeCharacterIcons = async ({
  failedCharacterIconDownloads,
  verbose,
}: {
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedCharacterIconDownloads)) {
    return;
  }

  console.log("Scraping character icons...");

  const url = "https://genshin-impact.fandom.com/wiki/Character/List";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const section = $("h2:has(#Playable_Characters)").nextUntil("h2");
    const rows = section.find("tr").toArray();

    for (const row of rows) {
      const name = $(row).find("td:nth-child(2) a").text();
      const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");
      const character = failedCharacterIconDownloads.find((character) => character.name === name);

      if (name && smallIconUrl && character) {
        const id = character.id;
        const iconUrl = smallIconUrl.split(".png")[0] + ".png";
        const savePath = path.join(__publicdir, "genshin", "characters", `${id}.png`);
        console.log(`Downloading icon for ${name} (${id}) from ${iconUrl}.`);
        await downloadImage({ savePath, url: iconUrl, verbose });
      }
    }
  } catch (err) {
    console.error(`Error scraping character icons: ${err}`);
  }
  console.log("Character icon scraping complete.");
};

export default scrapeCharacterIcons;
