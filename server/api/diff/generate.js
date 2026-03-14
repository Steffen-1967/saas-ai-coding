// server/api/diff/generate.js
import { sendJson, readJsonBody } from "../_utils.js";
import * as diffService from "../../services/diffService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const { original, modified, path } = await readJsonBody(req);
    if (original == null || modified == null) {
      return sendJson(res, 400, { error: "Missing 'original' or 'modified'" });
    }

    const diff = await diffService.generateDiff(original, modified, path);
    return sendJson(res, 200, { diff });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to generate diff" });
  }
}