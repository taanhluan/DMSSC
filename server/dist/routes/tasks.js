"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = taskRoutes;
// src/routes/tasks.ts
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const uuid_1 = require("uuid"); // <-- THÊM DÒNG NÀY
function taskRoutes() {
    const r = (0, express_1.Router)();
    r.get("/", async (_req, res) => {
        try {
            const rows = await prisma_1.prisma.task.findMany({
                orderBy: { createdAt: "desc" },
                take: 200,
            });
            res.json(rows);
        }
        catch (e) {
            console.error("[GET /tasks]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    r.post("/", async (req, res) => {
        try {
            const b = req.body ?? {};
            const created = await prisma_1.prisma.task.create({
                data: {
                    id: (0, uuid_1.v4)(), // <-- THÊM ID
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
        }
        catch (e) {
            console.error("[POST /tasks]", e);
            res.status(500).json({ error: "DB error" });
        }
    });
    // phần PUT/DELETE giữ nguyên
    return r;
}
