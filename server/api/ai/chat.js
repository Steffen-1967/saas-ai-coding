// server/api/ai/chat.js
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

    const { message, contextFile } = await readJsonBody(req);
    if (!message) return sendJson(res, 400, { error: "Missing 'message'" });

    const result = await aiService.chat({
      projectRoot: root,
      message,
      contextFile: contextFile || null,
    });

    // result könnte z.B. { reply, actions } sein
    return sendJson(res, 200, result);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "AI chat failed" });
  }
}