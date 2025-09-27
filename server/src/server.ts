import express from "express";
import cors from "cors";
import createRoutes from "./routes";
import { db } from "./db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route (homepage)
app.get("/", (_req, res) => {
  res.send("🚀 DMSSC Backend is running!");
});

// Health check (Render dùng để kiểm tra service)
app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/api", createRoutes(db));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
