import _ from "lodash";
import path from "path";
import { StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import { ArtifactSet, ArtifactType, FailedRelicIconDownload, FailedRelicSetIconDownload } from "../types";
import getRelicIconSuffix from "./getreliciconsuffix";

const extractRelicSets = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<{ failures: FailedRelicIconDownload[]; setFailures: FailedRelicSetIconDownload[] }> => {
  console.log("Extracting relic sets...");

  const relicSetHash = {} as Record<string, Partial<ArtifactSet>>;
  const failures: FailedRelicIconDownload[] = [];
  const setFailures: FailedRelicSetIconDownload[] = [];

  const client = new StarRail({});
  const dbRelics = client.getAllRelics();
  for (const dbRelic of dbRelics) {
    const set = dbRelic.set;
    const setId = String(set.id);
    const setName = dbRelic.name.get("en");
    const type = dbRelic.type.id as ArtifactType;
    if (!relicSetHash[setId]) {
      const relicSet: ArtifactSet = {
        hasArtifactTypes: {
          [ArtifactType.BODY]: false,
          [ArtifactType.FOOT]: false,
          [ArtifactType.HAND]: false,
          [ArtifactType.HEAD]: false,
          [ArtifactType.NECK]: false,
          [ArtifactType.OBJECT]: false,
        },
        iconUrl: `/starrail/relicsets/${setId}.png`,
        iconUrls: {
          [ArtifactType.BODY]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.BODY)}.png`,
          [ArtifactType.FOOT]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.FOOT)}.png`,
          [ArtifactType.HAND]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.HAND)}.png`,
          [ArtifactType.HEAD]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.HEAD)}.png`,
          [ArtifactType.NECK]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.NECK)}.png`,
          [ArtifactType.OBJECT]: `/starrail/relics/${setId}${getRelicIconSuffix(ArtifactType.OBJECT)}.png`,
        },
        id: setId,
        name: setName,
        rarities: [],
      };
      relicSetHash[setId] = relicSet;

      const setUrl = set.icon.url;
      if (downloadIcons && (_.isEmpty(ids) || ids.includes(setId)) && setUrl) {
        try {
          if (verbose) {
            console.log(`Downloading icon for ${setName} (${setId}) from ${setUrl}`);
          }
          await downloadImage({
            savePath: path.join(__publicdir, "starrail", "relicsets", `${setId}.png`),
            url: setUrl,
            verbose,
          });
        } catch (err) {
          console.warn(`Error downloading icon for ${setName} (${setId}): ${err}`);
          setFailures.push({ id: setId, name: setName });
        }
      }
    }

    const relicSet = relicSetHash[setId]!;
    relicSet.hasArtifactTypes![type] = true;
    if (!relicSet.rarities!.includes(dbRelic.stars)) {
      relicSet.rarities!.push(dbRelic.stars);
    }

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(setId))) {
      const url = dbRelic.icon.url;
      const savePath = path.join(__publicdir, "starrail", "relics", `${setId}${getRelicIconSuffix(type)}.png`);
      if (verbose) {
        console.log(`Downloading icon for ${type} of ${setName} (${setId}) from ${url}.`);
      }
      try {
        await downloadImage({ savePath, url, verbose });
      } catch (err) {
        console.warn(`Error downloading icon for ${type} of ${setName} (${setId}).`, err);
        failures.push({ setId, setName, type });
      }
    }
  }

  const relicSets = Object.values(relicSetHash);
  const filePath = path.join(__datadir, "starrail", "relicsets.yaml");
  saveYaml({ content: relicSets, filePath, verbose });
  console.log("Relic set extraction complete.");
  return { failures, setFailures };
};

export default extractRelicSets;
