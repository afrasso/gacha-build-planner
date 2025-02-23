import Ajv from "ajv";
import addFormats from "ajv-formats";

export * from "./artifact";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
