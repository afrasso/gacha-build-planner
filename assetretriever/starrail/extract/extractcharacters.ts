import _ from "lodash";
import path from "path";
import { CharacterData, SkillLevel, StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedCharacterIconDownload } from "../types";
import mapDbStatKey from "./mapdbstatkey";

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

  const client = new StarRail({});
  const dbCharacters: CharacterData[] = client.getAllCharacters();

  // Skip Stelle and get data for Caelus only since it's identical.
  for (const dbCharacter of dbCharacters.filter(
    (dbCharacter) => dbCharacter.name.get("en") !== "{NICKNAME}" || dbCharacter.id % 2 === 1
  )) {
    const id = String(dbCharacter.id);
    const rawName = dbCharacter.name.get("en");
    const name = rawName === "{NICKNAME}" ? `Trailblazer` : rawName;
    const pathName = dbCharacter.path.name.get("en");

    const maxLvlStats = dbCharacter.getStatsByLevel(6, 80).reduce((acc, dbStat) => {
      const statKey = mapDbStatKey(dbStat.type);
      acc[statKey] = dbStat.value;
      return acc;
    }, {} as Record<string, number>);

    const statTraces = dbCharacter.skillTreeNodes
      .flatMap((node) => node.getSkillTreeNodeByLevel(new SkillLevel(node.maxLevel, 0)).stats)
      .reduce((acc, dbStat) => {
        const statKey = mapDbStatKey(dbStat.type);
        acc[statKey] = (acc[statKey] || 0) + dbStat.value;
        return acc;
      }, {} as Record<string, number>);

    const character = {
      combatTypeId: dbCharacter.combatType.id,
      iconUrl: `/starrail/characters/${id}.png`,
      id,
      maxLvlStats,
      name,
      path: dbCharacter.path.id,
      rarity: dbCharacter.stars,
      statTraces,
    };

    characters.push(character);

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      if (name !== "Trailblazer") {
        const url = dbCharacter.icon.url;
        const savePath = path.join(__publicdir, "starrail", "characters", `${id}.png`);
        if (verbose) {
          console.log(`Downloading icon for ${name} of path ${pathName} (${id}) from ${url}.`);
        }
        try {
          await downloadImage({ savePath, url, verbose });
        } catch (err) {
          console.warn(`Error downloading icon for ${name} of path ${pathName} (${id}): ${err}`);
          failures.push({ id, name, pathName });
        }
      } else {
        // Ensure we download the Trailblazer's character icon from the wiki since that shows both Caelus and Stelle on it.
        failures.push({ id, name, pathName });
      }
    }
  }

  const filePath = path.join(__datadir, "starrail", "characters.yaml");
  saveYaml({ content: characters, filePath, verbose });
  console.log("Character extraction complete.");
  return failures;
};

export default extractCharacters;
