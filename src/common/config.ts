import { readFileSync, writeFile, accessSync, constants } from 'fs'
const confPath = ["config_dev.json", "congfig.json"];
let confFinalPath: string;
for (const key in confPath) {
  try {
    accessSync(confPath[key], constants.R_OK | constants.W_OK);
    confFinalPath = confPath[key];
    break;
  } catch {}
}
export const configInfo = JSON.parse(readFileSync(confFinalPath, "utf8"));
