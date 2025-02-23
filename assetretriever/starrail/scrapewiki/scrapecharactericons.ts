import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import { FailedCharacterIconDownload } from "../types";
import { VERBOSITY } from "./types";

export const scrapeCharacterIcons = async ({
  failedCharacterIconDownloads,
  verbosity,
}: {
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  verbosity: VERBOSITY;
}) => {
  const url = "https://honkai-star-rail.fandom.com/wiki/Character/List";
  if (_.isEmpty(failedCharacterIconDownloads)) {
    return;
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const section = $("h2:has(#Playable_Characters)").nextUntil("h2");
    const rows = section.find("tr").toArray();

    for (const row of rows) {
      const name = $(row).find("td:nth-child(1) a").text();
      const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");
      const pathName = $(row).find("td:nth-child(3) a:nth-child(2)").text();

      const character = failedCharacterIconDownloads.find(
        (character) => character.name === name && character.pathName === pathName
      );
      if (name && smallIconUrl && character) {
        const url = smallIconUrl.split(".png")[0] + ".png";
        const savePath = path.join(__publicdir, "starrail", "characters", `${character.id}.png`);
        if (verbosity >= VERBOSITY.INFO) {
          console.log(`Downloading icon for character '${name}' of path ${pathName} (${character.id}) from ${url}.`);
        }
        await downloadImage({ savePath, url, verbose: verbosity === VERBOSITY.DEBUG });
      }
    }
  } catch (err) {
    console.error(`Error scraping character icons: ${err}`);
  }
};

export default scrapeCharacterIcons;
