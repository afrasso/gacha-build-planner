import _ from "lodash";
import path from "path";
import { StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedLightConeIconDownload } from "../types";
import mapDbBaseStat from "./mapdbbasestat";

const extractLightCones = async ({
  client,
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  client: StarRail;
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<FailedLightConeIconDownload[]> => {
  console.log("Extracting light cones...");

  const lightCones = [];
  const failures: FailedLightConeIconDownload[] = [];

  const dbLightCones = client.getAllLightCones();
  for (const dbLightCone of dbLightCones) {
    const id = String(dbLightCone.id);
    const name = dbLightCone.name.get("en");

    const maxLvlStats = dbLightCone.getStatsByLevel(6, 80).reduce((acc, dbStat) => {
      const stat = mapDbBaseStat(dbStat);
      acc[stat.key] = stat.value;
      return acc;
    }, {} as Record<string, number>);

    const lightCone = {
      iconUrl: `/starrail/lightcones/${id}.png`,
      id,
      maxLvlStats,
      name,
      path: dbLightCone.path.name.get("en"),
      rarity: dbLightCone.stars,
    };

    lightCones.push(lightCone);

    const url = dbLightCone.icon.url;
    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id)) && url) {
      try {
        if (verbose) {
          console.log(`Downloading icon for light cone "${name}" (${id}) from ${url}.`);
        }
        await downloadImage({ savePath: path.join(__publicdir, "starrail", "lightcones", `${id}.png`), url, verbose });
      } catch (err) {
        console.error(`Error downloading icon for light cone "${name}" (${id}): ${err}`);
        failures.push({ id, name });
      }
    }
  }

  const filePath = path.join(__datadir, "starrail", "lightcones.yaml");
  saveYaml({ content: lightCones, filePath, verbose });
  console.log("Light cone extraction complete.");
  return failures;
};

export default extractLightCones;
