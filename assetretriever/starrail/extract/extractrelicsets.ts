import _ from "lodash";
import path from "path";
import { ImageAssets, StarRail } from "starrail.js";

import { buildRelicFallbackUrls, buildRelicSetFallbackUrls } from "@/assetretriever/starrail/buildstaticapiurls";
import downloadStarrailIcon from "@/assetretriever/starrail/downloadstarrailicon";
import { __datadir, __publicdir } from "@/utils/directoryutils";
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
  icon,
  setId,
  setIds,
  setName,
  type,
  verbose,
}: {
  downloadIcons: boolean;
  failures: FailedRelicIconDownload[];
  icon: ImageAssets;
  setId: string;
  setIds: string[];
  setName: string;
  type: ArtifactType;
  verbose: boolean;
}) => {
  if (downloadIcons && (_.isEmpty(setIds) || setIds.includes(setId))) {
    const savePath = path.join(__publicdir, "starrail", "relics", `${setId}${getRelicIconSuffix(type)}.png`);
    const label = `${type} of ${setName} (${setId})`;
    const success = await downloadStarrailIcon({
      explicitFallbackUrls: buildRelicFallbackUrls({ setId, type }),
      icon,
      label,
      savePath,
      verbose,
    });
    if (!success) {
      failures.push({ setId, setName, type });
    }
  }
};

const downloadRelicSetIcon = async ({
  downloadIcons,
  failures,
  hasArtifactTypes,
  icon,
  id,
  ids,
  name,
  type: _type,
  verbose,
}: {
  downloadIcons: boolean;
  failures: FailedRelicSetIconDownload[];
  hasArtifactTypes: Partial<Record<ArtifactType, boolean>>;
  icon: ImageAssets;
  id: string;
  ids: string[];
  name: string;
  type: ArtifactType;
  verbose: boolean;
}) => {
  if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
    const savePath = path.join(__publicdir, "starrail", "relicsets", `${id}.png`);
    const label = `${name} (${id})`;
    const success = await downloadStarrailIcon({
      explicitFallbackUrls: buildRelicSetFallbackUrls({ hasArtifactTypes, setId: id }),
      icon,
      label,
      savePath,
      verbose,
    });
    if (!success) {
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
        hasArtifactTypes: { [type]: true },
        icon: set.icon,
        id: setId,
        ids,
        name: setName,
        type,
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
      icon: dbRelic.icon,
      setId,
      setIds: ids,
      setName,
      type,
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
