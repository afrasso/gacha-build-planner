import { StatPropertyValue } from "starrail.js";

import { Stat } from "../types";
import mapDbTraceStatKey from "./mapdbtracestatkey";

const mapDbTraceStat = (dbTraceStat: StatPropertyValue): Stat => {
  return {
    key: mapDbTraceStatKey(dbTraceStat.type),
    value: dbTraceStat.value,
  };
};

export default mapDbTraceStat;
