import fs from "fs";

import downloadImage from "@/utils/downloadimage";

const dedupeUrls = (urls: (string | undefined)[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const url of urls) {
    if (!url || seen.has(url)) {
      continue;
    }
    seen.add(url);
    result.push(url);
  }
  return result;
};

const downloadImageWithFallback = async ({
  label,
  savePath,
  urls,
  verbose = false,
}: {
  label?: string;
  savePath: string;
  urls: (string | undefined)[];
  verbose?: boolean;
}): Promise<boolean> => {
  if (fs.existsSync(savePath)) {
    if (verbose) {
      const prefix = label ? `${label}: ` : "";
      console.log(`${prefix}Icon already exists at ${savePath}, skipping download.`);
    }
    return true;
  }

  const uniqueUrls = dedupeUrls(urls);

  for (const url of uniqueUrls) {
    try {
      await downloadImage({ savePath, url, verbose: false });
      if (verbose) {
        const prefix = label ? `${label}: ` : "";
        console.log(`${prefix}Downloaded icon to ${savePath} from ${url}`);
      }
      return true;
    } catch {
      // Try next source silently.
    }
  }

  console.warn(`Could not download icon for ${label ?? savePath} from any source.`);
  return false;
};

export default downloadImageWithFallback;
