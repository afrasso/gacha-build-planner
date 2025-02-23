import _ from "lodash";

import { FailedRelicSetIconDownload } from "../types";

const scrapeRelicSetIcons = ({
  failedRelicSetIconDownloads,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verbose,
}: {
  failedRelicSetIconDownloads: FailedRelicSetIconDownload[];
  verbose: boolean;
}) => {
  if (_.isEmpty(failedRelicSetIconDownloads)) {
    return;
  }

  const message = "Relic set icon scraping not implemented.";
  console.error(message);
  throw Error(message);
};

export default scrapeRelicSetIcons;
