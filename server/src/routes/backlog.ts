import { Router } from "express";
import { prisma } from "../db/prisma";

export default function backlogRoutes() {
  const r = Router();

  // GET /api/backlog
  r.get("/", async (_req, res) => {
    try {
      const rows = await prisma.backlog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      });
      res.json(rows);
    } catch (e) {
      console.error("[GET /backlog]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // POST /api/backlog
  r.post("/", async (req, res) => {
    try {
      const b = req.body ?? {};
      const created = await prisma.backlog.create({
        data: {
          sr: b.sr ?? "",
          description: b.description ?? "",
          site: b.site ?? null,
          owner: b.owner ?? null,
          priority: b.priority ?? "MEDIUM",
          startDate: b.startDate ? new Date(b.startDate) : null,
          endDate: b.endDate ? new Date(b.endDate) : null,
          status: b.status ?? "NEW",
          onOff: b.onOff ?? "ON",
          progress: typeof b.progress === "number" ? b.progress : 0,
          complex: b.complex ?? null,
          tracks: Array.isArray(b.tracks) ? b.tracks : [],
        },
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("[POST /backlog]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // PUT /api/backlog/:id
  r.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const b = req.body ?? {};
      const updated = await prisma.backlog.update({
        where: { id },
        data: {
          sr: b.sr,
          description: b.description,
          site: b.site,
          owner: b.owner,
          priority: b.priority,
          startDate: b.startDate ? new Date(b.startDate) : undefined,
          endDate: b.endDate ? new Date(b.endDate) : undefined,
          status: b.status,
          onOff: b.onOff,
          progress: typeof b.progress === "number" ? b.progress : undefined,
          complex: b.complex,
          tracks: Array.isArray(b.tracks) ? b.tracks : undefined,
        },
      });
      res.json(updated);
    } catch (e: any) {
      if (e?.code === "P2025") return res.status(404).json({ error: "not found" });
      console.error("[PUT /backlog/:id]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // DELETE /api/backlog/:id
  r.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await prisma.backlog.delete({ where: { id } });
      res.json(deleted);
    } catch (e: any) {
      if (e?.code === "P2025") return res.status(404).json({ error: "not found" });
      console.error("[DELETE /backlog/:id]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  return r;
}
