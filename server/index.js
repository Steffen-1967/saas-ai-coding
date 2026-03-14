import express from "express";
import cors from "cors";

import configRoutes from "./routes/config.js";
import fileRoutes from "./routes/files.js";
import processRoutes from "./routes/process.js";
import projectRoutes from "./routes/project.js";

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use("/api/config", configRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/process", processRoutes);
app.use("/api/project", projectRoutes);

// Optional: Web-UI
app.use(express.static("ui"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API läuft auf http://localhost:${PORT}`);
});