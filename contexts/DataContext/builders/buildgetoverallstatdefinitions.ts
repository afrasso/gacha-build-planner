import { Misc, OverallStatDefinition } from "@/types";

type retFn = () => OverallStatDefinition[];

export const buildGetOverallStatDefinitions = (misc: Misc): retFn => {
  return () => misc.overallStats;
};
