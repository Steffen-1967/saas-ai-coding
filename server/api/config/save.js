// server/api/config/save.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as configService from "../../services/configService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const newConfig = await readJsonBody(req);
    await configService.saveConfig(newConfig);
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to save config" });
  }
}