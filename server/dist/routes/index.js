import { Router } from "express";
import dashboardRoutes from "./dashboard";
import backlogRoutes from "./backlog";
import taskRoutes from "./tasks";
import reportRoutes from "./reports";
export default function createRoutes(db) {
    const router = Router();
    router.use("/dashboard", dashboardRoutes(db));
    router.use("/backlog", backlogRoutes(db));
    router.use("/tasks", taskRoutes(db));
    router.use("/reports", reportRoutes(db));
    return router;
}
