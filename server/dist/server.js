"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Root route (homepage)
app.get("/", (_req, res) => {
    res.send("🚀 DMSSC Backend is running!");
});
// Health check (Render dùng để kiểm tra service)
app.get("/health", (_req, res) => res.json({ ok: true }));
// API routes
app.use("/api", (0, routes_1.default)(db_1.db));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API listening on :${PORT}`);
});
