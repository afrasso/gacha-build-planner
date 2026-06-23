import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { buildArtifactIconUrls } from "@/assetretriever/genshin/buildiconurls";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImageWithFallback from "@/utils/downloadimagewithfallback";
import { saveYaml } from "@/utils/yamlhelper";

import getArtifactIconPath from "../getartifacticonpath";
import { ArtifactSet, ArtifactType, FailedArtifactIconDownload } from "../types";

const downloadArtifactIcon = async ({
  setId,
  setName,
  type,
  urls,
  verbose = false,
}: {
  setId: string;
  setName: string;
  type: ArtifactType;
  urls: string[];
  verbose?: boolean;
}): Promise<FailedArtifactIconDownload[]> => {
  const savePath = path.join(__publicdir, getArtifactIconPath({ id: setId, type }));
  const label = `${type} of ${setName} (${setId})`;
  const success = await downloadImageWithFallback({ label, savePath, urls, verbose });
  if (!success) {
    return [{ setId, setName, type }];
  }

  return [];
};

const extractArtifactSets = async ({
  downloadIcons = false,
  ids = [],
  verbose,
}: {
  downloadIcons?: boolean;
  ids?: string[];
  verbose: boolean;
}) => {
  console.log("Extracting artifact sets...");

  const artifactSets: ArtifactSet[] = [];
  const failures: FailedArtifactIconDownload[] = [];

  const dbArtifactSets: genshindb.Artifact[] = _.uniq(genshindb.artifacts("names", { matchCategories: true }))
    .map((artifactSetName) => genshindb.artifacts(artifactSetName))
    .filter((artifactSet): artifactSet is genshindb.Artifact => artifactSet !== undefined);

  for (const dbArtifactSet of dbArtifactSets) {
    const id = String(dbArtifactSet.id);
    const name = dbArtifactSet.name;
    const setBonusCounts: number[] = [];
    if (dbArtifactSet.effect1Pc) {
      setBonusCounts.push(1);
    }
    if (dbArtifactSet.effect2Pc) {
      setBonusCounts.push(2);
    }
    if (dbArtifactSet.effect4Pc) {
      setBonusCounts.push(4);
    }

    artifactSets.push({
      hasArtifactTypes: {
        [ArtifactType.CIRCLET]: !!dbArtifactSet.circlet,
        [ArtifactType.FLOWER]: !!dbArtifactSet.flower,
        [ArtifactType.GOBLET]: !!dbArtifactSet.goblet,
        [ArtifactType.PLUME]: !!dbArtifactSet.plume,
        [ArtifactType.SANDS]: !!dbArtifactSet.sands,
      },
      iconUrl: getArtifactIconPath({ id, type: ArtifactType.FLOWER }),
      iconUrls: Object.values(ArtifactType).reduce((acc, type) => {
        acc[type] = getArtifactIconPath({ id, type });
        return acc;
      }, {} as Record<ArtifactType, string>),
      id,
      name: dbArtifactSet.name,
      rarities: dbArtifactSet.rarityList,
      setBonusCounts,
    });

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      if (dbArtifactSet.circlet) {
        failures.push(
          ...(await downloadArtifactIcon({
            setId: id,
            setName: name,
            type: ArtifactType.CIRCLET,
            urls: buildArtifactIconUrls(dbArtifactSet.images, "circlet"),
            verbose,
          }))
        );
      }
      if (dbArtifactSet.flower) {
        failures.push(
          ...(await downloadArtifactIcon({
            setId: id,
            setName: name,
            type: ArtifactType.FLOWER,
            urls: buildArtifactIconUrls(dbArtifactSet.images, "flower"),
            verbose,
          }))
        );
      }
      if (dbArtifactSet.goblet) {
        failures.push(
          ...(await downloadArtifactIcon({
            setId: id,
            setName: name,
            type: ArtifactType.GOBLET,
            urls: buildArtifactIconUrls(dbArtifactSet.images, "goblet"),
            verbose,
          }))
        );
      }
      if (dbArtifactSet.plume) {
        failures.push(
          ...(await downloadArtifactIcon({
            setId: id,
            setName: name,
            type: ArtifactType.PLUME,
            urls: buildArtifactIconUrls(dbArtifactSet.images, "plume"),
            verbose,
          }))
        );
      }
      if (dbArtifactSet.sands) {
        failures.push(
          ...(await downloadArtifactIcon({
            setId: id,
            setName: name,
            type: ArtifactType.SANDS,
            urls: buildArtifactIconUrls(dbArtifactSet.images, "sands"),
            verbose,
          }))
        );
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "artifactsets.yaml");
  saveYaml({ content: artifactSets, filePath });
  console.log("Artifact set extraction complete.");
  return failures;
};

export default extractArtifactSets;
