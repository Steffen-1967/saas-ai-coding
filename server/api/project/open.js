// server/api/project/open.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as configService from "../../services/configService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const { path } = await readJsonBody(req);
    if (!path) {
      return sendJson(res, 400, { error: "Missing 'path'" });
    }

    await configService.setProjectRoot(path);

    return sendJson(res, 200, { ok: true, root: path });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to open project" });
  }
}