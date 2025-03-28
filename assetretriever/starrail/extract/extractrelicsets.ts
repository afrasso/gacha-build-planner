import _ from "lodash";
import path from "path";
import { StarRail } from "starrail.js";

import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import {
  ArtifactSet,
  ArtifactSetCategory,
  ArtifactType,
  FailedRelicIconDownload,
  FailedRelicSetIconDownload,
} from "../types";
import getRelicIconSuffix from "./getreliciconsuffix";

const determineCategory = (relicSet: ArtifactSet): ArtifactSet => {
  if (
    relicSet.hasArtifactTypes[ArtifactType.HEAD] &&
    relicSet.hasArtifactTypes[ArtifactType.HAND] &&
    relicSet.hasArtifactTypes[ArtifactType.BODY] &&
    relicSet.hasArtifactTypes[ArtifactType.FOOT]
  ) {
    relicSet.category = ArtifactSetCategory.CAVERN_RELIC;
  } else if (relicSet.hasArtifactTypes[ArtifactType.NECK] && relicSet.hasArtifactTypes[ArtifactType.OBJECT]) {
    relicSet.category = ArtifactSetCategory.PLANAR_ORNAMENT;
  } else {
    throw new Error(`Error categorizing relic set ${relicSet.name} (${relicSet.id}).`);
  }
  return relicSet;
};

const downloadRelicIcon = async ({
  downloadIcons,
  failures,
  setId,
  setIds,
  setName,
  type,
  url,
  verbose,
}: {
  downloadIcons: boolean;
  failures: FailedRelicIconDownload[];
  setId: string;
  setIds: string[];
  setName: string;
  type: ArtifactType;
  url: string;
  verbose: boolean;
}) => {
  if (downloadIcons && (_.isEmpty(setIds) || setIds.includes(setId))) {
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
};

const downloadRelicSetIcon = async ({
  downloadIcons,
  failures,
  id,
  ids,
  name,
  url,
  verbose,
}: {
  downloadIcons: boolean;
  failures: FailedRelicSetIconDownload[];
  id: string;
  ids: string[];
  name: string;
  url: string;
  verbose: boolean;
}) => {
  if (downloadIcons && (_.isEmpty(ids) || ids.includes(id)) && url) {
    try {
      if (verbose) {
        console.log(`Downloading icon for ${name} (${id}) from ${url}`);
      }
      await downloadImage({
        savePath: path.join(__publicdir, "starrail", "relicsets", `${id}.png`),
        url,
        verbose,
      });
    } catch (err) {
      console.warn(`Error downloading icon for ${name} (${id}): ${err}`);
      failures.push({ id, name });
    }
  }
};

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

  const relicSetHash: Record<string, ArtifactSet> = {};
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
      const setBonusCounts = set.setBonus.map((setBonus) => setBonus.needCount);

      initializeRelicSetHash({ id: setId, name: setName, relicSetHash, setBonusCounts });
      await downloadRelicSetIcon({
        downloadIcons,
        failures: setFailures,
        id: setId,
        ids,
        name: setName,
        url: set.icon.url,
        verbose,
      });
    }

    const relicSet = relicSetHash[setId]!;
    relicSet.hasArtifactTypes![type] = true;
    if (!relicSet.rarities!.includes(dbRelic.stars)) {
      relicSet.rarities!.push(dbRelic.stars);
    }

    await downloadRelicIcon({
      downloadIcons,
      failures,
      setId,
      setIds: ids,
      setName,
      type,
      url: dbRelic.icon.url,
      verbose,
    });
  }

  const relicSets = Object.values(relicSetHash).map(determineCategory);
  const filePath = path.join(__datadir, "starrail", "relicsets.yaml");
  saveYaml({ content: relicSets, filePath, verbose });
  console.log("Relic set extraction complete.");
  return { failures, setFailures };
};

const initializeRelicSetHash = ({
  id,
  name,
  relicSetHash,
  setBonusCounts,
}: {
  id: string;
  name: string;
  relicSetHash: Record<string, Partial<ArtifactSet>>;
  setBonusCounts: number[];
}) => {
  const relicSet: ArtifactSet = {
    hasArtifactTypes: {
      [ArtifactType.BODY]: false,
      [ArtifactType.FOOT]: false,
      [ArtifactType.HAND]: false,
      [ArtifactType.HEAD]: false,
      [ArtifactType.NECK]: false,
      [ArtifactType.OBJECT]: false,
    },
    iconUrl: `/starrail/relicsets/${id}.png`,
    iconUrls: {
      [ArtifactType.BODY]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.BODY)}.png`,
      [ArtifactType.FOOT]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.FOOT)}.png`,
      [ArtifactType.HAND]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.HAND)}.png`,
      [ArtifactType.HEAD]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.HEAD)}.png`,
      [ArtifactType.NECK]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.NECK)}.png`,
      [ArtifactType.OBJECT]: `/starrail/relics/${id}${getRelicIconSuffix(ArtifactType.OBJECT)}.png`,
    },
    id,
    name,
    rarities: [],
    setBonusCounts,
  };
  relicSetHash[id] = relicSet;
};

export default extractRelicSets;
