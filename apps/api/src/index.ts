import express from "express";
import cors from "cors";
import { globalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { optionalClerkAuth } from "./middleware/clerkAuth";
import { ocrRouter } from "./routes/ocr";
import { ocrJobsRouter } from "./routes/ocrJobs";
import { guestStatusHandler } from "./routes/guestStatus";
import { exportRouter } from "./routes/export";

const app = express();

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(globalLimiter);

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.get("/api/ocr/guest-status", optionalClerkAuth, guestStatusHandler);
app.use("/api/ocr/jobs", ocrJobsRouter);
app.use("/api/ocr", ocrRouter);
app.use("/api/export", exportRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
