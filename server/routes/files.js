import express from "express";
import * as fileService from "../services/fileService.js";
import { sendJson } from "../_utils.js";

const router = express.Router();

// GET /api/files/tree
router.get("/tree", async (req, res) => {
  try {
    const root = req.app.locals.projectRoot;

    // OPTION C: Prüfen, ob Projekt geöffnet wurde
    if (!root) {
      return sendJson(res, 400, { error: "No project opened" });
    }

    const basePath = req.query.path || "";
    const tree = await fileService.getTree(root, basePath);
    return sendJson(res, 200, { path: basePath, items: tree });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to load file tree" });
  }
});

// GET /api/files/read
router.get("/read", async (req, res) => {
  try {
    const root = req.app.locals.projectRoot;

    // OPTION C
    if (!root) {
      return sendJson(res, 400, { error: "No project opened" });
    }

    const filePath = req.query.path;
    const content = await fileService.readFile(root, filePath);
    return sendJson(res, 200, { content });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to read file" });
  }
});

// POST /api/files/write
router.post("/write", async (req, res) => {
  try {
    const root = req.app.locals.projectRoot;

    // OPTION C
    if (!root) {
      return sendJson(res, 400, { error: "No project opened" });
    }

    const { path, content } = req.body;
    await fileService.writeFile(root, path, content);
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Failed to write file" });
  }
});

export default router;
