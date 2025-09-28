import { Router } from "express";
import { prisma } from "../db/prisma";

export default function taskRoutes() {
  const r = Router();

  // GET /api/tasks
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

  // POST /api/tasks
  r.post("/", async (req, res) => {
    try {
      const b = req.body ?? {};
      const created = await prisma.task.create({
        data: {
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

  // PUT /api/tasks/:id
  r.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const b = req.body ?? {};
      const updated = await prisma.task.update({
        where: { id },
        data: {
          sr: b.sr,
          title: b.title,
          description: b.description,
          site: b.site,
          pic: b.pic,
          status: b.status,
          priority: b.priority,
          startDate: b.startDate ? new Date(b.startDate) : undefined,
          endDate: b.endDate ? new Date(b.endDate) : undefined,
          hours: typeof b.hours === "number" ? b.hours : undefined,
        },
      });
      res.json(updated);
    } catch (e: any) {
      if (e?.code === "P2025") return res.status(404).json({ error: "Not found" });
      console.error("[PUT /tasks/:id]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // DELETE /api/tasks/:id
  r.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await prisma.task.delete({ where: { id } });
      res.json(deleted);
    } catch (e: any) {
      if (e?.code === "P2025") return res.status(404).json({ error: "Not found" });
      console.error("[DELETE /tasks/:id]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  return r;
}
