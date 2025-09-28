// src/routes/index.ts
import { Router } from "express";

import dashboardRoutes from "./dashboard";
import backlogRoutes from "./backlog";
import taskRoutes from "./tasks";
import reportRoutes from "./reports";

export default function createRoutes(): Router {
  const router = Router();

  router.use("/dashboard", dashboardRoutes()); // factory KHÔNG tham số
  router.use("/backlog", backlogRoutes());
  router.use("/tasks", taskRoutes());
  router.use("/reports", reportRoutes());

  return router;
}
