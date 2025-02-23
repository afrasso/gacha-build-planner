import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { retrieveAssets as retrieveGenshinAssets } from "./genshin";
import { retrieveAssets as retrieveStarRailAssets } from "./starrail";

const argv = yargs(hideBin(process.argv))
  .option("download-icons", {
    alias: "d",
    default: false,
    describe: "Download static files such as icons",
    type: "boolean",
  })
  .option("game", {
    alias: "g",
    choices: ["genshin", "starrail"],
    type: "string",
  })
  .option("ids", {
    describe: "Specify a list of icon IDs to download",
    type: "array",
  })
  .option("verbose", {
    alias: "v",
    default: false,
    describe: "Enable verbose output",
    type: "boolean",
  })
  .implies("ids", "game")
  .help().argv as { downloadIcons: boolean; game?: string; ids?: string[]; verbose: boolean };

const main = async () => {
  try {
    if (!argv.game || argv.game === "genshin") {
      console.log("Retrieving all Genshin assets...");
      await retrieveGenshinAssets({ downloadIcons: argv.downloadIcons, ids: argv.ids, verbose: argv.verbose });
      console.log("Genshin assets retrieved successfully.");
    }
    if (!argv.game || argv.game === "starrail") {
      console.log("Retrieving all Star Rail assets...");
      await retrieveStarRailAssets({ downloadIcons: argv.downloadIcons, ids: argv.ids, verbose: argv.verbose });
      console.log("Star Rail assets retrieved successfully.");
    }
  } catch (err) {
    console.error("An unexpected error ocurred.", err);
  }
};

main();
