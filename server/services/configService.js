// server/services/configService.js
import fs from "fs";
import path from "path";

let projectRoot = null;

export function setProjectRoot(rootPath) {
  projectRoot = rootPath;
}

export function getProjectRoot() {
  return projectRoot;
}

export function getConfigPath() {
  if (!projectRoot) throw new Error("No project root set");
  return path.join(projectRoot, "saas-ai-coding.config.json");
}

export function loadConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) return {};
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

export function saveConfig(config) {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}