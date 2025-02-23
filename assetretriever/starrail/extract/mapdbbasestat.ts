import { StatPropertyValue } from "starrail.js";

import { Stat } from "../types";
import mapDbBaseStatKey from "./mapdbbasestatkey";

const mapDbBaseStat = (dbBaseStat: StatPropertyValue): Stat => {
  return {
    key: mapDbBaseStatKey(dbBaseStat.type),
    value: dbBaseStat.value,
  };
};

export default mapDbBaseStat;
