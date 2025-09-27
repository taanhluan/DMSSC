import { Router } from "express";
import type { DB, BacklogItem } from "../db";
import { newId } from "../db";

export default function backlogRoutes(db: DB) {
  const r = Router();

  r.get("/", (_req, res) => res.json(db.backlog));

  r.post("/", (req, res) => {
    const b = (req.body ?? {}) as Partial<BacklogItem>;
    const item: BacklogItem = {
      id: newId("BL"),
      sr: b.sr ?? "",
      description: b.description ?? "",
      site: (b as any).site ?? null,
      owner: (b as any).owner ?? null,
      priority: b.priority ?? "MEDIUM",
      startDate: (b.startDate as string | null) ?? null,
      endDate: (b.endDate as string | null) ?? null,
      status: (b as any).status ?? "NEW",
      onOff: (b as any).onOff ?? "ON",
      progress: (b as any).progress ?? 0,
      complex: (b as any).complex ?? "",
      tracks: (Array.isArray((b as any).tracks) ? (b as any).tracks : []) as any,
    };
    db.backlog.push(item);
    res.status(201).json(item);
  });

  r.put("/:id", (req, res) => {
    const item = db.backlog.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: "not found" });

    const b = (req.body ?? {}) as Partial<BacklogItem>;
    Object.assign(item, {
      sr: b.sr ?? item.sr,
      description: b.description ?? item.description,
      site: (b as any).site ?? item.site,
      owner: (b as any).owner ?? item.owner,
      priority: b.priority ?? item.priority,
      startDate: (b.startDate as string | null) ?? item.startDate,
      endDate: (b.endDate as string | null) ?? item.endDate,
      status: (b as any).status ?? item.status,
      onOff: (b as any).onOff ?? item.onOff,
      progress: (b as any).progress ?? item.progress,
      complex: (b as any).complex ?? item.complex,
      tracks: Array.isArray((b as any).tracks) ? (b as any).tracks : item.tracks,
    });

    res.json(item);
  });

  r.delete("/:id", (req, res) => {
    const idx = db.backlog.findIndex(x => x.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: "not found" });
    const [del] = db.backlog.splice(idx, 1);
    res.json(del);
  });

  return r;
}
