import { buildWeaponIconUrls } from "@/assetretriever/genshin/buildiconurls";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImageWithFallback from "@/utils/downloadimagewithfallback";
import { saveYaml } from "@/utils/yamlhelper";
import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { FailedWeaponIconDownload } from "../types";
import calculateStatValue from "./calculatestatvalue";
import mapStat from "./mapdbstatkey";

const extractWeapons = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}) => {
  console.log("Extracting weapons...");

  const weapons = [];
  const failures: FailedWeaponIconDownload[] = [];

  const dbWeapons: genshindb.Weapon[] = _.uniq(genshindb.weapons("names", { matchCategories: true }))
    .map((weaponName) => genshindb.weapons(weaponName))
    .filter((weapon): weapon is genshindb.Weapon => weapon !== undefined);

  const getMaxLevel = (rarity: number) => {
    if (rarity === 1 || rarity === 2) {
      return 70;
    }
    return 90;
  };

  for (const dbWeapon of dbWeapons) {
    const id = String(dbWeapon.id);
    const name = dbWeapon.name;

    const maxLvlStats = dbWeapon.stats(getMaxLevel(dbWeapon.rarity));

    const mainStat = mapStat(dbWeapon.mainStatType);
    const mainStatValue = calculateStatValue({ rawValue: maxLvlStats.specialized, stat: mainStat });

    const weapon = {
      iconUrl: `/genshin/weapons/${id}.png`,
      id,
      mainStat,
      maxLvlStats: {
        ATK: maxLvlStats.attack,
        mainStat: mainStatValue,
      },
      name,
      rarity: dbWeapon.rarity,
      type: dbWeapon.weaponType,
    };

    weapons.push(weapon);

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      const savePath = path.join(__publicdir, "genshin", "weapons", `${id}.png`);
      const urls = buildWeaponIconUrls(dbWeapon.images);
      const label = `${name} (${id})`;
      const success = await downloadImageWithFallback({ label, savePath, urls, verbose });
      if (!success) {
        failures.push({ id, name });
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "weapons.yaml");
  saveYaml({ content: weapons, filePath, verbose });
  console.log("Weapon extraction complete.");
  return failures;
};

export default extractWeapons;
