import { buildLightConeFallbackUrls } from "@/assetretriever/starrail/buildstaticapiurls";
import downloadStarrailIcon from "@/assetretriever/starrail/downloadstarrailicon";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import { saveYaml } from "@/utils/yamlhelper";
import _ from "lodash";
import path from "path";
import { StarRail } from "starrail.js";

import { FailedLightConeIconDownload } from "../types";
import mapDbStatKey from "./mapdbstatkey";

const extractLightCones = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<FailedLightConeIconDownload[]> => {
  console.log("Extracting light cones...");

  const lightCones = [];
  const failures: FailedLightConeIconDownload[] = [];

  const client = new StarRail({});
  const dbLightCones = client.getAllLightCones();

  for (const dbLightCone of dbLightCones) {
    const id = String(dbLightCone.id);
    const name = dbLightCone.name.get("en");

    const maxLvlStats = dbLightCone.getStatsByLevel(6, 80).reduce((acc, dbStat) => {
      const statKey = mapDbStatKey(dbStat.type);
      acc[statKey] = dbStat.value;
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

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      const savePath = path.join(__publicdir, "starrail", "lightcones", `${id}.png`);
      const label = `${name} (${id})`;
      const success = await downloadStarrailIcon({
        explicitFallbackUrls: buildLightConeFallbackUrls(id),
        icon: dbLightCone.icon,
        label,
        savePath,
        verbose,
      });
      if (!success) {
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
