"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRoutes;
// src/routes/index.ts
const express_1 = require("express");
const dashboard_1 = __importDefault(require("./dashboard"));
const backlog_1 = __importDefault(require("./backlog"));
const tasks_1 = __importDefault(require("./tasks"));
const reports_1 = __importDefault(require("./reports"));
function createRoutes() {
    const router = (0, express_1.Router)();
    router.use("/dashboard", (0, dashboard_1.default)()); // factory KHÔNG tham số
    router.use("/backlog", (0, backlog_1.default)());
    router.use("/tasks", (0, tasks_1.default)());
    router.use("/reports", (0, reports_1.default)());
    return router;
}
