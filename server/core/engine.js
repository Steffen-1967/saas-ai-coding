import fs from "fs";
import path from "path";
import { loadConfig } from "../services/configService.js";
import { globSync } from "glob";

const CONCURRENCY_LIMIT = 5;

// ---------------------------------------------------------
// 1. Dateien sammeln + Ignore anwenden
// ---------------------------------------------------------
export function collectFiles(config) {
  // Dateien anhand der Patterns sammeln
  let files = config.files.flatMap((pattern) => globSync(pattern));

  // Ignore-Patterns anwenden
  if (config.ignore) {
    const ignored = config.ignore.flatMap((pattern) => globSync(pattern));
    const ignoredSet = new Set(ignored.map((f) => path.resolve(f)));
    files = files.filter((f) => !ignoredSet.has(path.resolve(f)));
  }

  return files;
}

// ---------------------------------------------------------
// 2. Modell anhand Dateityp bestimmen
// ---------------------------------------------------------
export function getModelForFile(filePath, config) {
  const ext = path.extname(filePath);
  const fileTypes = config.fileTypes || {};

  for (const pattern in fileTypes) {
    if (pattern.endsWith(ext)) {
      return fileTypes[pattern].model;
    }
  }

  const firstModel = Object.values(fileTypes)[0]?.model;
  return firstModel || "meta-llama/llama-3-8b-instruct";
}

// ---------------------------------------------------------
// 3. KI-Request ausführen
// ---------------------------------------------------------
export async function runAIRequest(model, instruction, code) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost",
      "X-Title": "saas-ai-engine"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: instruction + "\n\n```ts\n" + code + "\n```"
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------------------------------------------------------
// 4. Eine Datei verarbeiten
// ---------------------------------------------------------
export async function processSingleFile(filePath, config, mode, dryRun) {
  const abs = path.join(process.cwd(), filePath);
  const original = fs.readFileSync(abs, "utf8");

  const instruction =
    config.modes?.[mode]?.instruction || config.instruction;

  const model = getModelForFile(filePath, config);

  const modified = await runAIRequest(model, instruction, original);

  if (!dryRun) {
    const backup = abs + ".bak";
    fs.writeFileSync(backup, original, "utf8");
    fs.writeFileSync(abs, modified, "utf8");
  }

  return { file: filePath, original, modified };
}

// ---------------------------------------------------------
// 5. Begrenzte Parallelität
// ---------------------------------------------------------
async function runWithConcurrencyLimit(files, handler) {
  let index = 0;

  async function worker() {
    while (index < files.length) {
      const file = files[index++];
      await handler(file);
    }
  }

  const workers = Array.from({ length: CONCURRENCY_LIMIT }, () => worker());
  await Promise.all(workers);
}

// ---------------------------------------------------------
// 6. Hauptfunktion: alle Dateien verarbeiten
// ---------------------------------------------------------
export async function processFiles(mode, dryRun = false) {
  const config = loadConfig();
  const files = collectFiles(config);

  const results = [];

  await runWithConcurrencyLimit(files, async (file) => {
    const result = await processSingleFile(file, config, mode, dryRun);
    results.push(result);
  });

  return results;
}

// ---------------------------------------------------------
// 7. Diff-Funktion für Web-UI
// ---------------------------------------------------------
export async function generateDiff(filePath, mode) {
  const config = loadConfig();
  const abs = path.join(process.cwd(), filePath);
  const original = fs.readFileSync(abs, "utf8");

  const instruction =
    config.modes?.[mode]?.instruction || config.instruction;

  const model = getModelForFile(filePath, config);
  const modified = await runAIRequest(model, instruction, original);

  return { original, modified };
}