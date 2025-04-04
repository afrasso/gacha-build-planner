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
  const {
    failedCharacterIconDownloads,
    failedLightConeIconDownloads,
    failedRelicIconDownloads,
    failedRelicSetIconDownloads,
  } = await extract({
    downloadIcons,
    ids,
    verbose,
  });
  await scrapeWiki({
    failedCharacterIconDownloads,
    failedLightConeIconDownloads,
    failedRelicIconDownloads,
    failedRelicSetIconDownloads,
    verbose,
  });
};
