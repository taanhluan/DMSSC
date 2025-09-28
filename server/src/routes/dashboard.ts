// src/routes/dashboard.ts
import { Router } from "express";
// import { prisma } from "../db/prisma"; // bật lên nếu cần query DB

export default function dashboardRoutes() {
  const r = Router();

  // Ví dụ: mock hoặc query thật
  r.get("/", async (_req, res) => {
    // const count = await prisma.backlog.count();
    // res.json({ ok: true, backlogCount: count });
    res.json({ ok: true });
  });

  return r;
}
