"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reportRoutes;
const express_1 = require("express");
function reportRoutes(db) {
    const r = (0, express_1.Router)();
    r.get("/hours-by-pic", (_req, res) => {
        const agg = {};
        db.tasks.forEach(t => {
            const key = (t.pic ?? "UNKNOWN").toString();
            agg[key] = (agg[key] ?? 0) + (Number(t.hours) || 0);
        });
        res.json(agg);
    });
    r.get("/hours-by-sr", (_req, res) => {
        const agg = {};
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
