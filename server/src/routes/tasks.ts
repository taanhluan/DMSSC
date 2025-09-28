// src/routes/tasks.ts
import { Router } from "express";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid"; // <-- THÊM DÒNG NÀY

export default function taskRoutes() {
  const r = Router();

  r.get("/", async (_req, res) => {
    try {
      const rows = await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      });
      res.json(rows);
    } catch (e) {
      console.error("[GET /tasks]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  r.post("/", async (req, res) => {
    try {
      const b = req.body ?? {};
      const created = await prisma.task.create({
        data: {
          id: uuidv4(), // <-- THÊM ID
          sr: b.sr ?? "",
          title: b.title ?? "",
          description: b.description ?? null,
          site: b.site ?? null,
          pic: b.pic ?? null,
          status: b.status ?? "NEW",
          priority: b.priority ?? "MEDIUM",
          startDate: b.startDate ? new Date(b.startDate) : null,
          endDate: b.endDate ? new Date(b.endDate) : null,
          hours: typeof b.hours === "number" ? b.hours : 0,
        },
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("[POST /tasks]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // phần PUT/DELETE giữ nguyên
  return r;
}
