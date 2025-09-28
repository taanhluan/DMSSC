// src/routes/reports.ts
import { Router } from "express";
import { prisma } from "../db/prisma";

function parseDate(q?: string) {
  if (!q) return undefined;
  // nhận 'YYYY-MM-DD' hoặc chuỗi Date hợp lệ
  const d = new Date(q);
  return isNaN(d.getTime()) ? undefined : d;
}

function toCsv(rows: any[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape((r as any)[h])).join(",")),
  ];
  return lines.join("\n");
}

export default function reportRoutes() {
  const r = Router();

  // GET /api/reports/backlog?from=2025-09-01&to=2025-09-30&owner=...&status=...&priority=...
  r.get("/backlog", async (req, res) => {
    try {
      const { from, to, owner, status, priority, onOff, q } = req.query as Record<
        string,
        string | undefined
      >;

      const fromDate = parseDate(from);
      const toDate = parseDate(to);

      const where: any = {};
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }
      if (owner) where.owner = { contains: owner, mode: "insensitive" };
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (onOff) where.onOff = onOff;
      if (q) {
        where.OR = [
          { sr: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ];
      }

      const rows = await prisma.backlog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          sr: true,
          description: true,
          owner: true,
          priority: true,
          status: true,
          onOff: true,
          progress: true,
          startDate: true,
          endDate: true,
          complex: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({ count: rows.length, rows });
    } catch (e) {
      console.error("[GET /reports/backlog]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // GET /api/reports/backlog/summary?from=...&to=...
  // Trả về tổng hợp theo owner và theo status
  r.get("/backlog/summary", async (req, res) => {
    try {
      const { from, to } = req.query as Record<string, string | undefined>;
      const fromDate = parseDate(from);
      const toDate = parseDate(to);

      const baseWhere: any = {};
      if (fromDate || toDate) {
        baseWhere.createdAt = {};
        if (fromDate) baseWhere.createdAt.gte = fromDate;
        if (toDate) baseWhere.createdAt.lte = toDate;
      }

      const [byOwner, byStatus] = await Promise.all([
        prisma.backlog.groupBy({
          by: ["owner"],
          where: baseWhere,
          _count: { _all: true },
          _avg: { progress: true },
        }),
        prisma.backlog.groupBy({
          by: ["status"],
          where: baseWhere,
          _count: { _all: true },
          _avg: { progress: true },
        }),
      ]);

      res.json({
        byOwner: byOwner.map((x) => ({
          owner: x.owner,
          count: x._count._all,
          progressAvg: x._avg.progress ?? 0,
        })),
        byStatus: byStatus.map((x) => ({
          status: x.status,
          count: x._count._all,
          progressAvg: x._avg.progress ?? 0,
        })),
      });
    } catch (e) {
      console.error("[GET /reports/backlog/summary]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // GET /api/reports/backlog/export.csv?... (cùng filter như /backlog)
  r.get("/backlog/export.csv", async (req, res) => {
    try {
      const { from, to, owner, status, priority, onOff, q } = req.query as Record<
        string,
        string | undefined
      >;

      const fromDate = parseDate(from);
      const toDate = parseDate(to);

      const where: any = {};
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }
      if (owner) where.owner = { contains: owner, mode: "insensitive" };
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (onOff) where.onOff = onOff;
      if (q) {
        where.OR = [
          { sr: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ];
      }

      const rows = await prisma.backlog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        select: {
          sr: true,
          description: true,
          owner: true,
          priority: true,
          status: true,
          onOff: true,
          progress: true,
          startDate: true,
          endDate: true,
          complex: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const shaped = rows.map((r) => ({
        SR: r.sr,
        Description: r.description,
        Owner: r.owner,
        Priority: r.priority,
        Status: r.status,
        OnOff: r.onOff,
        Progress: r.progress ?? 0,
        StartDate: r.startDate?.toISOString() ?? "",
        EndDate: r.endDate?.toISOString() ?? "",
        Complex: r.complex ?? "",
        CreatedAt: r.createdAt.toISOString(),
        UpdatedAt: r.updatedAt.toISOString(),
      }));

      const csv = toCsv(shaped);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="backlog-export.csv"`);
      res.send(csv);
    } catch (e) {
      console.error("[GET /reports/backlog/export.csv]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  return r;
}
