// server/services/fileService.js
import fs from "fs";
import path from "path";

/**
 * Hilfsfunktion: Pfad relativ zum Projekt-Root auflösen
 */
function resolve(root, filePath) {
  return path.join(root, filePath);
}

/**
 * Kompakter, lazy-load-fähiger Dateibaum
 * 
 * root: Projekt-Root
 * basePath: relativer Pfad innerhalb des Projekts ("" = Root)
 */
export async function getTree(root, basePath = "") {
  const dirPath = path.join(root, basePath);

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  const result = [];

  for (const entry of entries) {
    const relPath = path.join(basePath, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      result.push({
        type: "folder",
        name: entry.name,
        path: relPath,
        // children werden NICHT mehr geladen → lazy loading
      });
    } else {
      result.push({
        type: "file",
        name: entry.name,
        path: relPath,
      });
    }
  }

  return result;
}

/**
 * Datei lesen
 */
export function readFile(root, filePath) {
  const full = resolve(root, filePath);
  return fs.readFileSync(full, "utf8");
}

/**
 * Datei schreiben
 */
export function writeFile(root, filePath, content) {
  const full = resolve(root, filePath);
  fs.writeFileSync(full, content, "utf8");
}

/**
 * Datei erstellen
 */
export function createFile(root, filePath) {
  const full = resolve(root, filePath);
  fs.writeFileSync(full, "", "utf8");
}

/**
 * Ordner erstellen
 */
export function createFolder(root, folderPath) {
  const full = resolve(root, folderPath);
  fs.mkdirSync(full, { recursive: true });
}

/**
 * Datei oder Ordner löschen
 */
export function deletePath(root, filePath) {
  const full = resolve(root, filePath);
  if (fs.statSync(full).isDirectory()) {
    fs.rmSync(full, { recursive: true, force: true });
  } else {
    fs.unlinkSync(full);
  }
}