"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = taskRoutes;
const express_1 = require("express");
const db_1 = require("../db");
function taskRoutes(db) {
    const r = (0, express_1.Router)();
    r.get("/", (_req, res) => res.json(db.tasks));
    r.post("/", (req, res) => {
        const b = (req.body ?? {});
        const task = {
            id: (0, db_1.newId)("TK"),
            sr: b.sr ?? "",
            title: b.title ?? null,
            description: b.description ?? null,
            site: b.site ?? null,
            pic: b.pic ?? null,
            status: b.status ?? "NEW",
            priority: b.priority ?? "MEDIUM",
            startDate: b.startDate ?? null,
            endDate: b.endDate ?? null,
            hours: b.hours ?? 0
        };
        db.tasks.push(task);
        res.status(201).json(task);
    });
    r.put("/:id", (req, res) => {
        const item = db.tasks.find(x => x.id === req.params.id);
        if (!item)
            return res.status(404).json({ error: "Not found" });
        Object.assign(item, req.body ?? {});
        res.json(item);
    });
    r.delete("/:id", (req, res) => {
        const idx = db.tasks.findIndex(x => x.id === req.params.id);
        if (idx === -1)
            return res.status(404).json({ error: "Not found" });
        const [removed] = db.tasks.splice(idx, 1);
        res.json(removed);
    });
    return r;
}
