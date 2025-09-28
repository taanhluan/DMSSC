"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = backlogRoutes;
// src/routes/backlog.ts
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const uuid_1 = require("uuid");
// helper ép kiểu ngày
function toDateOrNull(v) {
    if (!v)
        return null;
    const d = typeof v === "string" ? new Date(v) : v instanceof Date ? v : null;
    return isNaN(d?.getTime?.() || NaN) ? null : d;
}
// helper: lấy chỉ các field hợp lệ cho PUT
function pickUpdateData(b) {
    const data = {};
    if (b.sr !== undefined)
        data.sr = b.sr;
    if (b.description !== undefined)
        data.description = b.description;
    if (b.site !== undefined)
        data.site = b.site;
    if (b.owner !== undefined)
        data.owner = b.owner;
    if (b.priority !== undefined)
        data.priority = b.priority;
    if (b.startDate !== undefined) {
        const d = toDateOrNull(b.startDate);
        data.startDate = d === null ? null : d;
    }
    if (b.endDate !== undefined) {
        const d = toDateOrNull(b.endDate);
        data.endDate = d === null ? null : d;
    }
    if (b.status !== undefined)
        data.status = b.status;
    if (b.onOff !== undefined)
        data.onOff = b.onOff;
    if (b.progress !== undefined) {
        const n = Number(b.progress);
        if (Number.isFinite(n))
            data.progress = Math.max(0, Math.min(100, Math.trunc(n)));
    }
    if (b.complex !== undefined)
        data.complex = b.complex;
    if (b.tracks !== undefined)
        data.tracks = b.tracks; // để Prisma validate JSON
    return data;
}
function backlogRoutes() {
    const r = (0, express_1.Router)();
    // GET /api/backlog
    r.get("/", async (_req, res) => {
        try {
            const rows = await prisma_1.prisma.backlog.findMany({
                orderBy: { createdAt: "desc" },
                take: 200,
            });
            res.json(rows);
        }
        catch (e) {
            console.error("[GET /backlog]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    // POST /api/backlog
    r.post("/", async (req, res) => {
        try {
            const b = req.body ?? {};
            const created = await prisma_1.prisma.backlog.create({
                data: {
                    id: (0, uuid_1.v4)(), // tạo id phía app (ok dù DB có default)
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
        }
        catch (e) {
            console.error("[POST /backlog]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    // PUT /api/backlog/:id  (cập nhật mềm: chỉ đụng field được gửi lên)
    r.put("/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const b = req.body ?? {};
            const data = pickUpdateData(b);
            const updated = await prisma_1.prisma.backlog.update({
                where: { id },
                data,
            });
            res.json(updated);
        }
        catch (e) {
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
            const deleted = await prisma_1.prisma.backlog.delete({ where: { id } });
            res.json(deleted);
        }
        catch (e) {
            if (e?.code === "P2025") {
                return res.status(404).json({ error: "not found" });
            }
            console.error("[DELETE /backlog/:id]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    return r;
}
