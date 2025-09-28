// src/routes/reports.ts
import { Router } from "express";
// import { prisma } from "../db/prisma"; // bật lên nếu cần

export default function reportRoutes() {
  const r = Router();

  r.get("/", async (_req, res) => {
    res.json({ ok: true });
  });

  return r;
}
