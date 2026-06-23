import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { buildCharacterIconUrls } from "@/assetretriever/genshin/buildiconurls";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImageWithFallback from "@/utils/downloadimagewithfallback";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedCharacterIconDownload } from "../types";
import calculateStatValue from "./calculatestatvalue";
import mapStat from "./mapdbstatkey";

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

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      const savePath = path.join(__publicdir, "genshin", "characters", `${id}.png`);
      const urls = buildCharacterIconUrls(dbCharacter.images);
      const label = `${name} (${id})`;
      const success = await downloadImageWithFallback({ label, savePath, urls, verbose });
      if (!success) {
        failures.push({ id, name });
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "characters.yaml");
  saveYaml({ content: characters, filePath, verbose });
  console.log("Character extraction complete.");
  return failures;
};

export default extractCharacters;
