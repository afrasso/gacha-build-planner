import { Misc, StatDefinition } from "@/types";

type retFn = () => StatDefinition[];

export const buildGetStatDefinitions = (misc: Misc): retFn => {
  return () => misc.stats;
};
