import { Router } from "express";
import multer from "multer";
import { ocrLimiter } from "../middleware/rateLimiter";
import { detectText } from "../services/vision";
import { preprocessImage } from "../services/imagePreprocess";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
        }
    },
});

export const ocrRouter = Router();

ocrRouter.post(
    "/",
    ocrLimiter,
    upload.single("image"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No image file provided" });
                return;
            }

            const language = (req.body.language as string) || "auto";
            const skipPreprocess = req.body.skipPreprocess === "true";

            const imageBuffer = skipPreprocess
                ? req.file.buffer
                : await preprocessImage(req.file.buffer);

            const base64Image = imageBuffer.toString("base64");
            const languageHints = buildLanguageHints(language);
            const result = await detectText(base64Image, languageHints);

            res.json(result);
        } catch (error) {
            next(error);
        }
    },
);

function buildLanguageHints(language: string): string[] {
    switch (language) {
        case "en":
            return ["en"];
        case "hi":
            return ["hi"];
        case "en+hi":
            return ["en", "hi"];
        case "auto":
        default:
            return [];
    }
}
