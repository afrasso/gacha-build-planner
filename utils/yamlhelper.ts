import fs from "fs";
import yaml from "js-yaml";

export function loadYaml<T>(filePath: string): T {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents) as T;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error loading YAML file:", err.message);
    } else {
      console.error("Unknown error while loading YAML file:", err);
    }
    throw err;
  }
}

export function saveYaml<T>({
  content,
  filePath,
  verbose = false,
}: {
  content: T;
  filePath: string;
  verbose?: boolean;
}): void {
  try {
    const fileContents = yaml.dump(content);
    fs.writeFileSync(filePath, fileContents);
    if (verbose) {
      console.log(`Data saved as YAML to ${filePath}`);
    }
  } catch (err) {
    console.error(`Error occurred while saving YAML file: ${err}`);
    throw err;
  }
}
