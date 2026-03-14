import express from "express";
import { loadConfig, saveConfig } from "../services/configService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(loadConfig());
});

router.put("/", (req, res) => {
  saveConfig(req.body);
  res.json({ status: "ok" });
});

export default router;