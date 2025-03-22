import _ from "lodash";
import path from "path";
import { CharacterData as DBCharacterData, SkillLevel, StarRail } from "starrail.js";

import { CharacterData, MaxLvlStats } from "@/types/starrail";
import { __datadir } from "@/utils/directoryutils";
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

  const characters: CharacterData[] = [];
  const failures: FailedCharacterIconDownload[] = [];

  const client = new StarRail({});
  const dbCharacters: DBCharacterData[] = client.getAllCharacters();

  const pathIdToNameMap: Record<string, string> = {};

  // Skip Stelle and get data for Caelus only since it's identical.
  for (const dbCharacter of dbCharacters.filter(
    (dbCharacter) => dbCharacter.name.get("en") !== "{NICKNAME}" || dbCharacter.id % 2 === 1
  )) {
    const id = String(dbCharacter.id);
    const rawName = dbCharacter.name.get("en");
    const name = rawName === "{NICKNAME}" ? `Trailblazer` : rawName;
    const pathId = dbCharacter.path.id;
    const pathName = dbCharacter.path.name.get("en");
    if (!pathIdToNameMap[pathId]) {
      pathIdToNameMap[pathId] = pathName;
    }

    const dbMaxLvlStats = dbCharacter.getStatsByLevel(6, 80);
    const ATK = dbMaxLvlStats.find((dbStat) => dbStat.type === "BaseAttack")?.value;
    if (!ATK) {
      throw new Error(`Character ${name} (${id}) does not have a defined Base ATK.`);
    }
    const DEF = dbMaxLvlStats.find((dbStat) => dbStat.type === "BaseDefence")?.value;
    if (!DEF) {
      throw new Error(`Character ${name} (${id}) does not have a defined Base DEF.`);
    }
    const HP = dbMaxLvlStats.find((dbStat) => dbStat.type === "BaseHP")?.value;
    if (!HP) {
      throw new Error(`Character ${name} (${id}) does not have a defined Base HP.`);
    }
    const SPD = dbMaxLvlStats.find((dbStat) => dbStat.type === "BaseSpeed")?.value;
    if (!SPD) {
      throw new Error(`Character ${name} (${id}) does not have a defined Base SPD.`);
    }
    const maxLvlStats: MaxLvlStats = { ATK, DEF, HP, SPD };

    const statTraces = dbCharacter.skillTreeNodes
      .flatMap((node) => node.getSkillTreeNodeByLevel(new SkillLevel(node.maxLevel, 0)).stats)
      .reduce((acc, dbStat) => {
        const statKey = mapDbStatKey(dbStat.type);
        acc[statKey] = (acc[statKey] || 0) + dbStat.value;
        return acc;
      }, {} as Record<string, number>);

    const character = {
      combatType: dbCharacter.combatType.id,
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
      // Download all images from the wiki.
      failures.push({ id, name, pathName });
    }
  }

  const nameCounts: Record<string, number> = {};
  for (const character of characters) {
    if (!nameCounts[character.name]) {
      nameCounts[character.name] = 0;
    }
    nameCounts[character.name]++;
  }
  for (const character of characters) {
    if (nameCounts[character.name] > 1) {
      character.name = `${character.name} (${pathIdToNameMap[character.path]})`;
    }
  }

  const filePath = path.join(__datadir, "starrail", "characters.yaml");
  saveYaml({ content: characters, filePath, verbose });
  console.log("Character extraction complete.");
  return failures;
};

export default extractCharacters;
