// src/db/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  // Để dùng prisma.$on('warn' | 'error'), phải emit = 'event'
  log: [
    { level: "warn",  emit: "event" },
    { level: "error", emit: "event" },
    // nếu cần thêm:
    // { level: "info",  emit: "event" },
    // { level: "query", emit: "event" },
  ],
});

// Listener chỉ cho các level đã khai báo ở trên
prisma.$on("warn",  (e) => console.warn("[Prisma warn]", e));
prisma.$on("error", (e) => console.error("[Prisma error]", e));
