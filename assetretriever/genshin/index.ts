import extract from "./extract";
import scrapeWiki from "./scrapewiki";

export const retrieveAssets = async ({
  downloadIcons,
  ids,
  verbose,
}: {
  downloadIcons: boolean;
  ids?: string[];
  verbose: boolean;
}) => {
  const { failedArtifactIconDownloads, failedCharacterIconDownloads, failedWeaponIconDownloads } = await extract({
    downloadIcons,
    ids,
    verbose,
  });
  await scrapeWiki({
    artifacts: failedArtifactIconDownloads,
    characters: failedCharacterIconDownloads,
    verbose,
    weapons: failedWeaponIconDownloads,
  });
};
