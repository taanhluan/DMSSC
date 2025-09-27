"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dashboardRoutes;
const express_1 = require("express");
function dashboardRoutes(db) {
    const r = (0, express_1.Router)();
    r.get("/", (_req, res) => {
        const totalTasks = db.tasks.length;
        const done = db.tasks.filter(t => t.status === "DONE").length;
        const open = totalTasks - done;
        const hours = db.tasks.reduce((a, b) => a + (Number(b.hours) || 0), 0);
        res.json({ backlog: db.backlog.length, tasks: totalTasks, done, open, hours });
    });
    return r;
}
