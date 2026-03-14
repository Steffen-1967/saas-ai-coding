// server/api/files/delete.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as configService from "../../services/configService.js";
import * as fileService from "../../services/fileService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) return sendJson(res, 400, { error: "No project open" });

    const { path } = await readJsonBody(req);
    if (!path) return sendJson(res, 400, { error: "Missing 'path'" });

    await fileService.deletePath(root, path);
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to delete" });
  }
}