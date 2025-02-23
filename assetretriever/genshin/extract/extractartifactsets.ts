import genshindb from "genshin-db";
import _ from "lodash";
import path from "path";

import { ArtifactType } from "@/types";
import { __datadir, __publicdir } from "@/utils/directoryutils";
import downloadImage from "@/utils/downloadimage";
import { saveYaml } from "@/utils/yamlhelper";

import getArtifactIconPath from "../getartifacticonpath";
import { FailedArtifactIconDownload } from "../types";

const downloadArtifactIcon = async ({
  id,
  name,
  type,
  url,
  verbose = false,
}: {
  id: string;
  name: string;
  type: ArtifactType;
  url?: string;
  verbose?: boolean;
}): Promise<FailedArtifactIconDownload[]> => {
  if (!url) {
    return [{ setId: id, setName: name, type }];
  }

  if (!url) {
    console.warn(`Icon URL for artifact "${name} (${id}) of type ${type} does not exist."`);
    return [{ setId: id, setName: name, type }];
  }

  const savePath = path.join(__publicdir, getArtifactIconPath({ id, type }));
  if (verbose) {
    console.log(`Downloading ${type} for artifact set "${name}" (${id}) from ${url}.`);
  }
  try {
    await downloadImage({ savePath, url, verbose });
  } catch (err) {
    console.warn(`Error downloading ${type} for artifact set "${name}" (${id}): ${err}`);
    return [{ setId: id, setName: name, type }];
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

  const artifactSets = [];
  const failures: FailedArtifactIconDownload[] = [];

  const dbArtifactSets: genshindb.Artifact[] = _.uniq(genshindb.artifacts("names", { matchCategories: true }))
    .map((artifactSetName) => genshindb.artifacts(artifactSetName))
    .filter((artifactSet): artifactSet is genshindb.Artifact => artifactSet !== undefined);

  for (const dbArtifactSet of dbArtifactSets) {
    const id = String(dbArtifactSet.id);
    const name = dbArtifactSet.name;

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
    });

    if (downloadIcons && (_.isEmpty(ids) || ids.includes(id))) {
      if (dbArtifactSet.circlet) {
        const url = dbArtifactSet.images.mihoyo_circlet;
        const type = ArtifactType.CIRCLET;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.flower) {
        const url = dbArtifactSet.images.mihoyo_flower;
        const type = ArtifactType.FLOWER;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.goblet) {
        const url = dbArtifactSet.images.mihoyo_goblet;
        const type = ArtifactType.GOBLET;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.plume) {
        const url = dbArtifactSet.images.mihoyo_plume;
        const type = ArtifactType.PLUME;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
      if (dbArtifactSet.sands) {
        const url = dbArtifactSet.images.mihoyo_sands;
        const type = ArtifactType.SANDS;
        failures.push(...(await downloadArtifactIcon({ id, name, type, url, verbose })));
      }
    }
  }

  const filePath = path.join(__datadir, "genshin", "artifactsets.yaml");
  saveYaml({ content: artifactSets, filePath });
  console.log("Artifact set extraction complete.");
  return failures;
};

export default extractArtifactSets;
