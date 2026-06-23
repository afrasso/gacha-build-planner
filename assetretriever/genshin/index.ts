import extract from "./extract";

export const retrieveAssets = async ({
  downloadIcons,
  ids,
  verbose,
}: {
  downloadIcons: boolean;
  ids?: string[];
  verbose: boolean;
}) => {
  await extract({
    downloadIcons,
    ids,
    verbose,
  });
};
