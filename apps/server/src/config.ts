import { existsSync, readFileSync, writeFileSync } from "node:fs";

export interface ConfigType {
  admins: string[];
  maxUploadMbPerRoom: number;
}

export const defaultConfig: ConfigType = {
  admins: [],
  maxUploadMbPerRoom: 20,
};

export const loadConfig = () => {
  if (!existsSync("herb-config.json"))
    writeFileSync("herb-config.json", JSON.stringify(defaultConfig));
  const cfgFile = readFileSync("herb-config.json");
  return JSON.parse(cfgFile.toString()) as ConfigType;
};
