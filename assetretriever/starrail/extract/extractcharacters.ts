import _ from "lodash";
import path from "path";
import { CharacterData, SkillLevel, StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedCharacterIconDownload } from "../types";
import mapDbBaseStat from "./mapdbbasestat";
import mapDbTraceStat from "./mapdbtracestat";

const extractCharacters = async ({
  client,
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  client: StarRail;
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<FailedCharacterIconDownload[]> => {
  console.log("Extracting characters...");

  const characters = [];
  const failures: FailedCharacterIconDownload[] = [];

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
      const stat = mapDbBaseStat(dbStat);
      acc[stat.key] = stat.value;
      return acc;
    }, {} as Record<string, number>);

    const statTraces = dbCharacter.skillTreeNodes
      .flatMap((node) => node.getSkillTreeNodeByLevel(new SkillLevel(node.maxLevel, 0)).stats)
      .reduce((acc, dbStat) => {
        const stat = mapDbTraceStat(dbStat);
        acc[stat.key] = (acc[stat.key] || 0) + stat.value;
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

    const url = dbCharacter.icon.url;
    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      if (url && name !== "Trailblazer") {
        try {
          if (verbose) {
            console.log(`Downloading icon for character "${name}" of path ${pathName} (${id}) from ${url}.`);
          }
          await downloadImage({
            savePath: path.join(__publicdir, "starrail", "characters", `${id}.png`),
            url,
            verbose,
          });
        } catch (err) {
          console.error(`Error downloading icon for character "${name}" of path ${pathName} (${id}): ${err}`);
          failures.push({ id, name, pathName });
        }
      } else if (name === "Trailblazer") {
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
