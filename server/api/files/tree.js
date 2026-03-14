// server/api/files/tree.js
import { sendJson } from "../_utils.js";
import * as configService from "../../services/configService.js";
import * as fileService from "../../services/fileService.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) {
      return sendJson(res, 400, { error: "No project open" });
    }

    // Moderne URL-API
    const parsed = new URL(req.url, `http://${req.headers.host}`);

    // Optionaler Query-Parameter: ?path=src/components
    const basePath = parsed.searchParams.get("path") || "";

    // Lazy Loading: Nur diesen Ordner laden
    const items = await fileService.getTree(root, basePath);

    return sendJson(res, 200, {
      path: basePath,
      items
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to load file tree" });
  }
}