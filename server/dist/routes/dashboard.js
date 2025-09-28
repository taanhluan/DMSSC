"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dashboardRoutes;
// src/routes/dashboard.ts
const express_1 = require("express");
// import { prisma } from "../db/prisma"; // bật lên nếu cần query DB
function dashboardRoutes() {
    const r = (0, express_1.Router)();
    // Ví dụ: mock hoặc query thật
    r.get("/", async (_req, res) => {
        // const count = await prisma.backlog.count();
        // res.json({ ok: true, backlogCount: count });
        res.json({ ok: true });
    });
    return r;
}
