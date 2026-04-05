import type { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.error(`[Error] ${err.message}`);

    if (err.message.includes("Only JPEG, PNG, and WebP")) {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err.message.includes("Vision API error")) {
        res.status(502).json({ error: err.message });
        return;
    }

    if (
        err.message.includes("File too large") ||
        err.message.includes("LIMIT_FILE_SIZE")
    ) {
        res.status(413).json({
            error: "Image file is too large. Maximum size is 10MB.",
        });
        return;
    }

    if (err.message.includes("GOOGLE_CLOUD_API_KEY")) {
        res.status(503).json({
            error: "OCR service is not configured. Please set up your API key.",
        });
        return;
    }

    res.status(500).json({ error: "Internal server error. Please try again." });
}
