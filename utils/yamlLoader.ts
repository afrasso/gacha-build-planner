import fs from "fs";
import yaml from "js-yaml";
import path from "path";

export function loadYaml<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return yaml.load(fileContents) as T;
}

export function writeYaml<T>(content: T, filename: string): void {
  const filePath = path.join(process.cwd(), "data", `${filename}-new.yaml`);
  const fileContents = yaml.dump(content);
  fs.writeFileSync(filePath, fileContents);
}
