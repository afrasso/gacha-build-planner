import { ArtifactType } from "./types";

const STATIC_API_BASE_URL = "https://vizualabstract.github.io/StarRailStaticAPI/assets";
const ENKA_HSR_BASE_URL = "https://enka.network/ui/hsr";
const MAR7TH_BASE_URL = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master";

const buildStaticApiUrl = (assetPath: string): string => `${STATIC_API_BASE_URL}/${assetPath}`;

const buildMar7thUrl = (assetPath: string): string => `${MAR7TH_BASE_URL}/${assetPath}`;

export const buildCharacterEnkaRoundIconUrl = (id: string): string =>
  `${ENKA_HSR_BASE_URL}/SpriteOutput/AvatarRoundIcon/Avatar/${id}.png`;

export const buildCharacterMar7thUrl = (id: string): string => buildMar7thUrl(`icon/character/${id}.png`);

export const buildCharacterStaticApiUrl = (id: string): string => buildStaticApiUrl(`icon/character/${id}.png`);

export const buildLightConeMar7thUrl = (id: string): string => buildMar7thUrl(`icon/light_cone/${id}.png`);

export const buildLightConeEnkaFiguresUrl = (id: string): string =>
  `${ENKA_HSR_BASE_URL}/SpriteOutput/LightConeFigures/${id}.png`;

export const buildLightConeStaticApiUrl = (id: string): string => buildStaticApiUrl(`icon/light_cone/${id}.png`);

const getRelicSlotIndex = (type: ArtifactType): number => {
  switch (type) {
    case ArtifactType.BODY:
      return 2;
    case ArtifactType.FOOT:
      return 3;
    case ArtifactType.HAND:
    case ArtifactType.OBJECT:
      return 1;
    case ArtifactType.HEAD:
    case ArtifactType.NECK:
      return 0;
    default:
      throw new Error(`Unexpected artifact type ${type} was encountered.`);
  }
};

export const buildRelicStaticApiUrl = ({ setId, type }: { setId: string; type: ArtifactType }): string =>
  buildStaticApiUrl(`icon/relic/${setId}_${getRelicSlotIndex(type)}.png`);

export const buildCharacterFallbackUrls = (id: string): string[] => [
  buildCharacterEnkaRoundIconUrl(id),
  buildCharacterMar7thUrl(id),
  buildCharacterStaticApiUrl(id),
];

export const buildLightConeFallbackUrls = (id: string): string[] => [
  buildLightConeMar7thUrl(id),
  buildLightConeEnkaFiguresUrl(id),
  buildLightConeStaticApiUrl(id),
];

export const buildRelicFallbackUrls = ({ setId, type }: { setId: string; type: ArtifactType }): string[] => [
  buildRelicStaticApiUrl({ setId, type }),
];

export const buildRelicSetFallbackUrls = ({
  hasArtifactTypes,
  setId,
}: {
  hasArtifactTypes: Partial<Record<ArtifactType, boolean>>;
  setId: string;
}): string[] => {
  if (hasArtifactTypes[ArtifactType.HEAD]) {
    return [buildRelicStaticApiUrl({ setId, type: ArtifactType.HEAD })];
  }
  if (hasArtifactTypes[ArtifactType.NECK]) {
    return [buildRelicStaticApiUrl({ setId, type: ArtifactType.NECK })];
  }
  return [buildStaticApiUrl(`icon/relic/${setId}_0.png`)];
};
