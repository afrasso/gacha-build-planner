import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

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

  for (const dbCharacter of dbCharacters) {
    characters.push({
      element: dbCharacter.elementType,
      iconUrl: `/${dbCharacter.id}.png`,
      id: dbCharacter.id,
      name: dbCharacter.name,
      rarity: dbCharacter.rarity,
      weaponType: dbCharacter.weaponType,
    });

    if (
      downloadIcons &&
      (_.isEmpty(ids) || ids.includes(dbCharacter.id.toString())) &&
      dbCharacter.images.mihoyo_icon
    ) {
      try {
        console.log(
          `Downloading character ${dbCharacter.name} (${dbCharacter.id}) from ${dbCharacter.images.mihoyo_icon}`
        );
        await downloadImage({
          savePath: path.join(__publicdir, `${dbCharacter.id}.png`),
          url: dbCharacter.images.mihoyo_icon,
        });
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

  for (const dbWeapon of dbWeapons) {
    weapons.push({
      iconUrl: `/${dbWeapon.id}.png`,
      id: dbWeapon.id,
      name: dbWeapon.name,
      rarity: dbWeapon.rarity,
      type: dbWeapon.weaponType,
    });

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
      iconUrl: getIconUrl(dbArtifactSet),
      id: dbArtifactSet.id,
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
