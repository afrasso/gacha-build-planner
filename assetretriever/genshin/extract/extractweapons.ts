import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

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
      const url = dbWeapon.images.mihoyo_awakenIcon;
      if (!url) {
        console.warn(`Icon URL for ${dbWeapon.name} (${id}) does not exist.`);
        failures.push({ id, name });
      } else {
        const savePath = path.join(__publicdir, "genshin", "weapons", `${id}.png`);
        if (verbose) {
          console.log(`Downloading icon for ${dbWeapon.name} (${id}) from ${url}`);
        }
        try {
          await downloadImage({ savePath, url, verbose });
        } catch (err) {
          console.warn(`Error downloading icon for ${dbWeapon.name} (${dbWeapon.id}): ${err}`);
          failures.push({ id, name });
        }
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "weapons.yaml");
  saveYaml({ content: weapons, filePath, verbose });
  console.log("Weapon extraction complete.");
  return failures;
};

export default extractWeapons;
