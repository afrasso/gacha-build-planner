import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { ArtifactType, Stat } from "@/types";
import { __datadir, __publicdir } from "@/utils/directoryutils.js";
import downloadImage from "@/utils/downloadimage.js";
import ensureDirExists from "@/utils/ensuredirexists";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedArtifactIconDownload, FailedCharacterIconDownload, FailedWeaponIconDownload } from "./types";

const extractFromDb = async ({ downloadIcons = false, ids = [] }: { downloadIcons?: boolean; ids?: string[] } = {}) => {
  ensureDirExists(__datadir);
  ensureDirExists(__publicdir);

  const failedCharacterIconDownloads = await extractCharacters({ downloadIcons, ids });
  const failedWeaponIconDownloads = await extractWeapons({ downloadIcons, ids });
  const failedArtifactIconDownloads = await extractArtifactSets({ downloadIcons, ids });

  return { failedArtifactIconDownloads, failedCharacterIconDownloads, failedWeaponIconDownloads };
};

const extractCharacters = async ({
  downloadIcons = false,
  ids = [],
}: { downloadIcons?: boolean; ids?: string[] } = {}) => {
  const characters = [];
  const failures: FailedCharacterIconDownload[] = [];

  const dbCharacters: genshindb.Character[] = _.uniq(genshindb.characters("names", { matchCategories: true }))
    .map((characterName) => genshindb.characters(characterName))
    .filter((character): character is genshindb.Character => character !== undefined);

  // Skip Lumine and get data for Aether only since it's identical.
  for (const dbCharacter of dbCharacters.filter((dbCharacter) => dbCharacter.name !== "Lumine")) {
    const maxLvlStats = dbCharacter.stats(90);

    const ascensionStat = mapStat(dbCharacter.substatType);
    const ascensionStatValue = calculateStatValue({ rawValue: maxLvlStats.specialized, stat: ascensionStat });

    const character = {
      ascensionStat,
      element: dbCharacter.elementType,
      iconUrl: `/${dbCharacter.id}.png`,
      id: String(dbCharacter.id),
      maxLvlStats: {
        ascensionStat: ascensionStatValue,
        ATK: maxLvlStats.attack,
        DEF: maxLvlStats.defense,
        HP: maxLvlStats.hp,
      },
      name: dbCharacter.name !== "Aether" ? dbCharacter.name : "Traveler",
      rarity: dbCharacter.rarity,
      weaponType: dbCharacter.weaponType,
    };

    characters.push(character);

    if (
      downloadIcons &&
      (_.isEmpty(ids) || ids.includes(dbCharacter.id.toString())) &&
      dbCharacter.images.mihoyo_icon
    ) {
      try {
        console.log(
          `Downloading character ${dbCharacter.name} (${dbCharacter.id}) from ${dbCharacter.images.mihoyo_icon}`
        );
        const url =
          dbCharacter.name !== "Aether"
            ? dbCharacter.images.mihoyo_icon
            : "https://static.wikia.nocookie.net/gensin-impact/images/5/59/Traveler_Icon.png";
        await downloadImage({ savePath: path.join(__publicdir, `${dbCharacter.id}.png`), url });
      } catch (err) {
        console.log(
          `Failed downloading icon for ${dbCharacter.name} (${dbCharacter.id}) due to the following error: ${err}`
        );
        failures.push({ id: dbCharacter.id.toString(), name: dbCharacter.name });
      }
    }
  }

  saveYaml(characters, path.join(__datadir, "characters.yaml"));
  return failures;
};

const extractWeapons = async ({
  downloadIcons = false,
  ids = [],
}: { downloadIcons?: boolean; ids?: string[] } = {}) => {
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
    const maxLvlStats = dbWeapon.stats(getMaxLevel(dbWeapon.rarity));

    const mainStat = mapStat(dbWeapon.mainStatType);
    const mainStatValue = calculateStatValue({ rawValue: maxLvlStats.specialized, stat: mainStat });

    try {
      weapons.push({
        iconUrl: `/${dbWeapon.id}.png`,
        id: String(dbWeapon.id),
        mainStat,
        maxLvlStats: {
          ATK: maxLvlStats.attack,
          mainStat: mainStatValue,
        },
        name: dbWeapon.name,
        rarity: dbWeapon.rarity,
        type: dbWeapon.weaponType,
      });
    } catch (err) {
      console.log(JSON.stringify(dbWeapon));
      throw err;
    }

    if (
      downloadIcons &&
      (_.isEmpty(ids) || ids.includes(dbWeapon.id.toString())) &&
      dbWeapon.images.mihoyo_awakenIcon
    ) {
      try {
        console.log(`Downloading weapon ${dbWeapon.name} (${dbWeapon.id}) from ${dbWeapon.images.mihoyo_awakenIcon}`);
        await downloadImage({
          savePath: path.join(__publicdir, `${dbWeapon.id}.png`),
          url: dbWeapon.images.mihoyo_awakenIcon,
        });
      } catch (err) {
        console.log(
          `Failed downloading image for ${dbWeapon.name} (${dbWeapon.id}) due to the following error: ${err}`
        );
        failures.push({ id: dbWeapon.id.toString(), name: dbWeapon.name });
      }
    }
  }

  saveYaml(weapons, path.join(__datadir, "weapons.yaml"));
  return failures;
};

const extractArtifactSets = async ({
  downloadIcons = false,
  ids = [],
}: { downloadIcons?: boolean; ids?: string[] } = {}) => {
  const artifactSets = [];
  const failures: FailedArtifactIconDownload[] = [];

  const dbArtifactSets: genshindb.Artifact[] = _.uniq(genshindb.artifacts("names", { matchCategories: true }))
    .map((artifactSetName) => genshindb.artifacts(artifactSetName))
    .filter((artifactSet): artifactSet is genshindb.Artifact => artifactSet !== undefined);

  for (const dbArtifactSet of dbArtifactSets) {
    artifactSets.push({
      hasArtifactTypes: {
        [ArtifactType.CIRCLET]: !!dbArtifactSet.circlet,
        [ArtifactType.FLOWER]: !!dbArtifactSet.flower,
        [ArtifactType.GOBLET]: !!dbArtifactSet.goblet,
        [ArtifactType.PLUME]: !!dbArtifactSet.plume,
        [ArtifactType.SANDS]: !!dbArtifactSet.sands,
      },
      iconUrl: getIconUrl(dbArtifactSet),
      iconUrls: {
        [ArtifactType.CIRCLET]: `/${dbArtifactSet.id}_3.png`,
        [ArtifactType.FLOWER]: `/${dbArtifactSet.id}_4.png`,
        [ArtifactType.GOBLET]: `/${dbArtifactSet.id}_1.png`,
        [ArtifactType.PLUME]: `/${dbArtifactSet.id}_2.png`,
        [ArtifactType.SANDS]: `/${dbArtifactSet.id}_5.png`,
      },
      id: String(dbArtifactSet.id),
      name: dbArtifactSet.name,
      rarities: dbArtifactSet.rarityList,
    });

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(dbArtifactSet.id.toString()))) {
      if (dbArtifactSet.flower && dbArtifactSet.images.mihoyo_flower) {
        const result = await downloadIcon({
          description: `flower for ${dbArtifactSet.name}`,
          id: `${dbArtifactSet.id}_4`,
          name: dbArtifactSet.flower.name,
          setName: dbArtifactSet.name,
          type: "flower",
          url: dbArtifactSet.images.mihoyo_flower,
        });
        if (result) {
          failures.push(result);
        }
      }
      if (dbArtifactSet.plume && dbArtifactSet.images.mihoyo_plume) {
        const result = await downloadIcon({
          description: `plume for ${dbArtifactSet.name}`,
          id: `${dbArtifactSet.id}_2`,
          name: dbArtifactSet.plume.name,
          setName: dbArtifactSet.name,
          type: "plume",
          url: dbArtifactSet.images.mihoyo_plume,
        });
        if (result) {
          failures.push(result);
        }
      }
      if (dbArtifactSet.sands && dbArtifactSet.images.mihoyo_sands) {
        const result = await downloadIcon({
          description: `sands for ${dbArtifactSet.name}`,
          id: `${dbArtifactSet.id}_5`,
          name: dbArtifactSet.sands.name,
          setName: dbArtifactSet.name,
          type: "sands",
          url: dbArtifactSet.images.mihoyo_sands,
        });
        if (result) {
          failures.push(result);
        }
      }
      if (dbArtifactSet.goblet && dbArtifactSet.images.mihoyo_goblet) {
        const result = await downloadIcon({
          description: `goblet for ${dbArtifactSet.name}`,
          id: `${dbArtifactSet.id}_1`,
          name: dbArtifactSet.goblet.name,
          setName: dbArtifactSet.name,
          type: "goblet",
          url: dbArtifactSet.images.mihoyo_goblet,
        });
        if (result) {
          failures.push(result);
        }
      }
      if (dbArtifactSet.circlet && dbArtifactSet.images.mihoyo_circlet) {
        const result = await downloadIcon({
          description: `circlet for ${dbArtifactSet.name}`,
          id: `${dbArtifactSet.id}_3`,
          name: dbArtifactSet.circlet.name,
          setName: dbArtifactSet.name,
          type: "circlet",
          url: dbArtifactSet.images.mihoyo_circlet,
        });
        if (result) {
          failures.push(result);
        }
      }
    }
  }

  saveYaml(artifactSets, path.join(__datadir, "artifactSets.yaml"));
  return failures;
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

const downloadIcon = async ({
  description,
  id,
  name,
  setName,
  type,
  url,
}: {
  description: string;
  id: string;
  name: string;
  setName: string;
  type: string;
  url: string;
}) => {
  try {
    console.log(`Downloading ${description} (${id}) from ${url}`);
    await downloadImage({ savePath: path.join(__publicdir, `${id}.png`), url });
  } catch (err) {
    console.log(`Failed downloading ${description} (${id}) from ${url}) due to the following error: ${err}`);
    return { id, name, setName, type };
  }
};

const getIconUrl = (dbArtifactSet: genshindb.Artifact) => {
  if (dbArtifactSet.flower) {
    return `/${dbArtifactSet.id}_4.png`;
  } else if (dbArtifactSet.plume) {
    return `/${dbArtifactSet.id}_2.png`;
  } else if (dbArtifactSet.sands) {
    return `/${dbArtifactSet.id}_5.png`;
  } else if (dbArtifactSet.goblet) {
    return `/${dbArtifactSet.id}_1.png`;
  } else if (dbArtifactSet.circlet) {
    return `/${dbArtifactSet.id}_3.png`;
  } else {
    throw new Error(`Artifact set ${dbArtifactSet} has no artifacts`);
  }
};

export default extractFromDb;
