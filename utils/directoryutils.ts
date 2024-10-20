import path from "path";
import { fileURLToPath } from "url";

// Get the full path of the current file.
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file.
const __dirname = path.dirname(__filename);

// Get the directory of index.js. This only works if this file does not move.
export const __rootDirname = path.resolve(__dirname, "../");
export const __datadir = path.resolve(__rootDirname, "data");
export const __publicdir = path.resolve(__rootDirname, "public");
