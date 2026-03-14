import express from "express";
import { processFiles } from "../core/engine.js";

const router = express.Router();

const tasks = {};

// POST /api/process/start
router.post("/start", async (req, res) => {
  const { mode, dryRun } = req.body;

  const taskId = Date.now().toString();
  tasks[taskId] = {
    status: "running",
    results: [],
    processed: 0
  };

  // Engine asynchron starten
  processFiles(mode, dryRun).then((results) => {
    tasks[taskId].results = results;
    tasks[taskId].processed = results.length;
    tasks[taskId].status = "done";
  });

  res.json({ taskId, status: "started" });
});

// GET /api/process/:taskId/status
router.get("/:taskId/status", (req, res) => {
  const task = tasks[req.params.taskId];
  if (!task) return res.status(404).json({ error: "Unknown task" });
  res.json(task);
});

// GET /api/process/:taskId/results
router.get("/:taskId/results", (req, res) => {
  const task = tasks[req.params.taskId];
  if (!task) return res.status(404).json({ error: "Unknown task" });
  res.json(task.results);
});

export default router;