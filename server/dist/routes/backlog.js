"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = backlogRoutes;
const express_1 = require("express");
const db_1 = require("../db");
function backlogRoutes(db) {
    const r = (0, express_1.Router)();
    r.get("/", (_req, res) => res.json(db.backlog));
    r.post("/", (req, res) => {
        const b = (req.body ?? {});
        const item = {
            id: (0, db_1.newId)("BL"),
            sr: b.sr ?? "",
            description: b.description ?? "",
            site: b.site ?? null,
            owner: b.owner ?? null,
            priority: b.priority ?? "MEDIUM",
            startDate: b.startDate ?? null,
            endDate: b.endDate ?? null,
            status: b.status ?? "NEW",
            onOff: b.onOff ?? "ON",
            progress: b.progress ?? 0,
            complex: b.complex ?? "",
            tracks: (Array.isArray(b.tracks) ? b.tracks : []),
        };
        db.backlog.push(item);
        res.status(201).json(item);
    });
    r.put("/:id", (req, res) => {
        const item = db.backlog.find(x => x.id === req.params.id);
        if (!item)
            return res.status(404).json({ error: "not found" });
        const b = (req.body ?? {});
        Object.assign(item, {
            sr: b.sr ?? item.sr,
            description: b.description ?? item.description,
            site: b.site ?? item.site,
            owner: b.owner ?? item.owner,
            priority: b.priority ?? item.priority,
            startDate: b.startDate ?? item.startDate,
            endDate: b.endDate ?? item.endDate,
            status: b.status ?? item.status,
            onOff: b.onOff ?? item.onOff,
            progress: b.progress ?? item.progress,
            complex: b.complex ?? item.complex,
            tracks: Array.isArray(b.tracks) ? b.tracks : item.tracks,
        });
        res.json(item);
    });
    r.delete("/:id", (req, res) => {
        const idx = db.backlog.findIndex(x => x.id === req.params.id);
        if (idx < 0)
            return res.status(404).json({ error: "not found" });
        const [del] = db.backlog.splice(idx, 1);
        res.json(del);
    });
    return r;
}
