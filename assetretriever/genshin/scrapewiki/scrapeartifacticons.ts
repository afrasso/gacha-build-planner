import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import path from "path";

import { ArtifactType } from "@/types";
import { __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";

import getArtifactIconPath from "../getartifacticonpath";
import { FailedArtifactIconDownload } from "../types";

const mapType = (type: string): ArtifactType => {
  switch (type) {
    case "Circlet of Logos":
      return ArtifactType.CIRCLET;
    case "Flower of Life":
      return ArtifactType.FLOWER;
    case "Goblet of Eonothem":
      return ArtifactType.GOBLET;
    case "Plume of Death":
      return ArtifactType.PLUME;
    case "Sands of Eon":
      return ArtifactType.SANDS;
    default:
      throw new Error(`Found invalid artifact type from wiki:  ${type}`);
  }
};

const scrapeArtifactIcon = async ({
  artifactPageUrl,
  failedArtifactIconDownloads,
  verbose,
}: {
  artifactPageUrl: string;
  failedArtifactIconDownloads: FailedArtifactIconDownload[];
  verbose: boolean;
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
    const typeName = section.find("div[data-source=piece] a").text();
    if (!setName || !typeName) {
      throw new Error(`Could not determine artifact type and name on ${artifactPageUrl}`);
    }
    const type = mapType(typeName);
    const artifact = failedArtifactIconDownloads.find(
      (artifact) => artifact.setName === setName && artifact.type === type
    );
    if (artifact) {
      const id = artifact.setId;
      const savePath = path.join(__publicdir, getArtifactIconPath({ id, type }));
      console.log(`Downloading icon for ${type} of ${setName} (${id}) from ${iconUrl}`);
      await downloadImage({ savePath, url: iconUrl, verbose });
    }
  } catch (err) {
    console.error(`Error scraping artifact icon: ${err}`);
  }
};

const scrapeArtifactIcons = async ({
  failedArtifactIconDownloads,
  verbose,
}: {
  failedArtifactIconDownloads: FailedArtifactIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedArtifactIconDownloads)) {
    return;
  }

  console.log("Scraping artifact icons...");

  const baseUrl = "https://genshin-impact.fandom.com";
  const url = "https://genshin-impact.fandom.com/wiki/Artifact/Sets";

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
      await scrapeArtifactIcon({ artifactPageUrl, failedArtifactIconDownloads, verbose });
    }
  } catch (err) {
    console.error(`Error scraping artifacts: ${err}`);
  }
  console.log("Artifact icon scraping complete.");
};

export default scrapeArtifactIcons;
