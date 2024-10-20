import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import extractFromDb from "./extractfromdb.js";
import scrapeWiki from "./scrapewiki.js";

const argv = yargs(hideBin(process.argv))
  .option("download-icons", {
    alias: "d",
    default: false,
    describe: "Download static files such as icons",
    type: "boolean",
  })
  .option("ids", {
    describe: "Specify a list of icon IDs to download",
    type: "array",
  })
  .help().argv as { downloadIcons: boolean; ids?: string[] };

const main = async () => {
  try {
    const { failedArtifactIconDownloads, failedCharacterIconDownloads, failedWeaponIconDownloads } =
      await extractFromDb({ downloadIcons: argv.downloadIcons, ids: argv.ids });
    await scrapeWiki({
      artifacts: failedArtifactIconDownloads,
      characters: failedCharacterIconDownloads,
      weapons: failedWeaponIconDownloads,
    });
  } catch (err) {
    console.error("Uncaught error:", err);
  }
};

main();
