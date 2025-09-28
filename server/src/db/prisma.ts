import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Optional: log lỗi không làm sập process
prisma.$on("error", (e) => console.error("[Prisma error]", e));
