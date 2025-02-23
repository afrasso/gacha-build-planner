import _ from "lodash";
import path from "path";
import { StarRail } from "starrail.js";

import { ArtifactSet, ArtifactType } from "@/types/starrail";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import { FailedRelicIconDownload, FailedRelicSetIconDownload } from "../types";
import getRelicIconSuffix from "./getreliciconsuffix";

const extractRelicSets = async ({
  client,
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  client: StarRail;
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}): Promise<{ failures: FailedRelicIconDownload[]; setFailures: FailedRelicSetIconDownload[] }> => {
  console.log("Extracting relic sets...");

  const relicSetHash = {} as Record<string, Partial<ArtifactSet<ArtifactType>>>;
  const failures: FailedRelicIconDownload[] = [];
  const setFailures: FailedRelicSetIconDownload[] = [];

  const dbRelics = client.getAllRelics();
  for (const dbRelic of dbRelics) {
    const set = dbRelic.set;
    const setId = String(set.id);
    const setName = dbRelic.name.get("en");
    const type = dbRelic.type.id as ArtifactType;
    if (!relicSetHash[setId]) {
      const relicSet: ArtifactSet<ArtifactType> = {
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
            console.log(`Downloading icon for relic set "${setName}" (${setId}) from ${setUrl}`);
          }
          await downloadImage({
            savePath: path.join(__publicdir, "starrail", "relicsets", `${setId}.png`),
            url: setUrl,
            verbose,
          });
        } catch (err) {
          console.error(`Error downloading icon for relic set ${setName} (${setId}): ${err}`);
          setFailures.push({ id: setId, name: setName });
        }
      }
    }

    const relicSet = relicSetHash[setId]!;
    relicSet.hasArtifactTypes![type] = true;
    if (!relicSet.rarities!.includes(dbRelic.stars)) {
      relicSet.rarities!.push(dbRelic.stars);
    }

    const url = dbRelic.icon.url;
    if (downloadIcons && (_.isEmpty(ids) || ids.includes(setId)) && url) {
      const suffix = getRelicIconSuffix(type);
      try {
        if (verbose) {
          console.log(`Downloading icon for relic of type ${type} from set "${setName}" (${setId}) from ${url}.`);
        }
        await downloadImage({
          savePath: path.join(__publicdir, "starrail", "relics", `${setId}${suffix}.png`),
          url,
          verbose,
        });
      } catch (err) {
        console.error(`Error downloading icon for relic of type ${type} from set ${setName} (${setId}).`, err);
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
