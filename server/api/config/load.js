// server/api/config/load.js
import { sendJson } from "../_utils.js";
import * as configService from "../../services/configService.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const config = await configService.loadConfig();
    return sendJson(res, 200, config);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to load config" });
  }
}