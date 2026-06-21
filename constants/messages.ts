import { en } from "@/messages/en";
import { ArtifactMetric } from "@/types";

// Default locale; swap for i18n provider lookup later
const messages = en;

export const getArtifactMetricLabel = (metric: ArtifactMetric): string => messages.artifactMetric[metric].label;

export const getArtifactMetricDisplay = (metric: ArtifactMetric) => messages.artifactMetric[metric];

export const getHelpMessages = () => messages.help;

export const getNavMessages = () => messages.nav;
