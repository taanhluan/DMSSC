"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = backlogRoutes;
// src/routes/backlog.ts
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const uuid_1 = require("uuid"); // <-- THÊM
function backlogRoutes() {
    const r = (0, express_1.Router)();
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
    r.post("/", async (req, res) => {
        try {
            const b = req.body ?? {};
            const created = await prisma_1.prisma.backlog.create({
                data: {
                    id: (0, uuid_1.v4)(), // <-- THÊM ID
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
                    // tracks: giữ nguyên như bạn đang có; nếu sau này là quan hệ sẽ chuyển sang nested create
                    tracks: Array.isArray(b.tracks) ? b.tracks : [],
                },
            });
            res.status(201).json(created);
        }
        catch (e) {
            console.error("[POST /backlog]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    // PUT/DELETE giữ nguyên
    return r;
}
