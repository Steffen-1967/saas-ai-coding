// server/api/ai/edit.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as configService from "../../services/configService.js";
import * as aiService from "../../services/aiService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) return sendJson(res, 400, { error: "No project open" });

    const { path, instructions } = await readJsonBody(req);
    if (!path || !instructions) {
      return sendJson(res, 400, { error: "Missing 'path' or 'instructions'" });
    }

    const result = await aiService.editFile({
      projectRoot: root,
      path,
      instructions,
    });

    return sendJson(res, 200, result);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "AI edit failed" });
  }
}