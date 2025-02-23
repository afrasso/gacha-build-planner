import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { ArtifactType, Stat } from "@/types";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import ensureDirExists from "@/utils/ensuredirexists";
import { saveYaml } from "@/utils/yamlhelper";

import getArtifactIconPath from "./getartifacticonpath";
import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "./types";

const extractCharacters = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<FailedCharacterIconDownload[]> => {
  console.log("Extracting characters...");

  const characters = [];
  const failures: FailedCharacterIconDownload[] = [];

  const dbCharacters: genshindb.Character[] = _.uniq(genshindb.characters("names", { matchCategories: true }))
    .map((characterName) => genshindb.characters(characterName))
    .filter((character): character is genshindb.Character => character !== undefined);

  // Skip Lumine and get data for Aether only since it's identical.
  for (const dbCharacter of dbCharacters.filter((dbCharacter) => dbCharacter.name !== "Lumine")) {
    const id = String(dbCharacter.id);
    const rawName = dbCharacter.name;
    const name = rawName !== "Aether" ? rawName : "Traveler";

    const maxLvlStats = dbCharacter.stats(90);

    const ascensionStat = mapStat(dbCharacter.substatType);
    const ascensionStatValue = calculateStatValue({ rawValue: maxLvlStats.specialized, stat: ascensionStat });

    const character = {
      ascensionStat,
      element: dbCharacter.elementType,
      iconUrl: `/genshin/characters/${id}.png`,
      id,
      maxLvlStats: {
        ascensionStat: ascensionStatValue,
        ATK: maxLvlStats.attack,
        DEF: maxLvlStats.defense,
        HP: maxLvlStats.hp,
      },
      name,
      rarity: dbCharacter.rarity,
      weaponType: dbCharacter.weaponType,
    };

    characters.push(character);

    const url =
      name !== "Traveler"
        ? dbCharacter.images.mihoyo_icon
        : "https://static.wikia.nocookie.net/gensin-impact/images/5/59/Traveler_Icon.png";
    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id)) && url) {
      try {
        if (verbose) {
          console.log(`Downloading icon for character "${name}" (${id}) from ${url}.`);
        }
        await downloadImage({ savePath: path.join(__publicdir, "genshin", "characters", `${id}.png`), url, verbose });
      } catch (err) {
        console.warn(`Error downloading icon for ${name} (${id}): ${err}`);
        failures.push({ id, name });
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "characters.yaml");
  saveYaml({ content: characters, filePath, verbose });
  console.log("Character extraction complete.");
  return failures;
};

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

    weapons.push({
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
    });

    const url = dbWeapon.images.mihoyo_awakenIcon;
    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id)) && url) {
      try {
        if (verbose) {
          console.log(`Downloading icon for weapon "${dbWeapon.name}" (${id}) from ${url}`);
        }
        await downloadImage({ savePath: path.join(__publicdir, "genshin", "weapons", `${id}.png`), url, verbose });
      } catch (err) {
        console.warn(`Error downloading icon for weapon "${dbWeapon.name}" (${dbWeapon.id}): ${err}`);
        failures.push({ id, name });
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "weapons.yaml");
  saveYaml({ content: weapons, filePath, verbose });
  console.log("Weapon extraction complete.");
  return failures;
};

const extractArtifactSets = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}) => {
  console.log("Extracting artifact sets...");

  const artifactSets = [];
  const failures: FailedArtifactIconDownload[] = [];

  const dbArtifactSets: genshindb.Artifact[] = _.uniq(genshindb.artifacts("names", { matchCategories: true }))
    .map((artifactSetName) => genshindb.artifacts(artifactSetName))
    .filter((artifactSet): artifactSet is genshindb.Artifact => artifactSet !== undefined);

  for (const dbArtifactSet of dbArtifactSets) {
    const id = String(dbArtifactSet.id);
    const name = dbArtifactSet.name;

    artifactSets.push({
      hasArtifactTypes: {
        [ArtifactType.CIRCLET]: !!dbArtifactSet.circlet,
        [ArtifactType.FLOWER]: !!dbArtifactSet.flower,
        [ArtifactType.GOBLET]: !!dbArtifactSet.goblet,
        [ArtifactType.PLUME]: !!dbArtifactSet.plume,
        [ArtifactType.SANDS]: !!dbArtifactSet.sands,
      },
      iconUrl: getArtifactIconPath({ id, type: ArtifactType.FLOWER }),
      iconUrls: Object.values(ArtifactType).reduce((acc, type) => {
        acc[type] = getArtifactIconPath({ id, type });
        return acc;
      }, {} as Record<ArtifactType, string>),
      id,
      name: dbArtifactSet.name,
      rarities: dbArtifactSet.rarityList,
    });

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      if (dbArtifactSet.circlet) {
        const url = dbArtifactSet.images.mihoyo_circlet;
        const type = ArtifactType.CIRCLET;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.flower) {
        const url = dbArtifactSet.images.mihoyo_flower;
        const type = ArtifactType.FLOWER;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.goblet) {
        const url = dbArtifactSet.images.mihoyo_goblet;
        const type = ArtifactType.GOBLET;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.plume) {
        const url = dbArtifactSet.images.mihoyo_plume;
        const type = ArtifactType.PLUME;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.sands) {
        const url = dbArtifactSet.images.mihoyo_sands;
        const type = ArtifactType.SANDS;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "artifactsets.yaml");
  saveYaml({ content: artifactSets, filePath });
  console.log("Artifact set extraction complete.");
  return failures;
};

const downloadArtifactIcon = async ({
  id,
  name,
  type,
  url,
  verbose,
}: {
  id: string;
  name: string;
  type: ArtifactType;
  url?: string;
  verbose: boolean;
}): Promise<FailedArtifactIconDownload[]> => {
  if (!url) {
    return [{ setId: id, setName: name, type }];
  }

  try {
    const savePath = path.join(__publicdir, getArtifactIconPath({ id, type }));
    if (verbose) {
      console.log(`Downloading ${type} for artifact set "${name}" (${id}) from ${url}.`);
    }
    await downloadImage({ savePath, url });
  } catch (err) {
    console.warn(`Error downloading ${type} for artifact set "${name}" (${id}): ${err}`);
    return [{ setId: id, setName: name, type }];
  }

  return [];
};

const mapStat = (stat: string | undefined) => {
  if (!stat) {
    return;
  }

  const lookup: Record<string, Stat> = {
    FIGHT_PROP_ATTACK_PERCENT: Stat.ATK_PERCENT,
    FIGHT_PROP_CHARGE_EFFICIENCY: Stat.ENERGY_RECHARGE,
    FIGHT_PROP_CRITICAL: Stat.CRIT_RATE,
    FIGHT_PROP_CRITICAL_HURT: Stat.CRIT_DMG,
    FIGHT_PROP_DEFENSE_PERCENT: Stat.DEF_PERCENT,
    FIGHT_PROP_ELEC_ADD_HURT: Stat.DMG_BONUS_ELECTRO,
    FIGHT_PROP_ELEMENT_MASTERY: Stat.ELEMENTAL_MASTERY,
    FIGHT_PROP_FIRE_ADD_HURT: Stat.DMG_BONUS_PYRO,
    FIGHT_PROP_GRASS_ADD_HURT: Stat.DMG_BONUS_DENDRO,
    FIGHT_PROP_HEAL_ADD: Stat.HEALING_BONUS,
    FIGHT_PROP_HP_PERCENT: Stat.HP_PERCENT,
    FIGHT_PROP_ICE_ADD_HURT: Stat.DMG_BONUS_CRYO,
    FIGHT_PROP_PHYSICAL_ADD_HURT: Stat.DMG_BONUS_PHYSICAL,
    FIGHT_PROP_ROCK_ADD_HURT: Stat.DMG_BONUS_GEO,
    FIGHT_PROP_WATER_ADD_HURT: Stat.DMG_BONUS_HYDRO,
    FIGHT_PROP_WIND_ADD_HURT: Stat.DMG_BONUS_ANEMO,
  };

  const mappedStat = lookup[stat];
  if (!mappedStat) {
    throw new Error(`Could not find the stat ${stat}.`);
  }

  return mappedStat;
};

const calculateStatValue = ({ rawValue, stat }: { rawValue: number | undefined; stat: Stat | undefined }) => {
  if (!stat || !rawValue) {
    return;
  }

  // Currently, all possible ascension stats or weapon main stats other than Elemental Masery are percentages, which are
  // stored in genshinDB as a fraction of 1.
  if (stat === Stat.ELEMENTAL_MASTERY) {
    return rawValue;
  }
  return rawValue * 100;
};

const extract = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<{
  failedArtifactIconDownloads: FailedArtifactIconDownload[];
  failedCharacterIconDownloads: FailedCharacterIconDownload[];
  failedWeaponIconDownloads: FailedWeaponIconDownload[];
}> => {
  ensureDirExists(__datadir);
  ensureDirExists(path.join(__datadir, "genshin"));
  ensureDirExists(__publicdir);
  ensureDirExists(__publicdir);
  ensureDirExists(path.join(__publicdir, "genshin"));
  ensureDirExists(path.join(__publicdir, "genshin", "characters"));
  ensureDirExists(path.join(__publicdir, "genshin", "weapons"));
  ensureDirExists(path.join(__publicdir, "genshin", "artifacts"));
  ensureDirExists(path.join(__publicdir, "genshin", "artifactsets"));

  const failedCharacterIconDownloads = await extractCharacters({ downloadIcons, ids, verbose });
  const failedWeaponIconDownloads = await extractWeapons({ downloadIcons, ids, verbose });
  const failedArtifactIconDownloads = await extractArtifactSets({ downloadIcons, ids, verbose });

  return { failedArtifactIconDownloads, failedCharacterIconDownloads, failedWeaponIconDownloads };
};

export default extract;
