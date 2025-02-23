import _ from "lodash";

import { FailedRelicIconDownload } from "../types";

const scrapeRelicIcons = ({
  failedRelicIconDownloads,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verbose,
}: {
  failedRelicIconDownloads: FailedRelicIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedRelicIconDownloads)) {
    return;
  }

  const message = "Relic icon scraping not implemented.";
  console.error(message);
  throw Error(message);
};

export default scrapeRelicIcons;
