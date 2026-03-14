// server/api/project/info.js
import { sendJson } from "../_utils.js";
import * as configService from "../../services/configService.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const root = await configService.getProjectRoot();
    if (!root) {
      return sendJson(res, 400, { error: "No project open" });
    }

    // Wichtig: configService.loadConfig(root) statt loadConfig()
    const config = await configService.loadConfig(root);

    return sendJson(res, 200, {
      root,
      config
    });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to load project info" });
  }
}