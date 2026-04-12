import { Router } from "express";
import { requireClerkAuth } from "../middleware/clerkAuth";
import { getDb } from "../db";
import {
    getOcrJobForUser,
    listOcrJobsForUser,
} from "../services/ocrPersistence";

export const ocrJobsRouter = Router();

ocrJobsRouter.use(requireClerkAuth);

ocrJobsRouter.get("/", async (req, res, next) => {
    try {
        const userId = req.auth!.userId;
        const db = getDb();
        const jobs = await listOcrJobsForUser(db, userId);
        res.json({ jobs });
    } catch (e) {
        next(e);
    }
});

ocrJobsRouter.get("/:id", async (req, res, next) => {
    try {
        const userId = req.auth!.userId;
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Job id required" });
            return;
        }
        const db = getDb();
        const job = await getOcrJobForUser(db, userId, id);
        if (!job) {
            res.status(404).json({ error: "Job not found", code: "NOT_FOUND" });
            return;
        }
        res.json(job);
    } catch (e) {
        next(e);
    }
});
