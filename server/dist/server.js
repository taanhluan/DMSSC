import express from "express";
import cors from "cors";
import createRoutes from "./routes";
import { db } from "./db";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", createRoutes(db));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API listening on :${PORT}`);
});
