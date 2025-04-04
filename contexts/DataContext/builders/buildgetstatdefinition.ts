import { Misc, StatDefinition } from "@/types";

type retFn = (key: string) => StatDefinition;

export const buildGetStatDefinition = (misc: Misc): retFn => {
  const lookup = misc.stats.reduce<Record<string, StatDefinition>>((acc, x) => {
    acc[x.key] = x;
    return acc;
  }, {});

  return (key: string) => {
    const statDefinition = lookup[key];
    if (!statDefinition) {
      if (!statDefinition) {
        throw new Error(`Could not find stat with key ${key}.`);
      }
    }
    return statDefinition;
  };
};
