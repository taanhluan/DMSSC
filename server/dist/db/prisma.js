"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/db/prisma.ts
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    // Để dùng prisma.$on('warn' | 'error'), phải emit = 'event'
    log: [
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" },
        // nếu cần thêm:
        // { level: "info",  emit: "event" },
        // { level: "query", emit: "event" },
    ],
});
// Listener chỉ cho các level đã khai báo ở trên
exports.prisma.$on("warn", (e) => console.warn("[Prisma warn]", e));
exports.prisma.$on("error", (e) => console.error("[Prisma error]", e));
