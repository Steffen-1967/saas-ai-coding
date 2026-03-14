// server/api/files/read.js
import { sendJson } from "../_utils.js";
import * as configService from "../../services/configService.js";
import * as fileService from "../../services/fileService.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) return sendJson(res, 400, { error: "No project open" });

    const parsed = new URL(req.url, `http://${req.headers.host}`);
    const filePath = parsed.searchParams.get("path");

    if (!filePath) return sendJson(res, 400, { error: "Missing 'path'" });

    const content = await fileService.readFile(root, filePath);
    return sendJson(res, 200, { path: filePath, content });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to read file" });
  }
}