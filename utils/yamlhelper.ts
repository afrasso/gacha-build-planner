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

export function saveYaml<T>(content: T, filePath: string): void {
  try {
    const fileContents = yaml.dump(content);
    fs.writeFileSync(filePath, fileContents);
    console.log(`Data saved as YAML to ${filePath}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error saving YAML file:", err.message);
    } else {
      console.error("Unknown error while saving YAML file:", err);
    }
    throw err;
  }
}
