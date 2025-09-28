"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reportRoutes;
// src/routes/reports.ts
const express_1 = require("express");
// import { prisma } from "../db/prisma"; // bật lên nếu cần
function reportRoutes() {
    const r = (0, express_1.Router)();
    r.get("/", async (_req, res) => {
        res.json({ ok: true });
    });
    return r;
}
