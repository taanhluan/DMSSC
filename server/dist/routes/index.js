"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRoutes;
const express_1 = require("express");
const dashboard_1 = __importDefault(require("./dashboard"));
const backlog_1 = __importDefault(require("./backlog"));
const tasks_1 = __importDefault(require("./tasks"));
const reports_1 = __importDefault(require("./reports"));
function createRoutes(db) {
    const router = (0, express_1.Router)();
    router.use("/dashboard", (0, dashboard_1.default)(db));
    router.use("/backlog", (0, backlog_1.default)(db));
    router.use("/tasks", (0, tasks_1.default)(db));
    router.use("/reports", (0, reports_1.default)(db));
    return router;
}
