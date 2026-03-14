#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { loadConfig } from "./server/services/configService.js";
import { processFiles } from "./server/core/engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("Fehler: Bitte setze die Umgebungsvariable OPENROUTER_API_KEY.");
  process.exit(1);
}

// ---------------------------------------------------------
// CLI-Argumente auswerten
// ---------------------------------------------------------
const [, , ...args] = process.argv;

// ---------------------------------------------------------
// Hilfe anzeigen (--help / -h)
// ---------------------------------------------------------
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
saas-ai-coding – KI-gestützte Codeverarbeitung

Verwendung:
  saas-ai-coding [modus] [files] [flags]

Modi:
  default     Standardmodus (Verbesserung & Lesbarkeit)
  refactor    Refaktoriert Code für bessere Struktur
  docs        Erstellt Dokumentation
  optimize    Optimiert Code für Performance
  explain     Erklärt den Code ausführlich

Files:
  Relativer Pfad zu einer Datei, Leerzeichen getrellte Dateilist oder Ordner.
  Beispiele:  src/index.ts
              server/routes/files.js server/routes/processes.js
              src/**/*.js

Flags:
  --dry       Führt einen Testlauf aus, ohne Dateien zu überschreiben
  --help, -h  Zeigt diese Hilfe an

Beispiele:
  saas-ai-coding refactor
  saas-ai-coding docs --dry
  saas-ai-coding optimize
  saas-ai-coding explain src/index.ts
  `);
  process.exit(0);
}

let dryRun = false;
let mode = null;

// Dry-Run Flag
const dryIndex = args.indexOf("--dry");
if (dryIndex !== -1) {
  dryRun = true;
  args.splice(dryIndex, 1);
  console.log("🧪 Dry‑Run aktiviert — keine Dateien werden überschrieben.\n");
}

// Config laden
const config = loadConfig();

// Modus erkennen
if (args.length > 0 && config.modes && config.modes[args[0]]) {
  mode = args.shift();
  console.log(`🎛️ Modus aktiviert: ${mode}`);
}

// Falls kein Modus angegeben → Standardmodus
if (!mode) {
  mode = "default";
  console.log("ℹ️ Kein Modus angegeben — Standardmodus wird verwendet.");
}

// ---------------------------------------------------------
// CLI starten
// ---------------------------------------------------------
async function run() {
  console.log(`🚀 Starte Verarbeitung im Modus: ${mode}`);
  console.log(`📁 Dry‑Run: ${dryRun ? "Ja" : "Nein"}`);
  console.log("");

  const results = await processFiles(mode, dryRun);

  console.log("\n🎉 Fertig! Ergebnisse:");
  for (const r of results) {
    console.log(`- ${r.file} ${dryRun ? "(Dry‑Run)" : "(überschrieben)"}`);
  }
}

run().catch((err) => {
  console.error("❌ Unerwarteter Fehler:", err);
  process.exit(1);
});