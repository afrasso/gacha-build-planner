import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { __publicdir } from "@/utils/directoryutils.js";
import downloadImage from "@/utils/downloadimage.js";
import ensureDirExists from "@/utils/ensuredirexists.js";

import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "./types";

const scrape = async ({
  artifacts,
  characters,
  weapons,
}: {
  artifacts: FailedArtifactIconDownload[];
  characters: FailedCharacterIconDownload[];
  weapons: FailedWeaponIconDownload[];
}) => {
  if (!_.isEmpty(characters) || !_.isEmpty(weapons) || !_.isEmpty(artifacts)) {
    ensureDirExists(__publicdir);

    await scrapeCharacterIcons({ characters });
    await scrapeWeaponIcons({ weapons });
    await scrapeArtifactIcons({ artifacts });
  }
};

const scrapeCharacterIcons = async ({ characters }: { characters: FailedCharacterIconDownload[] }) => {
  const url = "https://genshin-impact.fandom.com/wiki/Character/List";
  if (_.isEmpty(characters)) {
    return;
  }
  const nameToIdMap = characters.reduce<Record<string, string>>((result, character) => {
    result[character.name] = character.id;
    return result;
  }, {});

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const section = $("h2:has(#Playable_Characters)").nextUntil("h2");
    await scrapeIconsFromSection({ $, iconType: "character", nameToIdMap, section });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error scraping character icons:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
};

const scrapeWeaponIcons = async ({ weapons }: { weapons: FailedWeaponIconDownload[] }) => {
  const url = "https://genshin-impact.fandom.com/wiki/Weapon/List";
  if (_.isEmpty(weapons)) {
    return;
  }

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
    await scrapeIconsFromSection({ $, iconType: "weapon", nameToIdMap, section: listOfAllWeaponsSection });

    const questExclusiveWeaponsSection = $("h2:has(#Quest-Exclusive_Weapons)").nextUntil("h2");
    await scrapeIconsFromSection({ $, iconType: "weapon", nameToIdMap, section: questExclusiveWeaponsSection });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error scraping weapon icons:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
};

const scrapeArtifactIcons = async ({ artifacts }: { artifacts: FailedArtifactIconDownload[] }) => {
  const baseUrl = "https://genshin-impact.fandom.com";
  const url = "https://genshin-impact.fandom.com/wiki/Artifact/Sets";
  if (_.isEmpty(artifacts)) {
    return;
  }
  const nameToIdsMap = artifacts.reduce<Record<string, Array<FailedArtifactIconDownload>>>((result, artifact) => {
    if (!result[artifact.setName]) {
      result[artifact.setName] = [];
    }
    result[artifact.setName].push(artifact);
    return result;
  }, {});

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const section = $("h2:has(#List_of_Artifact_Sets)").nextUntil("h2");
    const rows = section.find("tr").toArray();

    const artifactPageUrls = [];
    for (const row of rows) {
      const iconLinks = $(row)
        .find("td:nth-child(3) a")
        .toArray()
        .map((link) => $(link).attr("href"))
        .filter((href): href is string => href != undefined)
        .map((href) => new URL(href, baseUrl).href);
      artifactPageUrls.push(...new Set(iconLinks));
    }
    for (const artifactPageUrl of artifactPageUrls) {
      await scrapeArtifactIcon({ artifactPageUrl, nameToIdsMap });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error scraping artifacts:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
};

const scrapeIconsFromSection = async ({
  $,
  iconType,
  nameToIdMap,
  section,
}: {
  $: cheerio.Root;
  iconType: string;
  nameToIdMap: Record<string, string>;
  section: cheerio.Cheerio;
}) => {
  const rows = section.find("tr").toArray();

  for (const row of rows) {
    const name = $(row).find("td:nth-child(2) a").text();
    const smallIconUrl = $(row).find("td:nth-child(1) img").attr("data-src");

    if (name && smallIconUrl && nameToIdMap[name]) {
      const id = nameToIdMap[name];
      const iconUrl = smallIconUrl.split(".png")[0] + ".png";
      const savePath = path.join(__publicdir, `${id}.png`);
      console.log(`Downloading ${iconType} ${name} (${id}) from ${iconUrl}`);
      await downloadImage({ savePath, url: iconUrl });
    }
  }
};

const scrapeArtifactIcon = async ({
  artifactPageUrl,
  nameToIdsMap,
}: {
  artifactPageUrl: string;
  nameToIdsMap: Record<string, Array<FailedArtifactIconDownload>>;
}) => {
  try {
    const { data } = await axios.get(artifactPageUrl);
    const $ = cheerio.load(data);

    const section = $("div.mw-body-content");
    const smallIconUrl = section.find("img.pi-image-thumbnail").attr("src");
    if (!smallIconUrl) {
      throw new Error(`Could not find artifact thumbnail on ${artifactPageUrl}`);
    }
    const iconUrl = smallIconUrl.split(".png")[0] + ".png";
    const setName = section.find("div[data-source=set] a").text();
    const type = section.find("div[data-source=piece] a").text();
    if (!setName || !type) {
      throw new Error(`Could not determine artifact type and name on ${artifactPageUrl}`);
    }
    const dbType = mapType(type);
    const id = nameToIdsMap[setName]?.find((x) => x.type === dbType)?.id;
    if (id && iconUrl) {
      const savePath = path.join(__publicdir, `${id}.png`);
      console.log(`Downloading ${dbType} for ${setName} (${id}) from ${iconUrl}`);
      await downloadImage({ savePath, url: iconUrl });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error scraping artifact icon:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
};

const mapType = (type: string) => {
  switch (type) {
    case "Circlet of Logos":
      return "circlet";
    case "Flower of Life":
      return "flower";
    case "Goblet of Eonothem":
      return "goblet";
    case "Plume of Death":
      return "plume";
    case "Sands of Eon":
      return "sands";
    default:
      throw new Error(`Found invalid artifact type from wiki:  ${type}`);
  }
};

export default scrape;
