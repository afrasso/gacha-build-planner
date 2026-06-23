const ENKA_BASE_URL = "https://enka.network/ui";

const buildEnkaUrl = (filename?: string): string | undefined => {
  if (!filename) {
    return undefined;
  }
  return `${ENKA_BASE_URL}/${filename}.png`;
};

export const buildCharacterIconUrls = (images: {
  filename_icon?: string;
  mihoyo_icon?: string;
}): string[] => [images.mihoyo_icon, buildEnkaUrl(images.filename_icon)].filter((url): url is string => !!url);

export const buildWeaponIconUrls = (images: {
  filename_awakenIcon?: string;
  filename_icon?: string;
  mihoyo_awakenIcon?: string;
  mihoyo_icon?: string;
}): string[] =>
  [
    images.mihoyo_awakenIcon,
    images.mihoyo_icon,
    buildEnkaUrl(images.filename_awakenIcon),
    buildEnkaUrl(images.filename_icon),
  ].filter((url): url is string => !!url);

export const buildArtifactIconUrls = (
  images: {
    filename_circlet?: string;
    filename_flower?: string;
    filename_goblet?: string;
    filename_plume?: string;
    filename_sands?: string;
    mihoyo_circlet?: string;
    mihoyo_flower?: string;
    mihoyo_goblet?: string;
    mihoyo_plume?: string;
    mihoyo_sands?: string;
  },
  slot: "circlet" | "flower" | "goblet" | "plume" | "sands"
): string[] => {
  const mihoyoKey = `mihoyo_${slot}` as const;
  const filenameKey = `filename_${slot}` as const;
  return [images[mihoyoKey], buildEnkaUrl(images[filenameKey])].filter((url): url is string => !!url);
};
