// server/routes/project.js
import express from "express";
import fs from "fs";

const router = express.Router();

// POST /api/project/open
router.post("/open", (req, res) => {
  const { path: projectPath } = req.body;

  if (!projectPath) {
    return res.status(400).json({ error: "Missing project path" });
  }

  if (!fs.existsSync(projectPath)) {
    return res.status(400).json({ error: "Path does not exist" });
  }

  // Projekt-Root global speichern
  req.app.locals.projectRoot = projectPath;

  return res.json({ ok: true, root: projectPath });
});

// GET /api/project/info
router.get("/info", (req, res) => {
  const root = req.app.locals.projectRoot;

  if (!root) {
    return res.status(400).json({ error: "No project opened" });
  }

  return res.json({ root });
});

export default router;