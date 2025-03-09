import { Misc, OverallStatDefinition } from "@/types";

type retFn = (key: string) => OverallStatDefinition;

export const buildGetOverallStatDefinition = (misc: Misc): retFn => {
  const lookup = misc.overallStats.reduce<Record<string, OverallStatDefinition>>((acc, x) => {
    acc[x.key] = x;
    return acc;
  }, {});

  return (key: string) => {
    const overallStatDefinition = lookup[key];
    if (!overallStatDefinition) {
      if (!overallStatDefinition) {
        throw new Error(`Could not find overall stat with key ${key}.`);
      }
    }
    return overallStatDefinition;
  };
};
