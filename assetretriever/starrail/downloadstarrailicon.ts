import { ImageAssets } from "starrail.js";

import downloadImageWithFallback from "@/utils/downloadimagewithfallback";

const SKIPPED_ICON_URL_PATTERNS = [/yatta\.top/i, /FortOfFans\/HSR/i];

const isSkippedIconUrl = (url: string): boolean => SKIPPED_ICON_URL_PATTERNS.some((pattern) => pattern.test(url));

const collectImageAssetUrls = (icon: ImageAssets): string[] => {
  const urls: string[] = [];
  let asset: ImageAssets | null = icon;

  while (asset) {
    if (asset.isAvailable && asset.url && !isSkippedIconUrl(asset.url)) {
      urls.push(asset.url);
    }
    asset = asset.nextSource();
  }

  return urls;
};

const downloadStarrailIcon = async ({
  explicitFallbackUrls = [],
  icon,
  label,
  savePath,
  verbose = false,
}: {
  explicitFallbackUrls?: string[];
  icon: ImageAssets;
  label?: string;
  savePath: string;
  verbose?: boolean;
}): Promise<boolean> => {
  const urls = [...collectImageAssetUrls(icon), ...explicitFallbackUrls];
  return downloadImageWithFallback({ label, savePath, urls, verbose });
};

export default downloadStarrailIcon;
