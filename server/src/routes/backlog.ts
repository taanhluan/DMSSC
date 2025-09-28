// src/routes/backlog.ts
import { Router } from "express";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

type BacklogBody = {
  sr?: string;
  description?: string;
  site?: string | null;
  owner?: string | null;
  priority?: string | null;       // ví dụ: "High" | "Medium" | ...
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  status?: string | null;         // ví dụ: "NEW" | "COMPLETED" | ...
  onOff?: string | null;          // ví dụ: "On Track" | ...
  progress?: number | null;       // 0..100
  complex?: string | null;        // giữ kiểu string như DB hiện tại
  tracks?: unknown;               // Json (array/object)
};

// helper ép kiểu ngày
function toDateOrNull(v: unknown): Date | null {
  if (!v) return null;
  const d = typeof v === "string" ? new Date(v) : v instanceof Date ? v : null;
  return isNaN((d as Date)?.getTime?.() || NaN) ? null : (d as Date);
}

// helper: lấy chỉ các field hợp lệ cho PUT
function pickUpdateData(b: BacklogBody) {
  const data: any = {};

  if (b.sr !== undefined) data.sr = b.sr;
  if (b.description !== undefined) data.description = b.description;
  if (b.site !== undefined) data.site = b.site;
  if (b.owner !== undefined) data.owner = b.owner;
  if (b.priority !== undefined) data.priority = b.priority;

  if (b.startDate !== undefined) {
    const d = toDateOrNull(b.startDate);
    data.startDate = d === null ? null : d;
  }
  if (b.endDate !== undefined) {
    const d = toDateOrNull(b.endDate);
    data.endDate = d === null ? null : d;
  }

  if (b.status !== undefined) data.status = b.status;
  if (b.onOff !== undefined) data.onOff = b.onOff;

  if (b.progress !== undefined) {
    const n = Number(b.progress);
    if (Number.isFinite(n)) data.progress = Math.max(0, Math.min(100, Math.trunc(n)));
  }

  if (b.complex !== undefined) data.complex = b.complex;
  if (b.tracks !== undefined) data.tracks = b.tracks; // để Prisma validate JSON

  return data;
}

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
      const b: BacklogBody = req.body ?? {};

      const created = await prisma.backlog.create({
        data: {
          id: uuidv4(), // tạo id phía app (ok dù DB có default)
          sr: b.sr ?? "",
          description: b.description ?? "",
          site: b.site ?? null,
          owner: b.owner ?? null,
          priority: b.priority ?? "MEDIUM",
          startDate: toDateOrNull(b.startDate),
          endDate: toDateOrNull(b.endDate),
          status: b.status ?? "NEW",
          onOff: b.onOff ?? "ON",
          progress: Number.isFinite(Number(b.progress)) ? Math.max(0, Math.min(100, Math.trunc(Number(b.progress)))) : 0,
          complex: b.complex ?? null,
          tracks: b.tracks ?? [], // mảng rỗng mặc định
        },
      });

      res.status(201).json(created);
    } catch (e) {
      console.error("[POST /backlog]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // PUT /api/backlog/:id  (cập nhật mềm: chỉ đụng field được gửi lên)
  r.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const b: BacklogBody = req.body ?? {};
      const data = pickUpdateData(b);

      const updated = await prisma.backlog.update({
        where: { id },
        data,
      });

      res.json(updated);
    } catch (e: any) {
      if (e?.code === "P2025") {
        return res.status(404).json({ error: "not found" });
      }
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
      if (e?.code === "P2025") {
        return res.status(404).json({ error: "not found" });
      }
      console.error("[DELETE /backlog/:id]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  return r;
}
