import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import { FailedWeaponIconDownload } from "../types";

const scrapeIconsFromSection = async ({
  $,
  failedWeaponIconDownloads,
  section,
  verbose,
}: {
  $: cheerio.Root;
  failedWeaponIconDownloads: FailedWeaponIconDownload[];
  section: cheerio.Cheerio;
  verbose: boolean;
}) => {
  const rows = section.find("tr").toArray();

  for (const row of rows) {
    const name = $(row).find("td:nth-child(2) a").text();
    const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");
    const weapon = failedWeaponIconDownloads.find((weapon) => weapon.name === name);

    if (name && smallIconUrl && weapon) {
      const id = weapon.id;
      const iconUrl = smallIconUrl.split(".png")[0] + ".png";
      const savePath = path.join(__publicdir, "genshin", "weapons", `${id}.png`);
      console.log(`Downloading icon for ${name} (${id}) from ${iconUrl}.`);
      await downloadImage({ savePath, url: iconUrl, verbose });
    }
  }
};

const scrapeWeaponIcons = async ({
  failedWeaponIconDownloads,
  verbose,
}: {
  failedWeaponIconDownloads: FailedWeaponIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedWeaponIconDownloads)) {
    return;
  }

  console.log("Scraping weapon icons...");

  const url = "https://genshin-impact.fandom.com/wiki/Weapon/List";

  // Special handling to map database weapon name to wiki icon name.
  const prizedIsshinBlade = failedWeaponIconDownloads.find((weapon) => weapon.id === "11419");
  if (prizedIsshinBlade) {
    prizedIsshinBlade.name = "Prized Isshin Blade (Awakened)";
  }

  try {
    const response = await axios.get(url);
    const $: cheerio.Root = cheerio.load(response.data);

    const listOfAllWeaponsSection: cheerio.Cheerio = $("h2:has(#List_of_All_Weapons)").nextUntil("h2");
    await scrapeIconsFromSection({ $, failedWeaponIconDownloads, section: listOfAllWeaponsSection, verbose });

    const questExclusiveWeaponsSection = $("h2:has(#Quest-Exclusive_Weapons)").nextUntil("h2");
    await scrapeIconsFromSection({ $, failedWeaponIconDownloads, section: questExclusiveWeaponsSection, verbose });
  } catch (err) {
    console.error(`Error scraping weapon icons: ${err}`);
  }
  console.log("Weapon icon scraping complete.");
};

export default scrapeWeaponIcons;
