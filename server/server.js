// server/server.js
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname in ES modules nachbauen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root-Pfad für API-Handler (immer korrekt, egal wo gestartet)
const API_ROOT = path.join(__dirname, "api");

// Hilfsfunktion: Datei existiert?
function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Wandelt /api/files/read → server/api/files/read.js um (Windows-kompatibel)
function resolveHandlerPath(reqUrl, hostHeader) {
  const parsed = new URL(reqUrl, `http://${hostHeader}`);
  const pathname = parsed.pathname;

  if (!pathname.startsWith("/api/")) return null;

  const relative = pathname.replace("/api/", "");

  // Windows-kompatibel normalisieren
  const handlerPath = path.join(API_ROOT, ...relative.split("/")) + ".js";

  // LOGGING
  console.log("reqUrl:", reqUrl);
  console.log("hostHeader:", hostHeader);
  console.log("pathname:", pathname);
  console.log("relative:", relative);
  console.log("handlerPath:", handlerPath);

  return fileExists(handlerPath) ? handlerPath : null;
}

// HTTP-Server
const server = http.createServer(async (req, res) => {
  try {
    const handlerPath = resolveHandlerPath(req.url, req.headers.host || "localhost");

    if (!handlerPath) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    const module = await import("file://" + handlerPath);

    if (!module.default || typeof module.default !== "function") {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Invalid handler" }));
      return;
    }

    await module.default(req, res);
  } catch (err) {
    console.error("Server error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

// Server starten
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});