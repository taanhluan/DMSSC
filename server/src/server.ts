import express from "express";
import cors from "cors";
import createRoutes from "./routes";
// ❌ bỏ: import { db } from "./db";

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

// API routes -> KHÔNG truyền db vào nữa
app.use("/api", createRoutes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});

// (optional) graceful shutdown cho Prisma nếu bạn dùng Prisma
// import { prisma } from "./db/prisma";
// process.on("SIGINT", async () => { await prisma.$disconnect(); process.exit(0); });
// process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });
