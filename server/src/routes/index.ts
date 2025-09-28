import { Router } from "express";

import dashboardRoutes from "./dashboard";
import backlogRoutes from "./backlog";
import taskRoutes from "./tasks";
import reportRoutes from "./reports";

export default function createRoutes() {
  const router = Router();

  // Nếu dashboard vẫn mock thì truyền db hoặc sửa sau,
  // ở đây giả sử cũng đã chuyển sang Prisma → bỏ db.
  router.use("/dashboard", dashboardRoutes());
  router.use("/backlog", backlogRoutes());
  router.use("/tasks", taskRoutes());
  router.use("/reports", reportRoutes());

  return router;
}
