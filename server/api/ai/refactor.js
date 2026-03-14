// server/api/ai/refactor.js
import { sendJson, readJsonBody } from "../_utils.js";
import * * as configService from "../../services/configService.js";
import * as aiService from "../../services/aiService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) return sendJson(res, 400, { error: "No project open" });

    const { path, functionName } = await readJsonBody(req);
    if (!path || !functionName) {
      return sendJson(res, 400, { error: "Missing 'path' or 'functionName'" });
    }

    const result = await aiService.refactor({
      projectRoot: root,
      path,
      functionName,
    });

    return sendJson(res, 200, result);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "AI refactor failed" });
  }
}