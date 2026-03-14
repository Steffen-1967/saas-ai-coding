// server/api/process/run.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as processService from "../../services/processService.js";
import * as configService from "../../services/configService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) return sendJson(res, 400, { error: "No project open" });

    const { command } = await readJsonBody(req);
    if (!command) return sendJson(res, 400, { error: "Missing 'command'" });

    const result = await processService.runCommand({
      projectRoot: root,
      command,
    });

    return sendJson(res, 200, result);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to run process" });
  }
}