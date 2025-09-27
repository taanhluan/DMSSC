import { Router } from "express";
import type { DB } from "../db";

export default function reportRoutes(db: DB) {
  const r = Router();

  r.get("/hours-by-pic", (_req, res) => {
    const agg: Record<string, number> = {};
    db.tasks.forEach(t => {
      const key = (t.pic ?? "UNKNOWN").toString();
      agg[key] = (agg[key] ?? 0) + (Number(t.hours) || 0);
    });
    res.json(agg);
  });

  r.get("/hours-by-sr", (_req, res) => {
    const agg: Record<string, number> = {};
    db.tasks.forEach(t => {
      const key = (t.sr ?? "UNKNOWN").toString();
      agg[key] = (agg[key] ?? 0) + (Number(t.hours) || 0);
    });
    res.json(agg);
  });

  r.get("/", (_req, res) => {
    res.json({ ok: true, endpoints: ["/hours-by-pic", "/hours-by-sr"] });
  });

  return r;
}
