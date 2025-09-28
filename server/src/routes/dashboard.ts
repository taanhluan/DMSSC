// src/routes/dashboard.ts
import { Router } from "express";
import { prisma } from "../db/prisma";

function parseIntSafe(v: any, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

export default function dashboardRoutes() {
  const r = Router();

  // GET /api/dashboard
  r.get("/", async (_req, res) => {
    try {
      // 1) Totals
      const [backlogCount, taskCount] = await Promise.all([
        prisma.backlog.count(),
        prisma.task.count(),
      ]);

      // 2) Progress avg (chỉ tính bản ghi có progress != null)
      const progressRows = await prisma.backlog.findMany({
        select: { progress: true },
        where: { progress: { not: null } },
      });
      const progressAvg = progressRows.length
        ? Math.round(
            progressRows.reduce((s, x) => s + parseIntSafe(x.progress, 0), 0) /
              progressRows.length
          )
        : 0;

      // 3) Breakdown
      const [byStatus, byPriority, byOnOff] = await Promise.all([
        prisma.backlog.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.backlog.groupBy({
          by: ["priority"],
          _count: { _all: true },
        }),
        prisma.backlog.groupBy({
          by: ["onOff"],
          _count: { _all: true },
        }),
      ]);

      // 4) Recent items
      const recent = await prisma.backlog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
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
          createdAt: true,
          updatedAt: true,
        },
      });

      // 5) Upcoming (coi startDate là due)
      const now = new Date();
      const soon = new Date(now);
      soon.setDate(soon.getDate() + 14); // 14 ngày tới

      const upcoming = await prisma.backlog.findMany({
        where: {
          startDate: { gt: now, lte: soon },
        },
        orderBy: { startDate: "asc" },
        take: 10,
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
        },
      });

      res.json({
        totals: { backlogCount, taskCount },
        progressAvg,
        breakdown: {
          byStatus: byStatus.map((x) => ({ key: x.status, count: x._count._all })),
          byPriority: byPriority.map((x) => ({ key: x.priority, count: x._count._all })),
          byOnOff: byOnOff.map((x) => ({ key: x.onOff, count: x._count._all })),
        },
        recent,
        upcoming,
      });
    } catch (e) {
      console.error("[GET /dashboard]", e);
      res.status(500).json({ error: "DB error" });
    }
  });

  return r;
}
