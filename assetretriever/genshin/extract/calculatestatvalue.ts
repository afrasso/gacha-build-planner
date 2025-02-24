import { StatKey } from "@/types";

const calculateStatValue = ({ rawValue, stat }: { rawValue: number | undefined; stat: StatKey | undefined }) => {
  if (!stat || !rawValue) {
    return;
  }

  // Currently, all possible ascension stats or weapon main stats other than Elemental Masery are percentages, which are
  // stored in genshinDB as a fraction of 1.
  if (stat === StatKey.ELEMENTAL_MASTERY) {
    return rawValue;
  }
  return rawValue * 100;
};

export default calculateStatValue;
