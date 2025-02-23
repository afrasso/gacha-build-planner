import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import { FailedWeaponIconDownload } from "../types";

const scrapeIconsFromSection = async ({
  $,
  nameToIdMap,
  section,
  verbose,
}: {
  $: cheerio.Root;
  nameToIdMap: Record<string, string>;
  section: cheerio.Cheerio;
  verbose: boolean;
}) => {
  const rows = section.find("tr").toArray();

  for (const row of rows) {
    const name = $(row).find("td:nth-child(2) a").text();
    const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");

    if (name && smallIconUrl && nameToIdMap[name]) {
      const id = nameToIdMap[name];
      const iconUrl = smallIconUrl.split(".png")[0] + ".png";
      const savePath = path.join(__publicdir, "genshin", "weapons", `${id}.png`);
      console.log(`Downloading weapon "${name}" (${id}) from ${iconUrl}.`);
      await downloadImage({ savePath, url: iconUrl, verbose });
    }
  }
};

const scrapeWeaponIcons = async ({ verbose, weapons }: { verbose: boolean; weapons: FailedWeaponIconDownload[] }) => {
  if (_.isEmpty(weapons)) {
    return;
  }

  const url = "https://genshin-impact.fandom.com/wiki/Weapon/List";

  // Special handling to map database weapon name to wiki icon name.
  const prizedIsshinBlade = weapons.find((weapon) => weapon.id === "11419");
  if (prizedIsshinBlade) {
    prizedIsshinBlade.name = "Prized Isshin Blade (Awakened)";
  }

  const nameToIdMap = weapons.reduce<Record<string, string>>((result, weapon) => {
    result[weapon.name] = weapon.id;
    return result;
  }, {});

  try {
    const response = await axios.get(url);
    const $: cheerio.Root = cheerio.load(response.data);

    const listOfAllWeaponsSection: cheerio.Cheerio = $("h2:has(#List_of_All_Weapons)").nextUntil("h2");
    await scrapeIconsFromSection({ $, nameToIdMap, section: listOfAllWeaponsSection, verbose });

    const questExclusiveWeaponsSection = $("h2:has(#Quest-Exclusive_Weapons)").nextUntil("h2");
    await scrapeIconsFromSection({ $, nameToIdMap, section: questExclusiveWeaponsSection, verbose });
  } catch (err) {
    console.error(`Error scraping weapon icons: ${err}`);
  }
};

export default scrapeWeaponIcons;
